/**
 * Maps alternate / legacy service slugs to the SEO content key + lookup candidates.
 * Fallback CMS uses short slugs (web-design, seo); seed CMS uses *-saudi variants.
 *
 * Group[0] is the preferred public URL slug. Permanent redirects must point legacy
 * CMS slugs at these preferred paths — never the reverse — to avoid redirect loops.
 */

const SERVICE_SLUG_GROUPS: ReadonlyArray<readonly string[]> = [
  ["web-design", "web-design-saudi", "web-design-development"],
  ["seo", "seo-saudi", "seo-optimization"],
  ["web-apps", "ecommerce-development"],
  ["ui-ux", "ui-ux-design"],
  ["digital-solutions"],
];

/** Canonical key used in SERVICE_SEO_CONTENT (= preferred public slug) */
export function serviceSeoContentKey(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  for (const group of SERVICE_SLUG_GROUPS) {
    if (group.includes(normalized)) return group[0]!;
  }
  return normalized;
}

/** Preferred public service slug for URLs, sitemap, and canonical tags */
export function preferredServiceSlug(slug: string): string {
  return serviceSeoContentKey(slug);
}

/** All slugs that should resolve to the same service entity */
export function serviceSlugCandidates(slug: string): string[] {
  const normalized = slug.trim().toLowerCase();
  for (const group of SERVICE_SLUG_GROUPS) {
    if (group.includes(normalized)) return [...group];
  }
  return [normalized];
}
