import { createSign, randomUUID, timingSafeEqual } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Server-only Firebase Admin access via Firestore REST + service-account JWT.
 * Avoids bundling `firebase-admin` (breaks Nitro/Vercel with SDK_VERSION errors).
 */

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

export type FirestorePrimitive = string | number | boolean | null;
export type FirestoreInputValue = FirestorePrimitive | string[] | number[];
export type FirestoreDocumentData = Record<string, FirestoreInputValue | undefined>;

type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { arrayValue: { values: FirestoreValue[] } };

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

const SA_ENV_NAME = "FIREBASE_SERVICE_ACCOUNT_JSON";

/** Dynamic lookup — avoids accidental build-time inlining of the secret name. */
function readServerEnv(name: string): string {
  try {
    const value = process.env[name];
    return typeof value === "string" ? value.trim() : "";
  } catch {
    return "";
  }
}

export type ServiceAccountDiagnostics = {
  has_service_account: boolean;
  environment: string;
  json_char_length: number;
  parse_ok: boolean;
  has_project_id: boolean;
  has_client_email: boolean;
  has_private_key: boolean;
};

/**
 * Safe diagnostics for ops logs — never includes JSON, keys, or emails.
 */
export function getServiceAccountDiagnostics(): ServiceAccountDiagnostics {
  const raw = readServiceAccountRaw();
  const environment =
    readServerEnv("VERCEL_ENV") ||
    readServerEnv("NODE_ENV") ||
    "unknown";

  const base: ServiceAccountDiagnostics = {
    has_service_account: Boolean(raw),
    environment,
    json_char_length: raw.length,
    parse_ok: false,
    has_project_id: false,
    has_client_email: false,
    has_private_key: false,
  };

  if (!raw) return base;

  try {
    const parsed = parseServiceAccountObject(raw);
    return {
      ...base,
      parse_ok: true,
      has_project_id: Boolean(parsed.project_id),
      has_client_email: Boolean(parsed.client_email),
      has_private_key: Boolean(parsed.private_key),
    };
  } catch {
    return base;
  }
}

/** Strip BOM / wrapping quotes / accidental double-encoding from Vercel dashboard pastes. */
function normalizeServiceAccountJson(raw: string): string {
  let value = raw.replace(/^\uFEFF/, "").trim();
  if (!value) return "";

  // Dashboard sometimes stores the whole JSON wrapped in extra quotes.
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  // If the value is a JSON string containing JSON, unwrap once.
  if (value.startsWith('"') && value.includes("{")) {
    try {
      const once = JSON.parse(value);
      if (typeof once === "string") value = once.trim();
    } catch {
      // keep as-is
    }
  }

  return value;
}

function parseServiceAccountObject(raw: string): ServiceAccount {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`${SA_ENV_NAME} غير صالح (JSON)`);
  }

  // Double-encoded: JSON.parse → string → parse again
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      throw new Error(`${SA_ENV_NAME} غير صالح (JSON)`);
    }
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`${SA_ENV_NAME} غير صالح (JSON)`);
  }

  const obj = parsed as Partial<ServiceAccount>;
  if (!obj.project_id || !obj.client_email || !obj.private_key) {
    throw new Error(`${SA_ENV_NAME} غير صالح (JSON)`);
  }

  return {
    project_id: String(obj.project_id),
    client_email: String(obj.client_email),
    private_key: String(obj.private_key).replace(/\\n/g, "\n"),
  };
}

function readServiceAccountRaw(): string {
  const fromEnv = normalizeServiceAccountJson(readServerEnv(SA_ENV_NAME));
  if (fromEnv) return fromEnv;

  // Local DX: allow *firebase-adminsdk*.json in project root when env is unset (never in production).
  const nodeEnv = readServerEnv("NODE_ENV") || "development";
  const vercelEnv = readServerEnv("VERCEL_ENV");
  if (nodeEnv === "production" || vercelEnv === "production" || vercelEnv === "preview") {
    return "";
  }

  try {
    const root = process.cwd();
    const match = readdirSync(root).find((name) => /firebase-adminsdk.*\.json$/i.test(name));
    if (!match) return "";
    const raw = readFileSync(join(root, match), "utf8");
    return normalizeServiceAccountJson(raw);
  } catch {
    return "";
  }
}

