/**
 * Maps alternate / legacy service slugs to the SEO content key + lookup candidates.
 * Fallback CMS uses short slugs (web-design, seo); seed CMS uses *-saudi variants.
 */

const SERVICE_SLUG_GROUPS: ReadonlyArray<readonly string[]> = [
  ["web-design", "web-design-saudi", "web-design-development"],
  ["seo", "seo-saudi", "seo-optimization"],
  ["web-apps", "ecommerce-development"],
  ["ui-ux", "ui-ux-design"],
  ["digital-solutions"],
];

/** Canonical key used in SERVICE_SEO_CONTENT */
export function serviceSeoContentKey(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  for (const group of SERVICE_SLUG_GROUPS) {
    if (group.includes(normalized)) return group[0]!;
  }
  return normalized;
}

/** All slugs that should resolve to the same service entity */
export function serviceSlugCandidates(slug: string): string[] {
  const normalized = slug.trim().toLowerCase();
  for (const group of SERVICE_SLUG_GROUPS) {
    if (group.includes(normalized)) return [...group];
  }
  return [normalized];
}
