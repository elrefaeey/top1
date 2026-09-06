/**
 * Publish firestore.rules via service account (bypasses Firebase CLI IAM).
 * Usage: node scripts/deploy-firestore-rules.mjs
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
      scope: [
        "https://www.googleapis.com/auth/firebase",
        "https://www.googleapis.com/auth/cloud-platform",
      ].join(" "),
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
  if (!json.access_token) throw new Error(`OAuth failed: ${JSON.stringify(json).slice(0, 200)}`);
  return json.access_token;
}

const sa = parseServiceAccount();
const token = await getAccessToken(sa);
const rules = readFileSync(resolve(process.cwd(), "firestore.rules"), "utf8");

const createRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/rulesets`,
  {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      source: { files: [{ name: "firestore.rules", content: rules }] },
    }),
  },
);
const created = await createRes.json();
if (!createRes.ok) {
  console.error(JSON.stringify({ step: "create_ruleset", status: createRes.status, error: created.error }, null, 2));
  process.exit(1);
}

const rulesetName = created.name;
const releaseRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/releases/cloud.firestore`,
  {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      release: {
        name: `projects/${sa.project_id}/releases/cloud.firestore`,
        rulesetName,
      },
    }),
  },
);

if (releaseRes.status === 404 || !releaseRes.ok) {
  const putRes = await fetch(
    `https://firebaserules.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/releases/cloud.firestore`,
    {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: `projects/${sa.project_id}/releases/cloud.firestore`,
        rulesetName,
      }),
    },
  );
  const putJson = await putRes.json();
  if (!putRes.ok) {
    console.error(JSON.stringify({ step: "release", status: putRes.status, error: putJson.error }, null, 2));
    process.exit(1);
  }
}

console.log(JSON.stringify({ ok: true, project: sa.project_id, ruleset: rulesetName }, null, 2));
