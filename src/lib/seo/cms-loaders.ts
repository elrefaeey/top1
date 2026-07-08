import { blogPostSlug } from "@/lib/cms/admin-utils";
import {
  getBlogPostBySlug,
  getBlogPosts,
  getPortfolio,
  getPortfolioItemBySlug,
  getServiceBySlug,
  getServices,
} from "@/lib/cms/content-service";
import { FALLBACK_BLOG_POSTS, FALLBACK_SERVICES } from "@/lib/cms/fallback-data";
import type { BlogPost, PortfolioItem, Service, WithId } from "@/types/cms";

export async function loadServiceForSeo(slug: string): Promise<WithId<Service> | null> {
  const fromDb = await getServiceBySlug(slug);
  if (fromDb) return fromDb;
  const fallback = FALLBACK_SERVICES.find((s) => s.slug === slug || s.id === slug);
  return fallback ? { ...fallback } : null;
}

export async function loadBlogPostForSeo(slug: string): Promise<WithId<BlogPost> | null> {
  const fromDb = await getBlogPostBySlug(slug);
  if (fromDb) return fromDb;
  const fallback = FALLBACK_BLOG_POSTS.find(
    (p) => blogPostSlug(p) === slug || p.id === slug || p.slug === slug,
  );
  return fallback ? { ...fallback } : null;
}

export async function loadPortfolioItemForSeo(slug: string): Promise<WithId<PortfolioItem> | null> {
  return getPortfolioItemBySlug(slug);
}

export async function loadSitemapEntries(): Promise<{
  services: WithId<Service>[];
  blog: WithId<BlogPost>[];
  portfolio: WithId<PortfolioItem>[];
}> {
  const [services, blog, portfolio] = await Promise.all([
    getServices(),
    getBlogPosts(),
    getPortfolio(),
  ]);

  return {
    services: services.length > 0 ? services : FALLBACK_SERVICES.map((s) => ({ ...s })),
    blog: blog.length > 0 ? blog : FALLBACK_BLOG_POSTS.map((p) => ({ ...p })),
    portfolio,
  };
}
