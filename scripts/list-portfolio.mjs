/**
 * List portfolio + testimonials from Firestore.
 * Usage: node scripts/list-portfolio.mjs
 */
import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const raw of text.split(/\r?\n/)) {
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
  const raw = (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "").trim();
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON غير موجود في .env");
  const sa = JSON.parse(raw);
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
  const tokRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const tok = await tokRes.json();
  if (!tok.access_token) throw new Error(JSON.stringify(tok));
  return tok.access_token;
}

function fieldVal(f) {
  if (!f) return "";
  if (f.stringValue != null) return f.stringValue;
  if (f.integerValue != null) return Number(f.integerValue);
  if (f.doubleValue != null) return f.doubleValue;
  if (f.booleanValue != null) return f.booleanValue;
  return "";
}

async function listCollection(token, project, name) {
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(project)}/databases/(default)/documents/${name}?pageSize=50`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  const data = await res.json();
  return (data.documents || []).map((d) => {
    const id = d.name.split("/").pop();
    const f = d.fields || {};
    const out = { id };
    for (const [k, v] of Object.entries(f)) out[k] = fieldVal(v);
    return out;
  });
}

const sa = parseServiceAccount();
const token = await getAccessToken(sa);
const portfolio = await listCollection(token, sa.project_id, "portfolio");
const testimonials = await listCollection(token, sa.project_id, "testimonials");
console.log("--- PORTFOLIO ---");
console.log(JSON.stringify(portfolio.map((p) => ({
  id: p.id,
  title: p.title,
  client: p.client,
  category: p.category,
  status: p.status,
  description: String(p.description || "").slice(0, 100),
})), null, 2));
console.log("--- TESTIMONIALS ---");
console.log(JSON.stringify(testimonials.map((t) => ({
  id: t.id,
  name: t.name,
  company: t.company,
  quote: String(t.quote || "").slice(0, 80),
  status: t.status,
  order: t.order,
})), null, 2));
