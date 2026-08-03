/** Shared image URL guards for CMS / uploads. */

const ALLOWED_HTTP = /^https?:\/\//i;
const DATA_IMAGE = /^data:image\//i;

/** Image-like string fields that must never ship Base64 to the public site. */
const PUBLIC_IMAGE_KEYS = [
  "imageUrl",
  "featuredImage",
  "ogImage",
  "heroImageUrl",
  "logoUrl",
  "faviconUrl",
  "authorImage",
] as const;

export function isDataImageUrl(value: string): boolean {
  return DATA_IMAGE.test(value.trim());
}

export function isHttpImageUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return ALLOWED_HTTP.test(v);
  }
}

/**
 * Returns a usable public image URL, or "" when the value is missing / Base64.
 * Base64 data-URLs inflate HTML/JSON and are rejected for public delivery.
 */
export function sanitizePublicImageUrl(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (isDataImageUrl(trimmed)) return "";
  return trimmed;
}

/** Strip Base64 image fields from a CMS document before public SSR/API responses. */
export function stripDataImagesFromPublicCmsItem<T extends Record<string, unknown>>(item: T): T {
  let changed = false;
  const out: Record<string, unknown> = { ...item };
  for (const key of PUBLIC_IMAGE_KEYS) {
    const val = out[key];
    if (typeof val === "string" && isDataImageUrl(val)) {
      out[key] = "";
      changed = true;
    }
  }
  return changed ? (out as T) : item;
}

/** Public/CMS content must use hosted URLs — refuse Base64 data URLs. */
export function assertPublicImageUrl(value: string, fieldLabel = "الصورة"): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (isDataImageUrl(trimmed)) {
    throw new Error(`${fieldLabel}: لا يُسمح بصور Base64. ارفع الصورة إلى Storage واستخدم الرابط.`);
  }
  if (!isHttpImageUrl(trimmed) && !trimmed.startsWith("/")) {
    throw new Error(`${fieldLabel}: رابط غير صالح`);
  }
  return trimmed;
}

export function rejectBase64InPayload(data: Record<string, unknown>, keys: string[]): void {
  for (const key of keys) {
    const val = data[key];
    if (typeof val === "string" && isDataImageUrl(val)) {
      throw new Error(`${key}: لا يُسمح بصور Base64 في المحتوى المنشور — استخدم رابط Storage.`);
    }
  }
}
