import { createSign, randomUUID, timingSafeEqual } from "node:crypto";

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

function readServiceAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON غير مُعد على السيرفر — مطلوب لإرسال نماذج التواصل بأمان",
    );
  }
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error("invalid");
    }
    return {
      project_id: parsed.project_id,
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON غير صالح (JSON)");
  }
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
  const fieldPaths = Object.keys(data).filter((k) => data[k] !== undefined);
  const mask = fieldPaths.map((p) => `updateMask.fieldPaths=${encodeURIComponent(p)}`).join("&");
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}` +
    `/databases/(default)/documents/${encodeURIComponent(collection)}/${encodeURIComponent(documentId)}` +
    (mask ? `?${mask}` : "");

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
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
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}` +
    `/databases/(default)/documents/${encodeURIComponent(collection)}/${encodeURIComponent(documentId)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { authorization: `Bearer ${token}` },
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
