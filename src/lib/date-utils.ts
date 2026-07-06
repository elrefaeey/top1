/** تاريخ من Firestore — بدون fallback-data */
export function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar-EG", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
