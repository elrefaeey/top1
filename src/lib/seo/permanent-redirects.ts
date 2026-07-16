/**
 * Single source of truth for permanent SEO redirects.
 * Mirrored in vercel.json — keep both in sync (scripts/check-release.mjs verifies).
 * Applied at the Nitro server entry so redirects work even if vercel.json is stripped.
 */
export const PERMANENT_REDIRECTS: Readonly<Record<string, string>> = {
  "/web-design-egypt": "/web-design-saudi-arabia",
  "/egypt": "/web-design-saudi-arabia",
  "/web-design": "/services/web-design-development",
  "/services/web-design": "/services/web-design-development",
};
