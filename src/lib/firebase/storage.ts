import { getFirebaseApp } from "./config";
import { withTimeout } from "@/lib/with-timeout";

const STORAGE_ERROR_AR: Record<string, string> = {
  "storage/unauthorized":
    "لا توجد صلاحية رفع. انشر storage.rules من Firebase Console → Storage → Rules.",
  "storage/unauthenticated": "سجّل الدخول كأدمن أولاً.",
  "storage/retry-limit-exceeded": "فشل الاتصال بـ Firebase Storage — تحقق من الإنترنت.",
  "storage/canceled": "تم إلغاء الرفع.",
  "storage/unknown": "Firebase Storage غير مفعّل. من Console: Build → Storage → Get started.",
  "storage/bucket-not-found":
    "bucket التخزين غير موجود — تحقق من VITE_FIREBASE_STORAGE_BUCKET في .env",
};

function mapStorageError(err: unknown): Error {
  const code = (err as { code?: string })?.code ?? "";
  if (code && STORAGE_ERROR_AR[code]) return new Error(STORAGE_ERROR_AR[code]);
  if (err instanceof Error) return err;
  return new Error("فشل رفع الصورة إلى Firebase Storage");
}

function assertStorageConfigured() {
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined;
  if (!bucket?.trim()) {
    throw new Error("أضف VITE_FIREBASE_STORAGE_BUCKET في ملف .env");
  }
}

export async function uploadFile(path: string, file: File): Promise<string> {
  assertStorageConfigured();

  const app = getFirebaseApp();
  if (!app) {
    throw new Error("Firebase is not configured");
  }
  const { getAuth } = await import("firebase/auth");
  const user = getAuth(app).currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول قبل رفع الصور");
  }

  const { getStorage, ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
  const storageInstance = getStorage(app);
  const storageRef = ref(storageInstance, path);

  const snapshot = await withTimeout(
    uploadBytes(storageRef, file, { contentType: file.type || "image/jpeg" }),
    60_000,
    "انتهت مهلة الرفع (60 ث). فعّل Firebase Storage: Console → Build → Storage → Get started، ثم انشر storage.rules",
  );

  return withTimeout(
    getDownloadURL(snapshot.ref),
    15_000,
    "تعذّر الحصول على رابط الصورة بعد الرفع",
  );
}

export { mapStorageError };
