import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { PERMANENT_REDIRECTS } from "@/lib/seo/permanent-redirects";

/**
 * Core public pages — always in the sitemap (صفحة الإحالة = `/`).
 * New static marketing pages should live as route files; discovery merges them in.
 */
const CORE_PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/pricing",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
] as const;

const EXCLUDE_PREFIXES = ["/admin", "/api", "/media"] as const;
const EXCLUDE_EXACT = new Set(["/$", "/sitemap.xml", "/robots.txt"]);

/** Vite inlines this at build time → new `src/routes/*.tsx` pages appear automatically. */
const ROUTE_MODULES: Record<string, unknown> = import.meta.glob("../../routes/**/*.{ts,tsx}", {
  eager: false,
});

/** File name → URL path. Returns null when the file is not a public static page. */
export function routeFileToPublicPath(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, "/");
  const marker = "/routes/";
  const idx = normalized.lastIndexOf(marker);
  if (idx === -1) return null;

  let rel = normalized.slice(idx + marker.length);
  rel = rel.replace(/\.(ts|tsx)$/, "");

  if (rel === "__root") return null;
  if (rel === "index") return "/";

  // TanStack `[.]` = literal `.` in the URL (sitemap[.]xml → /sitemap.xml).
  // Protect those dots before splitting route groups on `.`.
  const LITERAL_DOT = "\0";
  const withLiteralDots = rel.replace(/\[\.\]/g, LITERAL_DOT);
  const path = "/" + withLiteralDots.split(".").join("/").split(LITERAL_DOT).join(".");

  if (path.includes("$")) return null;
  if (EXCLUDE_EXACT.has(path)) return null;
  if (EXCLUDE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  if (PERMANENT_REDIRECTS[path]) return null;

  return path;
}

function priorityForPath(path: string): string {
  if (path === "/") return "1.0";
  if (path === "/services") return "0.9";
  if (
    path.includes("riyadh") ||
    path.includes("jeddah") ||
    path.includes("dammam") ||
    path.includes("khobar") ||
    path.includes("dubai") ||
    path.includes("abu-dhabi") ||
    path.includes("sharjah") ||
    path.includes("qassim") ||
    path.includes("buraidah")
  ) {
    return "0.9";
  }
  if (path.startsWith("/web-design") || path.startsWith("/seo-") || path === "/seo-services") {
    return "0.85";
  }
  if (path === "/portfolio" || path === "/blog") return "0.8";
  if (path === "/pricing") return "0.75";
  if (path === "/about") return "0.8";
  if (path === "/contact") return "0.7";
  if (path === "/privacy" || path === "/terms" || path === "/cookies") return "0.3";
  if (
    path === "/digital-marketing" ||
    path === "/ecommerce-development"
  ) {
    return "0.85";
  }
  return "0.7";
}

function changefreqForPath(path: string): "daily" | "weekly" | "monthly" | "yearly" {
  if (path === "/" || path === "/services" || path === "/portfolio" || path === "/blog") {
    return "weekly";
  }
  if (path === "/privacy" || path === "/terms" || path === "/cookies") return "yearly";
  return "monthly";
}

export type PublicStaticSitemapPath = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

/**
 * All public static pages for the sitemap.
 * - Homepage `/` first (صفحة الإحالة على https://www.top1markting.com/)
 * - Auto-discovered route files (excludes /admin, /api, /media, redirects)
 * - SEO landing pages
 * Dynamic CMS URLs (services/blog/portfolio/authors) are added in buildSitemapEntries.
 */
export function getPublicStaticSitemapPaths(): PublicStaticSitemapPath[] {
  const paths = new Set<string>(CORE_PUBLIC_PATHS);

  for (const file of Object.keys(ROUTE_MODULES)) {
    const path = routeFileToPublicPath(file);
    if (path) paths.add(path);
  }

  for (const landing of SEO_LANDING_PAGES) {
    if (!PERMANENT_REDIRECTS[landing.path]) {
      paths.add(landing.path);
    }
  }

  const sorted = [...paths].sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });

  return sorted.map((path) => ({
    path,
    changefreq: changefreqForPath(path),
    priority: priorityForPath(path),
  }));
}
