/**
 * Dump portfolio documents from Firestore.
 * Usage: node scripts/dump-portfolio.mjs
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

function decode(f) {
  if (!f) return null;
  if (f.stringValue != null) return f.stringValue;
  if (f.integerValue != null) return Number(f.integerValue);
  if (f.doubleValue != null) return f.doubleValue;
  if (f.booleanValue != null) return f.booleanValue;
  if (f.arrayValue) return (f.arrayValue.values || []).map(decode);
  if (f.mapValue) {
    const o = {};
    for (const [k, v] of Object.entries(f.mapValue.fields || {})) o[k] = decode(v);
    return o;
  }
  return null;
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

const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "{}");
sa.private_key = String(sa.private_key).replace(/\\n/g, "\n");
const token = await getAccessToken(sa);
const url =
  `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}` +
  `/databases/(default)/documents/portfolio?pageSize=50`;
const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
const data = await res.json();
const items = (data.documents || []).map((d) => {
  const id = d.name.split("/").pop();
  const out = { id };
  for (const [k, v] of Object.entries(d.fields || {})) out[k] = decode(v);
  return out;
});
items.sort((a, b) => (a.order || 0) - (b.order || 0));
const slim = items.map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  client: p.client,
  category: p.category,
  url: p.url,
  status: p.status,
  description: p.description,
  challenge: p.challenge,
  solution: p.solution,
  servicesProvided: p.servicesProvided,
  technologies: p.technologies,
  resultsSummary: p.resultsSummary,
  tags: p.tags,
  order: p.order,
}));
console.log(JSON.stringify(slim, null, 2));
