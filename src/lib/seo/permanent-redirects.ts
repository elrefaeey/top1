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
  /** Legacy Riyadh URL → dedicated Riyadh landing (not national) */
  "/riyadh-web-development": "/web-design-riyadh",
  "/case-studies": "/portfolio",
};

/** Prefix redirects for nested legacy paths (mirrored by vercel.json `:path*`). */
export const PERMANENT_PREFIX_REDIRECTS: ReadonlyArray<{
  prefix: string;
  destination: string;
}> = [{ prefix: "/case-studies/", destination: "/portfolio" }];

export function resolvePermanentRedirect(pathname: string): string | undefined {
  const path = pathname.replace(/\/+$/, "") || "/";
  const exact = PERMANENT_REDIRECTS[path] ?? PERMANENT_REDIRECTS[pathname];
  if (exact) return exact;
  for (const rule of PERMANENT_PREFIX_REDIRECTS) {
    if (path.startsWith(rule.prefix) || pathname.startsWith(rule.prefix)) {
      return rule.destination;
    }
  }
  return undefined;
}
