const MAX_BYTES = 12 * 1024 * 1024;
/** بدون Storage: حفظ inline في Firestore (بعد الضغط) */
const MAX_INLINE_BYTES = 380_000;

function env(name: string): string {
  return (process.env[name] ?? process.env[`VITE_${name}`] ?? "").trim();
}

function bytesToDataUrl(bytes: ArrayBuffer, contentType: string): string {
  const b64 = Buffer.from(bytes).toString("base64");
  return `data:${contentType || "image/jpeg"};base64,${b64}`;
}

function inlineDataUrlFallback(bytes: ArrayBuffer, contentType: string): string | null {
  if (bytes.byteLength > MAX_INLINE_BYTES) return null;
  return bytesToDataUrl(bytes, contentType);
}

import { verifyFirebaseEditorRole } from "@/lib/security/firebase-auth-server";

function storageDownloadUrl(bucket: string, objectName: string, downloadToken: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?alt=media&token=${downloadToken}`;
}

export async function uploadToFirebaseStorageServer(
  objectPath: string,
  bytes: ArrayBuffer,
  contentType: string,
  idToken: string,
): Promise<string> {
  const bucket = env("FIREBASE_STORAGE_BUCKET") || env("VITE_FIREBASE_STORAGE_BUCKET");
  if (!bucket) throw new Error("VITE_FIREBASE_STORAGE_BUCKET غير مُعد");

  const url =
    `https://firebasestorage.googleapis.com/v0/b/${bucket}/o` +
    `?uploadType=media&name=${encodeURIComponent(objectPath)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Firebase ${idToken}`,
      "Content-Type": contentType || "image/jpeg",
    },
    body: bytes,
  });

  const text = await res.text();
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Firebase Storage غير مفعّل — من Console: Build → Storage → Get started");
    }
    if (res.status === 403) {
      throw new Error("لا توجد صلاحية رفع — انشر storage.rules في Firebase Storage → Rules");
    }
    throw new Error(`فشل Firebase Storage (${res.status})`);
  }

  const json = JSON.parse(text) as {
    name?: string;
    downloadTokens?: string;
  };

  if (!json.name || !json.downloadTokens) {
    throw new Error("استجابة Storage غير متوقعة");
  }

  return storageDownloadUrl(bucket, json.name, json.downloadTokens);
}

export async function uploadToImgBBServer(bytes: ArrayBuffer, contentType: string): Promise<string> {
  const key = env("IMGBB_API_KEY");
  if (!key) throw new Error("IMGBB_API_KEY غير مُعد على السيرver");

  const blob = new Blob([bytes], { type: contentType || "image/jpeg" });
  const body = new FormData();
  body.append("image", blob, "upload.jpg");

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body,
  });

  const json = (await res.json()) as {
    success?: boolean;
    data?: { url?: string; display_url?: string };
    error?: { message?: string };
  };

  if (!json.success) {
    throw new Error(json.error?.message ?? "فشل رفع ImgBB");
  }

  return json.data?.url ?? json.data?.display_url ?? "";
}

export function safeUploadFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

export function assertFileSize(bytes: ArrayBuffer) {
  if (bytes.byteLength > MAX_BYTES) {
    throw new Error("الحد الأقصى 12 ميجابايت");
  }
}

function detectImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

export async function handleImageUploadRequest(request: Request): Promise<Response> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    await verifyFirebaseEditorRole(idToken);

    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "misc").replace(/[^a-zA-Z0-9_-]/g, "");

    if (!(file instanceof File)) {
      return Response.json({ error: "لم تُرسل صورة" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    assertFileSize(bytes);

    const detectedMime = detectImageMime(new Uint8Array(bytes));
    if (!detectedMime) {
      return Response.json({ error: "نوع الملف غير مدعوم — استخدم JPG أو PNG أو WebP" }, { status: 400 });
    }

    const objectPath = `media/${folder}/${Date.now()}-${safeUploadFileName(file.name)}`;
    const contentType = detectedMime;

    try {
      const url = await uploadToFirebaseStorageServer(objectPath, bytes, contentType, idToken);
      return Response.json({ url, provider: "firebase" });
    } catch (firebaseErr) {
      const imgbbKey = env("IMGBB_API_KEY");
      if (imgbbKey) {
        try {
          const url = await uploadToImgBBServer(bytes, contentType);
          return Response.json({ url, provider: "imgbb" });
        } catch {
          /* جرّب inline */
        }
      }

      const inlineUrl = inlineDataUrlFallback(bytes, contentType);
      if (inlineUrl) {
        return Response.json({
          url: inlineUrl,
          provider: "inline",
          note: "تم الحفظ مؤقتاً بدون Storage — للصور الدائمة فعّل Firebase Storage لاحقاً",
        });
      }

      const fbMsg =
        firebaseErr instanceof Error
          ? firebaseErr.message
          : "Firebase Storage غير متاح";
      return Response.json(
        {
          error: `${fbMsg}. الصورة كبيرة جداً للحفظ بدون Storage — استخدم JPG مضغوط أو فعّل Storage من Firebase Console.`,
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("[upload-image]", err);
    const message = err instanceof Error ? err.message : "فشل الرفع";
    const safe =
      message.includes("صلاحية") || message.includes("رمز") || message.includes("نوع")
        ? message
        : "فشل رفع الصورة";
    return Response.json({ error: safe }, { status: 500 });
  }
}
