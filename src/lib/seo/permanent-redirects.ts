/**
 * Single source of truth for permanent SEO redirects.
 * Mirrored in vercel.json — keep both in sync (scripts/check-release.mjs verifies).
 * Applied at the Nitro server entry so redirects work even if vercel.json is stripped.
 *
 * Destinations use `/ar/...` (Arabic locale prefix). Legacy unprefixed public URLs
 * are also rewritten to `/ar/...` via `legacyToArabicPath` in server.ts.
 */
export const PERMANENT_REDIRECTS: Readonly<Record<string, string>> = {
  "/web-design-egypt": "/ar/web-design-saudi-arabia",
  "/egypt": "/ar/web-design-saudi-arabia",
  /** Short URL → Saudi web-design landing */
  "/web-design": "/ar/web-design-saudi-arabia",
  /** Legacy / invented slugs that previously 404'd */
  "/services/web-design-development": "/ar/services/web-design",
  "/services/seo-optimization": "/ar/services/seo",
  "/services/ecommerce-development": "/ar/ecommerce-development",
  "/services/ui-ux-design": "/ar/services/ui-ux",
  "/saudi-web-design": "/ar/web-design-saudi-arabia",
  "/saudi-seo-services": "/ar/seo-services",
  /** Legacy Riyadh URL → dedicated Riyadh landing (not national) */
  "/riyadh-web-development": "/ar/web-design-riyadh",
  "/case-studies": "/ar/portfolio",
  /** Removed cookies policy page — keep old URLs from indexing as soft 404 */
  "/cookies": "/ar/privacy",
  /** Removed public pricing page — quotes via contact */
  "/pricing": "/ar/contact",
};
