import { compressImage } from "./upload-image-compress";
import { withTimeout } from "@/lib/with-timeout";
import { getFirebaseApp } from "./config";

const MAX_INPUT_MB = 12;

export type UploadStage = "compress" | "upload";

/** رفع عبر السيرفر — Storage إن وُجد، وإلا Firestore media (/media/:id). */
async function uploadViaServer(folder: string, file: File): Promise<string> {
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured");
  }
  const { getAuth } = await import("firebase/auth");
  const user = getAuth(app).currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول قبل رفع الصور");
  }

  const token = await user.getIdToken();
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const res = await withTimeout(
    fetch("/api/upload-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }),
    90_000,
    "انتهت مهلة الرفع — أعد المحاولة",
  );

  const json = (await res.json()) as { url?: string; error?: string; note?: string };
  if (!res.ok) {
    throw new Error(json.error ?? "فشل رفع الصورة");
  }
  if (!json.url) {
    throw new Error("لم يُرجَع رابط الصورة");
  }
  return json.url;
}

/**
 * رفع صورة من الجهاز — ضغط ثم مسار السيرفر.
 * لا نرفع من المتصفح مباشرة إلى Storage: المشروع يحتاج تفعيل Storage أولاً،
 * والرفع المباشر يفشل بـ CORS على localhost بدون bucket مُعدّ.
 */
export async function uploadMediaImage(
  folder: string,
  file: File,
  onStage?: (stage: UploadStage) => void,
): Promise<string> {
  if (file.size > MAX_INPUT_MB * 1024 * 1024) {
    throw new Error(`الحد الأقصى ${MAX_INPUT_MB} ميجابايت`);
  }

  onStage?.("compress");
  let prepared: File;
  try {
    prepared = await compressImage(file);
  } catch (err) {
    if (err instanceof Error && err.message.includes("HEIC")) throw err;
    prepared = file;
  }

  // ضغط أقوى إذا كانت ما زالت كبيرة (بديل Firestore حدّه ~600KB)
  if (prepared.size > 550 * 1024) {
    try {
      prepared = await compressImage(prepared, 1200, 0.68);
    } catch {
      /* keep previous */
    }
  }

  onStage?.("upload");
  return uploadViaServer(folder, prepared);
}

export { compressImage };
