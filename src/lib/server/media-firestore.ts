import { randomUUID } from "node:crypto";

const MAX_FIRESTORE_MEDIA_BYTES = 600 * 1024;

function env(name: string): string {
  return (process.env[name] ?? process.env[`VITE_${name}`] ?? "").trim();
}

export function canStoreInFirestoreMedia(byteLength: number) {
  return byteLength > 0 && byteLength <= MAX_FIRESTORE_MEDIA_BYTES;
}

export function mediaPublicPath(id: string) {
  return `/media/${id}`;
}

/** تخزين صورة في Firestore (بديل مجاني عندما Storage غير مفعّل). */
export async function uploadImageToFirestoreMedia(opts: {
  bytes: ArrayBuffer;
  contentType: string;
  folder: string;
  idToken: string;
  fileName?: string;
}): Promise<{ id: string; path: string }> {
  const projectId = env("FIREBASE_PROJECT_ID") || env("VITE_FIREBASE_PROJECT_ID");
  if (!projectId) throw new Error("VITE_FIREBASE_PROJECT_ID غير مُعد");

  if (!canStoreInFirestoreMedia(opts.bytes.byteLength)) {
    throw new Error(
      "الصورة كبيرة للتخزين البديل — قلّل الحجم أو فعّل Firebase Storage (Console → Build → Storage)",
    );
  }

  const id = randomUUID().replace(/-/g, "").slice(0, 22);
  const dataBase64 = Buffer.from(opts.bytes).toString("base64");
  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/media?documentId=${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        contentType: { stringValue: opts.contentType },
        folder: { stringValue: opts.folder || "misc" },
        fileName: { stringValue: (opts.fileName || "upload.jpg").slice(0, 120) },
        dataBase64: { stringValue: dataBase64 },
        size: { integerValue: String(opts.bytes.byteLength) },
        createdAt: { stringValue: new Date().toISOString() },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 403) {
      throw new Error("لا توجد صلاحية حفظ في Firestore — انشر firestore.rules");
    }
    throw new Error(`فشل حفظ الصورة في Firestore (${res.status}) ${body.slice(0, 180)}`);
  }

  return { id, path: mediaPublicPath(id) };
}

export async function readFirestoreMedia(id: string): Promise<{
  contentType: string;
  bytes: Buffer;
} | null> {
  const projectId = env("FIREBASE_PROJECT_ID") || env("VITE_FIREBASE_PROJECT_ID");
  const apiKey = env("FIREBASE_API_KEY") || env("VITE_FIREBASE_API_KEY");
  if (!projectId || !apiKey) return null;

  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeId || safeId !== id) return null;

  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/media/${encodeURIComponent(safeId)}` +
    `?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, { method: "GET" });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`تعذّر قراءة الصورة (${res.status}) ${body.slice(0, 120)}`);
  }

  const doc = (await res.json()) as {
    fields?: {
      contentType?: { stringValue?: string };
      dataBase64?: { stringValue?: string };
    };
  };

  const contentType = doc.fields?.contentType?.stringValue?.trim() || "image/jpeg";
  const dataBase64 = doc.fields?.dataBase64?.stringValue;
  if (!dataBase64) return null;

  return {
    contentType,
    bytes: Buffer.from(dataBase64, "base64"),
  };
}
