export function slugify(text: string): string {
  return flattenTitle(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Collapse line breaks for SEO, alt text, and browser tabs. */
export function flattenTitle(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Split "Brand\\nSpecialty" titles used on portfolio pages. */
export function splitDisplayTitle(title: string): { name: string; specialty: string } {
  const parts = title
    .split(/\n+/u)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    name: parts[0] || title.trim(),
    specialty: parts.slice(1).join(" "),
  };
}

/** Slug used in public blog URLs — falls back to document id when slug is missing. */
export function blogPostSlug(post: { slug?: string; id: string }): string {
  return post.slug?.trim() || post.id;
}

/** Slug used in public portfolio URLs — falls back to document id when slug is missing. */
export function portfolioItemSlug(item: { slug?: string; id: string }): string {
  return item.slug?.trim() || item.id;
}

/** Slug used in public author profile URLs. */
export function authorSlug(item: { slug?: string; id: string }): string {
  return item.slug?.trim() || item.id;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Next display order when adding a new ordered CMS item. */
export function nextOrderFromList(items: Array<{ order?: number }>): number {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.order ?? 0)) + 1;
}

export function normalizeDisplayOrder(value: unknown): number {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

/**
 * When inserting or moving an item to `newOrder`, bump others so numbers stay unique.
 * Insert at 2 → old 2 becomes 3, old 3 becomes 4, …
 */
export function planOrderShifts(
  items: Array<{ id: string; order?: number }>,
  id: string,
  newOrder: number,
  isNew: boolean,
): Array<{ id: string; order: number }> {
  const target = normalizeDisplayOrder(newOrder);
  const current = items.find((item) => item.id === id);
  const parsedOld = current ? Math.trunc(Number(current.order) || 0) : 0;
  const oldOrder = isNew || parsedOld < 1 ? null : parsedOld;
  const others = items.filter((item) => item.id !== id);
  const shifts: Array<{ id: string; order: number }> = [];

  if (oldOrder == null) {
    for (const item of others) {
      const order = Math.trunc(Number(item.order) || 0);
      if (order >= target) shifts.push({ id: item.id, order: order + 1 });
    }
    return shifts;
  }

  if (target === oldOrder) return shifts;

  if (target < oldOrder) {
    for (const item of others) {
      const order = Math.trunc(Number(item.order) || 0);
      if (order >= target && order < oldOrder) {
        shifts.push({ id: item.id, order: order + 1 });
      }
    }
    return shifts;
  }

  for (const item of others) {
    const order = Math.trunc(Number(item.order) || 0);
    if (order > oldOrder && order <= target) {
      shifts.push({ id: item.id, order: order - 1 });
    }
  }
  return shifts;
}

export const ADMIN_ORDER_HINT =
  "لو اخترت رقماً موجوداً، العناصر من هذا الرقم تنزل تلقائياً (٢ تصبح ٣، و٣ تصبح ٤).";

export function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[]): string {
  return items.join("\n");
}

export function commaToArray(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function arrayToComma(items: string[]): string {
  return items.join(", ");
}
