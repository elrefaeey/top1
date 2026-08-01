/**
 * Single source of truth for permanent SEO redirects.
 * Mirrored in vercel.json — keep both in sync (scripts/check-release.mjs verifies).
 * Applied at the Nitro server entry so redirects work even if vercel.json is stripped.
 */
export const PERMANENT_REDIRECTS: Readonly<Record<string, string>> = {
  "/web-design-egypt": "/web-design-saudi-arabia",
  "/egypt": "/web-design-saudi-arabia",
  /** Short URL → Saudi web-design landing */
  "/web-design": "/web-design-saudi-arabia",
  /** Legacy / invented slugs that previously 404'd */
  "/services/web-design-development": "/services/web-design",
  "/services/seo-optimization": "/services/seo",
  "/services/ecommerce-development": "/ecommerce-development",
  "/services/ui-ux-design": "/services/ui-ux",
  "/saudi-web-design": "/web-design-saudi-arabia",
  "/saudi-seo-services": "/seo-services",
  "/riyadh-web-development": "/web-design-saudi-arabia",
};
