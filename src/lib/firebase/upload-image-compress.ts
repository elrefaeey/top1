import { withTimeout } from "@/lib/with-timeout";

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.78;
const COMPRESS_TIMEOUT_MS = 25_000;

function isHeic(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type.includes("heic") ||
    type.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

async function compressWithBitmap(file: File, maxWidth: number, quality: number): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("canvas unavailable");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("تعذّر ضغط الصورة"))),
      "image/jpeg",
      quality,
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

async function compressWithImageElement(
  file: File,
  maxWidth: number,
  quality: number,
): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    await withTimeout(
      new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("تعذّر قراءة الصورة"));
        img.src = objectUrl;
      }),
      COMPRESS_TIMEOUT_MS,
      "تعذّر قراءة الصورة — جرّب JPG أو PNG",
    );

    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const width = Math.round(img.naturalWidth * scale);
    const height = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unavailable");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("تعذّر ضغط الصورة"))),
        "image/jpeg",
        quality,
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function compressImage(
  file: File,
  maxWidth = MAX_WIDTH,
  quality = JPEG_QUALITY,
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  if (isHeic(file)) {
    throw new Error("صيغة HEIC غير مدعومة — حوّل إلى JPG أو استخدم «رابط خارجي»");
  }

  try {
    return await withTimeout(
      compressWithBitmap(file, maxWidth, quality),
      COMPRESS_TIMEOUT_MS,
      "compress-timeout",
    );
  } catch {
    try {
      return await withTimeout(
        compressWithImageElement(file, maxWidth, quality),
        COMPRESS_TIMEOUT_MS,
        "compress-fallback-failed",
      );
    } catch {
      return file;
    }
  }
}
