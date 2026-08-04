import { blogPostSlug, portfolioItemSlug, authorSlug } from "@/lib/cms/admin-utils";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { PERMANENT_REDIRECTS } from "@/lib/seo/permanent-redirects";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import {
  absoluteImageUrl,
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  resolveLandingOgImage,
} from "@/lib/seo";
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

export function buildSitemapEntries(input: {
  services: WithId<Service>[];
  blog: WithId<BlogPost>[];
  portfolio: WithId<PortfolioItem>[];
  authors?: WithId<Author>[];
}): SitemapEntry[] {
  const landingPages: SitemapEntry[] = SEO_LANDING_PAGES.map((p) => {
    const og = resolveLandingOgImage(p.path);
    return {
      path: p.path,
      changefreq: "monthly" as const,
      priority:
        p.path.includes("riyadh") ||
        p.path.includes("jeddah") ||
        p.path.includes("dammam") ||
        p.path.includes("khobar") ||
        p.path.includes("dubai") ||
        p.path.includes("abu-dhabi") ||
        p.path.includes("sharjah") ||
        p.path.includes("qassim") ||
        p.path.includes("buraidah")
          ? "0.9"
          : "0.85",
      lastmod: undefined,
      // Thematic OG assets for money landings; skip logo-only fallback.
      images:
        og && og !== DEFAULT_OG_IMAGE ? [{ loc: og, title: p.title || p.h1 }] : undefined,
    };
  });

  const staticPages: SitemapEntry[] = [
    { path: "/", changefreq: "weekly", priority: "1.0" },
    { path: "/about", changefreq: "monthly", priority: "0.8" },
    { path: "/services", changefreq: "weekly", priority: "0.9" },
    { path: "/portfolio", changefreq: "weekly", priority: "0.8" },
    { path: "/blog", changefreq: "weekly", priority: "0.8" },
    { path: "/pricing", changefreq: "monthly", priority: "0.75" },
    { path: "/contact", changefreq: "monthly", priority: "0.7" },
    { path: "/privacy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
    { path: "/cookies", changefreq: "yearly", priority: "0.3" },
    ...landingPages,
  ];

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
  return [
    ...staticPages,
    ...servicePages,
    ...blogPages,
    ...portfolioPages,
    ...authorPages,
  ].filter((entry) => {
    if (seen.has(entry.path)) return false;
    if (PERMANENT_REDIRECTS[entry.path]) return false;
    seen.add(entry.path);
    return true;
  });
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      const images =
        entry.images
          ?.filter((img) => Boolean(img.loc))
          .map((img) => {
            const loc = escapeXml(absoluteImageUrl(img.loc));
            const title = img.title ? `\n      <image:title>${escapeXml(img.title)}</image:title>` : "";
            const caption = img.caption
              ? `\n      <image:caption>${escapeXml(img.caption.slice(0, 200))}</image:caption>`
              : "";
            return `\n    <image:image>\n      <image:loc>${loc}</image:loc>${title}${caption}\n    </image:image>`;
          })
          .join("") ?? "";
      return `  <url>
    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>${lastmod}
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
