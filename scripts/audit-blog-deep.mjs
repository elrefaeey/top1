/**
 * Deep content audit for published blog posts (read-only).
 * Usage: node scripts/audit-blog-deep.mjs
 */
import { createSign } from "node:crypto";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
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
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function field(f, k) {
  const v = f?.[k];
  if (!v) return "";
  if (v.stringValue != null) return v.stringValue;
  if (v.integerValue != null) return String(v.integerValue);
  if (v.booleanValue != null) return String(v.booleanValue);
  if (v.arrayValue?.values) {
    return v.arrayValue.values.map((x) => x.stringValue || "").filter(Boolean);
  }
  return "";
}

function extractHeadings(content, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  return [...content.matchAll(re)].map((m) => stripHtml(m[1]));
}

function countPhrase(text, phrase) {
  if (!phrase) return 0;
  const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
  return (text.match(re) || []).length;
}

function uniqueSimilarH2(h2s) {
  // Detect city/neighborhood template pattern: many H2s sharing same prefix
  const prefixes = {};
  for (const h of h2s) {
    const key = h.replace(/\s+(في|ب)\s+.+$/u, "").slice(0, 40);
    prefixes[key] = (prefixes[key] || 0) + 1;
  }
  return Object.entries(prefixes)
    .filter(([, n]) => n >= 4)
    .map(([k, n]) => ({ prefix: k, count: n }));
}

const CITY_MARKERS = [
  "بريدة",
  "عنيزة",
  "الرس",
  "البكيرية",
  "المذنب",
  "البدائع",
  "رياض الخبراء",
  "عيون الجواء",
  "النبهانية",
  "الشماسية",
  "القصيم",
  "دبي",
  "أبوظبي",
  "الشارقة",
  "عجمان",
  "رأس الخيمة",
  "الفجيرة",
  "أم القيوين",
  "الرياض",
  "جدة",
  "الدمام",
];

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
  const h1 = extractHeadings(content, "h1");
  const h2 = extractHeadings(content, "h2");
  const h3 = extractHeadings(content, "h3");
  const imgs = [...content.matchAll(/<img[^>]*>/gi)].map((m) => {
    const tag = m[0];
    const src = (tag.match(/src=["']([^"']+)/i) || [])[1] || "";
    const alt = (tag.match(/alt=["']([^"']*)/i) || [])[1];
    return { src: src.slice(0, 80), alt: alt ?? null, hasAlt: alt != null && alt.trim() !== "" };
  });
  const internalHrefs = [
    ...content.matchAll(/href=["'](\/[^"'#?]*)/gi),
  ].map((m) => m[1]);
  const externalHrefs = [
    ...content.matchAll(/href=["'](https?:\/\/[^"']+)/gi),
  ]
    .map((m) => m[1])
    .filter((u) => !/top1markting\.com/i.test(u));

  const cityHits = {};
  for (const c of CITY_MARKERS) {
    const n = countPhrase(text, c);
    if (n > 0) cityHits[c] = n;
  }

  const phoneInTitle = /\d{8,}/.test(field(f, "title"));
  const discountInTitle = /خصم|%|عرض/i.test(field(f, "title"));
  const brandRepeats = countPhrase(text, "Top 1 Markting") + countPhrase(text, "Top1Markting") + countPhrase(text, "توب 1");

  return {
    id: d.name.split("/").pop(),
    title: field(f, "title"),
    slug: field(f, "slug"),
    category: field(f, "category"),
    status: field(f, "status"),
    author: field(f, "author"),
    authorSlug: field(f, "authorSlug"),
    authorAvatar: field(f, "authorAvatar"),
    excerpt: field(f, "excerpt"),
    metaTitle: field(f, "metaTitle"),
    metaDescription: field(f, "metaDescription"),
    featuredImage: field(f, "featuredImage"),
    featuredImageAlt: field(f, "featuredImageAlt"),
    faqSchema: Boolean(field(f, "faqSchema")),
    tags: field(f, "tags"),
    publishedAt: field(f, "publishedAt") || field(f, "createdAt"),
    updatedAt: field(f, "updatedAt"),
    words: words.length,
    chars: text.length,
    h1,
    h2,
    h3Count: h3.length,
    h3Sample: h3.slice(0, 8),
    similarH2Clusters: uniqueSimilarH2(h2),
    cityHits,
    topCities: Object.entries(cityHits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
    phoneInTitle,
    discountInTitle,
    brandRepeats,
    hasFaqSection: /الأسئلة الشائعة|FAQ/i.test(content),
    hasCta: /\/contact|تواصل|واتساب|اطلب|ابدأ/i.test(content),
    internalHrefs: [...new Set(internalHrefs)],
    externalHrefs: [...new Set(externalHrefs)].slice(0, 10),
    contentImages: imgs,
    contentImgCount: imgs.length,
    contentImgMissingAlt: imgs.filter((i) => !i.hasAlt).length,
    hasUl: /<ul/i.test(content),
    hasOl: /<ol/i.test(content),
    hasTable: /<table/i.test(content),
    previewStart: text.slice(0, 400),
    previewMid: text.slice(Math.floor(text.length * 0.4), Math.floor(text.length * 0.4) + 300),
  };
});

posts.sort((a, b) => a.slug.localeCompare(b.slug));

const outPath = resolve(process.cwd(), "scripts/.blog-audit-data.json");
writeFileSync(outPath, JSON.stringify(posts, null, 2), "utf8");
console.log(`Wrote ${posts.length} posts → ${outPath}`);
for (const p of posts) {
  console.log(
    `\n=== ${p.slug} ===\n` +
      `words=${p.words} cat=${p.category} h1=${p.h1.length} h2=${p.h2.length} h3=${p.h3Count}\n` +
      `internal=${p.internalHrefs.length} external=${p.externalHrefs.length} faqSchema=${p.faqSchema}\n` +
      `featAlt=${p.featuredImageAlt ? "yes" : "NO"} authorSlug=${p.authorSlug || "NO"}\n` +
      `cityTop=${JSON.stringify(p.topCities)}\n` +
      `h2Clusters=${JSON.stringify(p.similarH2Clusters)}\n` +
      `phoneTitle=${p.phoneInTitle} discountTitle=${p.discountInTitle} brandRepeats=${p.brandRepeats}`,
  );
}
