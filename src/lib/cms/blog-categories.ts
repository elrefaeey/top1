/** Blog categories allowed in admin — keep in sync with public filters. */
export const BLOG_CATEGORIES = ["تصميم مواقع", "SEO"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const DEFAULT_BLOG_CATEGORY: BlogCategory = "تصميم مواقع";

const SEO_ALIASES = new Set(["seo", "سيو", "س ي و"]);

/**
 * Map legacy / free-text categories onto the two allowed values.
 * "تصميم" → "تصميم مواقع"; SEO aliases → "SEO".
 */
export function normalizeBlogCategory(raw?: string | null): BlogCategory {
  const value = (raw ?? "").trim();
  if (!value) return DEFAULT_BLOG_CATEGORY;
  if (value === "تصميم مواقع" || value === "SEO") return value;
  if (value === "تصميم") return "تصميم مواقع";
  if (SEO_ALIASES.has(value.toLowerCase())) return "SEO";
  return DEFAULT_BLOG_CATEGORY;
}

export function isBlogCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}
