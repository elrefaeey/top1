/**
 * Grant admin/editor role in Firestore users/{uid}.
 * Usage: node scripts/grant-admin.mjs <uid> [admin|editor]
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
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    throw new Error("Service Account ناقص الحقول المطلوبة");
  }
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
  if (!res.ok) throw new Error(`OAuth failed (${res.status})`);
  const json = await res.json();
  if (!json.access_token) throw new Error("تعذّر الحصول على توكن Firebase");
  return json.access_token;
}

async function getUserDoc(projectId, token, uid) {
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`فشل قراءة users/${uid} (${res.status}): ${body.slice(0, 180)}`);
  }
  return res.json();
}

async function upsertUser(projectId, token, uid, role) {
  const existing = await getUserDoc(projectId, token, uid);
  const createdAt =
    existing?.fields?.createdAt?.stringValue || new Date().toISOString();
  const email = existing?.fields?.email?.stringValue || "";
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/users/${encodeURIComponent(uid)}` +
    `?updateMask.fieldPaths=role&updateMask.fieldPaths=email&updateMask.fieldPaths=createdAt`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        role: { stringValue: role },
        email: { stringValue: email },
        createdAt: { stringValue: createdAt },
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`فشل حفظ users/${uid} (${res.status}): ${body.slice(0, 220)}`);
  }
}

const uid = (process.argv[2] || "").trim();
const role = (process.argv[3] || "admin").trim();

if (!uid) {
  console.error("Usage: node scripts/grant-admin.mjs <uid> [admin|editor]");
  process.exit(1);
}
if (role !== "admin" && role !== "editor") {
  console.error("الدور يجب أن يكون admin أو editor");
  process.exit(1);
}

const sa = parseServiceAccount();
const token = await getAccessToken(sa);
const before = await getUserDoc(sa.project_id, token, uid);
await upsertUser(sa.project_id, token, uid, role);
const after = await getUserDoc(sa.project_id, token, uid);
console.log(
  JSON.stringify(
    {
      project: sa.project_id,
      uid,
      existed: Boolean(before),
      role: after?.fields?.role?.stringValue || null,
    },
    null,
    2,
  ),
);
