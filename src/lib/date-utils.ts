/** تاريخ من Firestore — بدون fallback-data */
export function formatPostDate(iso: string, locale: string = "ar-SA"): string {
  try {
    return new Date(iso).toLocaleDateString(locale, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
