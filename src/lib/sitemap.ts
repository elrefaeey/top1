import { blogPostSlug, portfolioItemSlug, authorSlug } from "@/lib/cms/admin-utils";
import { PERMANENT_REDIRECTS } from "@/lib/seo/permanent-redirects";
import { getPublicStaticSitemapPaths } from "@/lib/seo/public-sitemap-paths";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import {
  absoluteImageUrl,
  DEFAULT_OG_IMAGE,
  resolveLandingOgImage,
} from "@/lib/seo";
import { SITE_PRODUCTION_URL } from "@/lib/site-config";
import type { Author, BlogPost, PortfolioItem, Service, WithId } from "@/types/cms";

export type SitemapImage = {
  loc: string;
  title?: string;
  caption?: string;
};

export type SitemapEntry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
  lastmod?: string;
  images?: SitemapImage[];
};

/** Sitemap locs always use the official production host — never localhost/vercel previews. */
export function absoluteSitemapUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_PRODUCTION_URL.replace(/\/$/, "")}${normalizedPath}`;
}

/** Image URLs in sitemap must be absolute and production-safe. */
function sitemapImageLoc(src: string): string {
  const absolute = absoluteImageUrl(src);
  return absolute
    .replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, SITE_PRODUCTION_URL.replace(/\/$/, ""))
    .replace(/^https?:\/\/[^/]*vercel\.app/i, SITE_PRODUCTION_URL.replace(/\/$/, ""));
}

function toLastmod(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isExcludedDynamicPath(path: string): boolean {
  if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/media")) {
    return true;
  }
  if (PERMANENT_REDIRECTS[path]) return true;
  return false;
}

export function buildSitemapEntries(input: {
  services: WithId<Service>[];
  blog: WithId<BlogPost>[];
  portfolio: WithId<PortfolioItem>[];
  authors?: WithId<Author>[];
}): SitemapEntry[] {
  const landingByPath = new Map(SEO_LANDING_PAGES.map((p) => [p.path, p]));

  const staticPages: SitemapEntry[] = getPublicStaticSitemapPaths().map((p) => {
    const landing = landingByPath.get(p.path);
    const og = resolveLandingOgImage(p.path);
    return {
      path: p.path,
      changefreq: p.changefreq,
      priority: p.priority,
      // Thematic OG assets for money landings; skip logo-only fallback.
      images:
        landing && og && og !== DEFAULT_OG_IMAGE
          ? [{ loc: og, title: landing.title || landing.h1 }]
          : undefined,
    };
  });

  const servicePages: SitemapEntry[] = input.services.map((service) => ({
    path: `/services/${preferredServiceSlug(service.slug || service.id)}`,
    changefreq: "monthly" as const,
    priority: "0.65",
    lastmod: toLastmod(service.updatedAt),
    images: service.imageUrl
      ? [{ loc: service.imageUrl, title: service.title }]
      : undefined,
  }));

  const blogPages: SitemapEntry[] = input.blog.map((post) => ({
    path: `/blog/${blogPostSlug(post)}`,
    changefreq: "monthly" as const,
    priority: "0.6",
    lastmod: toLastmod(post.updatedAt ?? post.publishedAt),
    images: post.featuredImage
      ? [
          {
            loc: post.featuredImage,
            title: post.title,
            caption: post.featuredImageAlt || post.excerpt,
          },
        ]
      : undefined,
  }));

  const portfolioPages: SitemapEntry[] = input.portfolio.map((item) => ({
    path: `/portfolio/${portfolioItemSlug(item)}`,
    changefreq: "monthly" as const,
    priority: "0.6",
    lastmod: toLastmod(item.updatedAt),
    images: item.imageUrl
      ? [{ loc: item.imageUrl, title: item.title, caption: item.description }]
      : undefined,
  }));

  const authorPages: SitemapEntry[] = (input.authors ?? []).map((author) => ({
    path: `/authors/${authorSlug(author)}`,
    changefreq: "monthly" as const,
    priority: "0.55",
    lastmod: toLastmod(author.updatedAt),
  }));

  const seen = new Set<string>();
  return [...staticPages, ...servicePages, ...blogPages, ...portfolioPages, ...authorPages].filter(
    (entry) => {
      if (seen.has(entry.path)) return false;
      if (isExcludedDynamicPath(entry.path)) return false;
      seen.add(entry.path);
      return true;
    },
  );
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      const images =
        entry.images
          ?.filter((img) => Boolean(img.loc))
          .map((img) => {
            const loc = escapeXml(sitemapImageLoc(img.loc));
            const title = img.title ? `\n      <image:title>${escapeXml(img.title)}</image:title>` : "";
            const caption = img.caption
              ? `\n      <image:caption>${escapeXml(img.caption.slice(0, 200))}</image:caption>`
              : "";
            return `\n    <image:image>\n      <image:loc>${loc}</image:loc>${title}${caption}\n    </image:image>`;
          })
          .join("") ?? "";
      return `  <url>
    <loc>${escapeXml(absoluteSitemapUrl(entry.path))}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${images}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}
