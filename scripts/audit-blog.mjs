/**
 * Audit published blog posts in Firestore.
 * Usage: node scripts/audit-blog.mjs
 */
import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env) || !process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseServiceAccount() {
  const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "");
  sa.private_key = String(sa.private_key).replace(/\\n/g, "\n");
  return sa;
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const jwt = `${unsigned}.${signer.sign(sa.private_key, "base64url")}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(JSON.stringify(json));
  return json.access_token;
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function field(f, k) {
  const v = f?.[k];
  if (!v) return "";
  if (v.stringValue != null) return v.stringValue;
  if (v.integerValue != null) return String(v.integerValue);
  if (v.booleanValue != null) return String(v.booleanValue);
  return "";
}

const sa = parseServiceAccount();
const token = await getAccessToken(sa);
const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/databases/(default)/documents/blog_posts?pageSize=50`;
const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
const data = await res.json();

const posts = (data.documents || []).map((d) => {
  const f = d.fields || {};
  const content = field(f, "content");
  const text = stripHtml(content);
  const words = text.split(/\s+/).filter(Boolean);
  const h2 = [...content.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    stripHtml(m[1]),
  );
  return {
    id: d.name.split("/").pop(),
    title: field(f, "title"),
    slug: field(f, "slug"),
    category: field(f, "category"),
    status: field(f, "status"),
    author: field(f, "author"),
    authorSlug: field(f, "authorSlug"),
    excerpt: field(f, "excerpt"),
    metaTitle: field(f, "metaTitle"),
    metaDescription: field(f, "metaDescription"),
    featuredImage: Boolean(field(f, "featuredImage")),
    words: words.length,
    chars: text.length,
    h2,
    hasH3: /<h3/i.test(content),
    hasUl: /<ul/i.test(content),
    hasFaq: /faq|أسئلة شائعة|الأسئلة الشائعة/i.test(content),
    hasCta: /\/contact|تواصل|واتساب|اطلب عرض|ابدأ/i.test(content),
    hasInternal: /href=["']\//i.test(content),
    englishHeavy: (text.match(/[A-Za-z]{4,}/g) || []).length > words.length * 0.35,
    preview: text.slice(0, 280),
  };
});

posts.sort((a, b) => a.title.localeCompare(b.title, "ar"));
console.log(JSON.stringify(posts, null, 2));
console.log("\n--- SUMMARY ---");
console.log("count:", posts.length);
console.log(
  "published:",
  posts.filter((p) => p.status === "published" || !p.status).length,
);
