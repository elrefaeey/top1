export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Slug used in public blog URLs — falls back to document id when slug is missing. */
export function blogPostSlug(post: { slug?: string; id: string }): string {
  return post.slug?.trim() || post.id;
}

export function nowIso(): string {
  return new Date().toISOString();
}

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
