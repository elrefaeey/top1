const MAX_BYTES = 12 * 1024 * 1024;

function env(name: string): string {
  return (process.env[name] ?? process.env[`VITE_${name}`] ?? "").trim();
}

import { verifyFirebaseEditorRole } from "@/lib/security/firebase-auth-server";
import { uploadImageToFirestoreMedia } from "@/lib/server/media-firestore";

function storageDownloadUrl(bucket: string, objectName: string, downloadToken: string) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(objectName)}?alt=media&token=${downloadToken}`;
}

function candidateBuckets(): string[] {
  const configured = env("FIREBASE_STORAGE_BUCKET") || env("VITE_FIREBASE_STORAGE_BUCKET");
  const projectId = env("FIREBASE_PROJECT_ID") || env("VITE_FIREBASE_PROJECT_ID");
  const list = [
    configured,
    projectId ? `${projectId}.firebasestorage.app` : "",
    projectId ? `${projectId}.appspot.com` : "",
  ]
    .map((b) => b.trim())
    .filter(Boolean);
  return [...new Set(list)];
}

export async function uploadToFirebaseStorageServer(
  objectPath: string,
  bytes: ArrayBuffer,
  contentType: string,
  idToken: string,
): Promise<string> {
  const buckets = candidateBuckets();
  if (!buckets.length) throw new Error("VITE_FIREBASE_STORAGE_BUCKET غير مُعد");

  let lastStatus = 0;
  let lastBody = "";

  for (const bucket of buckets) {
    const url =
      `https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(bucket)}/o` +
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
    if (res.ok) {
      const json = JSON.parse(text) as {
        name?: string;
        downloadTokens?: string;
      };
      if (!json.name || !json.downloadTokens) {
        throw new Error("استجابة Storage غير متوقعة");
      }
      return storageDownloadUrl(bucket, json.name, json.downloadTokens);
    }

    lastStatus = res.status;
    lastBody = text.slice(0, 220);
    // Try next bucket for missing bucket only
    if (res.status !== 404) break;
  }

  if (lastStatus === 404) {
    throw new Error("STORAGE_NOT_READY");
  }
  if (lastStatus === 403) {
    throw new Error("لا توجد صلاحية رفع — انشر storage.rules في Firebase Storage → Rules");
  }
  throw new Error(`فشل Firebase Storage (${lastStatus}) ${lastBody}`);
}

export async function uploadToImgBBServer(
  bytes: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const key = env("IMGBB_API_KEY");
  if (!key) throw new Error("IMGBB_API_KEY غير مُعد على السيرفر");

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

    if (!(file instanceof File) && !(file instanceof Blob)) {
      return Response.json({ error: "لم تُرسل صورة" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    assertFileSize(bytes);

    const detectedMime = detectImageMime(new Uint8Array(bytes));
    if (!detectedMime) {
      return Response.json(
        { error: "نوع الملف غير مدعوم — استخدم JPG أو PNG أو WebP" },
        { status: 400 },
      );
    }

    const fileName =
      file instanceof File && file.name ? safeUploadFileName(file.name) : "upload.jpg";
    const objectPath = `media/${folder}/${Date.now()}-${fileName}`;
    const contentType = detectedMime;

    try {
      const url = await uploadToFirebaseStorageServer(objectPath, bytes, contentType, idToken);
      return Response.json({ url, provider: "firebase-storage" });
    } catch (firebaseErr) {
      const fbMsg = firebaseErr instanceof Error ? firebaseErr.message : "";

      // بديل مجاني: Firestore media → /media/:id
      try {
        const saved = await uploadImageToFirestoreMedia({
          bytes,
          contentType,
          folder,
          idToken,
          fileName,
        });
        return Response.json({
          url: saved.path,
          provider: "firestore-media",
          note:
            fbMsg === "STORAGE_NOT_READY"
              ? "تم الحفظ في Firebase (Firestore) لأن Storage غير مفعّل بعد"
              : undefined,
        });
      } catch (fsErr) {
        const imgbbKey = env("IMGBB_API_KEY");
        if (imgbbKey) {
          try {
            const url = await uploadToImgBBServer(bytes, contentType);
            return Response.json({ url, provider: "imgbb" });
          } catch {
            /* fall through */
          }
        }

        const detail =
          fsErr instanceof Error
            ? fsErr.message
            : fbMsg && fbMsg !== "STORAGE_NOT_READY"
              ? fbMsg
              : "فشل رفع الصورة";
        return Response.json({ error: detail }, { status: 502 });
      }
    }
  } catch (err) {
    console.error("[upload-image]", err);
    const message = err instanceof Error ? err.message : "فشل الرفع";

    if (message.includes("رمز الدخول") || message.includes("API key")) {
      return Response.json({ error: message }, { status: 401 });
    }
    if (message.includes("صلاحية") || message.includes("مصرح") || message.includes("يتطلب دور")) {
      return Response.json({ error: message }, { status: 403 });
    }
    if (message.includes("نوع") || message.includes("حجم") || message.includes("كبيرة")) {
      return Response.json({ error: message }, { status: 400 });
    }

    return Response.json({ error: "فشل رفع الصورة" }, { status: 500 });
  }
}
