import { compressImage } from "./upload-image-compress";
import { withTimeout } from "@/lib/with-timeout";
import { getFirebaseApp } from "./config";

const MAX_INPUT_MB = 12;

export type UploadStage = "compress" | "upload";

/** رفع عبر السيرver — يتجاوز CORS من localhost */
async function uploadViaServer(folder: string, file: File): Promise<string> {
  const { getAuth } = await import("firebase/auth");
  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured");
  }
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
    "انتهت مهلة الرفع — تحقق من تفعيل Firebase Storage",
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

/** رفع صورة من الجهاز — ضغط ثم رفع عبر API السيرver */
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

  onStage?.("upload");
  return uploadViaServer(folder, prepared);
}

export { compressImage };
