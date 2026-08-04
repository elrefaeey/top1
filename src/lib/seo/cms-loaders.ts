import { blogPostSlug } from "@/lib/cms/admin-utils";
import {
  getAuthors,
  getBlogPostBySlug,
  getBlogPosts,
  getPortfolio,
  getPortfolioItemBySlug,
  getServiceBySlug,
  getServices,
} from "@/lib/cms/content-service";
import { FALLBACK_BLOG_POSTS, FALLBACK_SERVICES } from "@/lib/cms/fallback-data";
import { sanitizeCmsHtml } from "@/lib/server/sanitize-cms-html";
import { serviceSlugCandidates } from "@/lib/seo/service-slug-aliases";
import type { Author, BlogPost, PortfolioItem, Service, WithId } from "@/types/cms";

function sanitizeFallbackPost(post: WithId<BlogPost>): WithId<BlogPost> {
  return {
    ...post,
    content: post.content ? sanitizeCmsHtml(post.content) : post.content,
  };
}

function sanitizeService(service: WithId<Service>): WithId<Service> {
  if (!service.description || !/<[a-z][\s\S]*>/i.test(service.description)) {
    return service;
  }
  return {
    ...service,
    description: sanitizeCmsHtml(service.description),
  };
}

export async function loadServiceForSeo(slug: string): Promise<WithId<Service> | null> {
  const candidates = serviceSlugCandidates(slug);

  for (const candidate of candidates) {
    const fromDb = await getServiceBySlug(candidate);
    if (fromDb) return sanitizeService(fromDb);
  }

  const published = await getServices();
  const byIdOrSlug = published.find(
    (s) =>
      candidates.includes(s.slug) || candidates.includes(s.id) || s.slug === slug || s.id === slug,
  );
  if (byIdOrSlug) return sanitizeService(byIdOrSlug);

  const fallback = FALLBACK_SERVICES.find(
    (s) =>
      candidates.includes(s.slug) || candidates.includes(s.id) || s.slug === slug || s.id === slug,
  );
  return fallback ? sanitizeService({ ...fallback }) : null;
}

export async function loadBlogPostForSeo(slug: string): Promise<WithId<BlogPost> | null> {
  const fromDb = await getBlogPostBySlug(slug);
  if (fromDb) return fromDb;
  const fallback = FALLBACK_BLOG_POSTS.find(
    (p) => blogPostSlug(p) === slug || p.id === slug || p.slug === slug,
  );
  return fallback ? sanitizeFallbackPost({ ...fallback }) : null;
}

export async function loadPortfolioItemForSeo(slug: string): Promise<WithId<PortfolioItem> | null> {
  return getPortfolioItemBySlug(slug);
}

export async function loadSitemapEntries(): Promise<{
  services: WithId<Service>[];
  blog: WithId<BlogPost>[];
  portfolio: WithId<PortfolioItem>[];
  authors: WithId<Author>[];
}> {
  const settled = await Promise.allSettled([
    getServices(),
    getBlogPosts(),
    getPortfolio(),
    getAuthors(),
  ]);

  const services =
    settled[0].status === "fulfilled" && settled[0].value.length > 0
      ? settled[0].value
      : FALLBACK_SERVICES.map((s) => ({ ...s }));
  const blog =
    settled[1].status === "fulfilled" && settled[1].value.length > 0
      ? settled[1].value
      : FALLBACK_BLOG_POSTS.map((p) => ({ ...p }));
  const portfolio = settled[2].status === "fulfilled" ? settled[2].value : [];
  const authors = settled[3].status === "fulfilled" ? settled[3].value : [];

  return { services, blog, portfolio, authors };
}