function readServiceAccount(): ServiceAccount {
  const raw = readServiceAccountRaw();
  if (!raw) {
    throw new Error(
      `${SA_ENV_NAME} غير مُعد على السيرفر — مطلوب لإرسال نماذج التواصل بأمان`,
    );
  }
  return parseServiceAccountObject(raw);
}

/** True when Admin REST service account JSON is configured. */
export function hasFirebaseServiceAccount(): boolean {
  return Boolean(readServiceAccountRaw());
}

function resolveProjectId(): string {
  if (hasFirebaseServiceAccount()) return readServiceAccount().project_id;
  const id = (
    readServerEnv("FIREBASE_PROJECT_ID") ||
    readServerEnv("VITE_FIREBASE_PROJECT_ID") ||
    ""
  ).trim();
  if (!id) throw new Error("VITE_FIREBASE_PROJECT_ID غير مُعد على السيرفر");
  return id;
}

function toBase64Url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.accessToken;
  }

  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = toBase64Url(
    JSON.stringify({
      iss: sa.client_email,
      sub: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claim}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(sa.private_key, "base64url");
  const assertion = `${unsigned}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`تعذّر الحصول على توكن Firebase (${res.status}) ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) {
    throw new Error("تعذّر الحصول على توكن Firebase");
  }

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600),
  };
  return data.access_token;
}

function encodeFirestoreValue(value: FirestoreInputValue): FirestoreValue {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map((item) =>
          typeof item === "number"
            ? Number.isInteger(item)
              ? { integerValue: String(item) }
              : { doubleValue: item }
            : { stringValue: String(item) },
        ),
      },
    };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(data: FirestoreDocumentData): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    fields[key] = encodeFirestoreValue(value);
  }
  return fields;
}

function decodeFirestoreValue(value: Record<string, unknown> | undefined): unknown {
  if (!value) return undefined;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) {
    const arr = value.arrayValue as { values?: Record<string, unknown>[] };
    return (arr.values ?? []).map((v) => decodeFirestoreValue(v));
  }
  return undefined;
}

function decodeFirestoreDocument(
  name: string,
  fields?: Record<string, Record<string, unknown>>,
): Record<string, unknown> & { id: string } {
  const id = name.split("/").pop() || name;
  const data: Record<string, unknown> & { id: string } = { id };
  if (fields) {
    for (const [key, raw] of Object.entries(fields)) {
      data[key] = decodeFirestoreValue(raw);
    }
  }
  return data;
}

/** Create a document in a collection via Firestore REST (Admin-privileged). */
export async function createFirestoreDocument(
  collection: string,
  data: FirestoreDocumentData,
): Promise<string> {
  const sa = readServiceAccount();
  const token = await getAccessToken(sa);
  const documentId = randomUUID().replace(/-/g, "").slice(0, 20);
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}` +
    `/databases/(default)/documents/${encodeURIComponent(collection)}` +
    `?documentId=${encodeURIComponent(documentId)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`تعذّر حفظ البيانات في Firestore (${res.status}) ${body.slice(0, 200)}`);
  }

  return documentId;
}

/** Create/overwrite a document with a known id (e.g. blog slug). */
export async function upsertFirestoreDocument(
  collection: string,
  documentId: string,
  data: FirestoreDocumentData,
): Promise<void> {
  const sa = readServiceAccount();
  const token = await getAccessToken(sa);
  await patchFirestoreDocument({
    projectId: sa.project_id,
    accessToken: token,
    collection,
    documentId,
    data,
  });
}

/**
 * Upsert via the signed-in user's ID token (subject to Firestore security rules).
 * Used when FIREBASE_SERVICE_ACCOUNT_JSON is not configured (local OAuth callback).
 */
export async function upsertFirestoreDocumentAsUser(
  idToken: string,
  collection: string,
  documentId: string,
  data: FirestoreDocumentData,
): Promise<void> {
  await patchFirestoreDocument({
    projectId: resolveProjectId(),
    accessToken: idToken,
    collection,
    documentId,
    data,
  });
}

