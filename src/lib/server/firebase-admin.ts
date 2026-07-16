import { createSign, randomUUID } from "node:crypto";

/**
 * Server-only Firebase Admin access via Firestore REST + service-account JWT.
 * Avoids bundling `firebase-admin` (breaks Nitro/Vercel with SDK_VERSION errors).
 */

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type FirestoreValue = { stringValue: string } | { nullValue: null };

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

function toFirestoreFields(
  data: Record<string, string | undefined | null>,
): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    fields[key] = value === null ? { nullValue: null } : { stringValue: value };
  }
  return fields;
}

/** Create a document in a collection via Firestore REST (Admin-privileged). */
export async function createFirestoreDocument(
  collection: string,
  data: Record<string, string | undefined | null>,
): Promise<void> {
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
}
