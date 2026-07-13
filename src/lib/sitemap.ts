import { blogPostSlug, portfolioItemSlug } from "@/lib/cms/admin-utils";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { absoluteUrl } from "@/lib/seo";
import type { BlogPost, PortfolioItem, Service, WithId } from "@/types/cms";

export type SitemapEntry = {
  path: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
  lastmod?: string;
};

function toLastmod(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function buildSitemapEntries(input: {
  services: WithId<Service>[];
  blog: WithId<BlogPost>[];
  portfolio: WithId<PortfolioItem>[];
}): SitemapEntry[] {
  const landingPages: SitemapEntry[] = SEO_LANDING_PAGES.map((p) => ({
    path: p.path,
    changefreq: "monthly" as const,
    priority: "0.85",
  }));

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
    path: `/services/${service.slug || service.id}`,
    changefreq: "monthly" as const,
    priority: "0.7",
    lastmod: toLastmod(service.updatedAt),
  }));

  const blogPages: SitemapEntry[] = input.blog.map((post) => ({
    path: `/blog/${blogPostSlug(post)}`,
    changefreq: "monthly" as const,
    priority: "0.6",
    lastmod: toLastmod(post.updatedAt ?? post.publishedAt),
  }));

  const portfolioPages: SitemapEntry[] = input.portfolio.map((item) => ({
    path: `/portfolio/${portfolioItemSlug(item)}`,
    changefreq: "monthly" as const,
    priority: "0.6",
    lastmod: toLastmod(item.updatedAt),
  }));

  const seen = new Set<string>();
  return [...staticPages, ...servicePages, ...blogPages, ...portfolioPages].filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });
}

export function renderSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : "";
      return `  <url>
    <loc>${absoluteUrl(entry.path)}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