async function patchFirestoreDocument(input: {
  projectId: string;
  accessToken: string;
  collection: string;
  documentId: string;
  data: FirestoreDocumentData;
}): Promise<void> {
  const fieldPaths = Object.keys(input.data).filter((k) => input.data[k] !== undefined);
  const mask = fieldPaths.map((p) => `updateMask.fieldPaths=${encodeURIComponent(p)}`).join("&");
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(input.projectId)}` +
    `/databases/(default)/documents/${encodeURIComponent(input.collection)}/${encodeURIComponent(input.documentId)}` +
    (mask ? `?${mask}` : "");

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${input.accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields: toFirestoreFields(input.data) }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`تعذّر تحديث المستند في Firestore (${res.status}) ${body.slice(0, 200)}`);
  }
}

/** Read a single document by id (Admin-privileged). Returns null if missing. */
export async function getFirestoreDocument(
  collection: string,
  documentId: string,
): Promise<(Record<string, unknown> & { id: string }) | null> {
  const sa = readServiceAccount();
  const token = await getAccessToken(sa);
  return fetchFirestoreDocument({
    projectId: sa.project_id,
    accessToken: token,
    collection,
    documentId,
  });
}

/** Read a document using the signed-in user's ID token (rules apply). */
export async function getFirestoreDocumentAsUser(
  idToken: string,
  collection: string,
  documentId: string,
): Promise<(Record<string, unknown> & { id: string }) | null> {
  return fetchFirestoreDocument({
    projectId: resolveProjectId(),
    accessToken: idToken,
    collection,
    documentId,
  });
}

async function fetchFirestoreDocument(input: {
  projectId: string;
  accessToken: string;
  collection: string;
  documentId: string;
}): Promise<(Record<string, unknown> & { id: string }) | null> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(input.projectId)}` +
    `/databases/(default)/documents/${encodeURIComponent(input.collection)}/${encodeURIComponent(input.documentId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { authorization: `Bearer ${input.accessToken}` },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`تعذّر قراءة المستند من Firestore (${res.status}) ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    name?: string;
    fields?: Record<string, Record<string, unknown>>;
  };
  if (!data.name) return null;
  return decodeFirestoreDocument(data.name, data.fields);
}

/** List documents from a collection (Admin-privileged). Newest-first when orderBy provided. */
export async function listFirestoreDocuments(
  collection: string,
  options?: { pageSize?: number; orderBy?: string; orderDirection?: "ASCENDING" | "DESCENDING" },
): Promise<Array<Record<string, unknown> & { id: string }>> {
  const sa = readServiceAccount();
  const token = await getAccessToken(sa);
  const pageSize = Math.min(Math.max(options?.pageSize ?? 50, 1), 200);

  if (options?.orderBy) {
    const url =
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}` +
      `/databases/(default)/documents:runQuery`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          orderBy: [
            {
              field: { fieldPath: options.orderBy },
              direction: options.orderDirection ?? "DESCENDING",
            },
          ],
          limit: pageSize,
        },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`تعذّر قراءة Firestore (${res.status}) ${body.slice(0, 200)}`);
    }

    const rows = (await res.json()) as Array<{
      document?: { name?: string; fields?: Record<string, Record<string, unknown>> };
    }>;
    return rows
      .filter((r) => r.document?.name)
      .map((r) => decodeFirestoreDocument(r.document!.name!, r.document!.fields));
  }

  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}` +
    `/databases/(default)/documents/${encodeURIComponent(collection)}` +
    `?pageSize=${pageSize}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    // Empty collection can still 200; missing DB etc. throw.
    if (res.status === 404) return [];
    const body = await res.text().catch(() => "");
    throw new Error(`تعذّر قراءة Firestore (${res.status}) ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    documents?: Array<{ name?: string; fields?: Record<string, Record<string, unknown>> }>;
  };
  return (data.documents ?? [])
    .filter((d) => d.name)
    .map((d) => decodeFirestoreDocument(d.name!, d.fields));
}

/** Constant-time compare for automation API keys. */
export function safeEqualString(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
