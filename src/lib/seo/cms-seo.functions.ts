import { createServerFn } from "@tanstack/react-start";
import type { BlogPost, CmsPage, FaqItem, PortfolioItem, Service, WithId } from "@/types/cms";

/**
 * SEO CMS loaders as server functions.
 * Route loaders are isomorphic — Firestore must never be imported into client bundles.
 */

export const loadPublishedPageSeoFn = createServerFn({ method: "GET", strict: false })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<WithId<CmsPage> | null> => {
    const { loadPublishedPageSeo } = await import("@/lib/seo/cms-page-seo");
    return loadPublishedPageSeo(data.slug);
  });

export const loadServicesRouteSeoFn = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<{
    cms: WithId<CmsPage> | null;
    services: WithId<Service>[];
    faqs: WithId<FaqItem>[];
  }> => {
    const { loadServicesRouteSeo } = await import("@/lib/seo/static-page-loaders");
    return loadServicesRouteSeo();
  },
);

export const loadPortfolioRouteSeoFn = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<{
    cms: WithId<CmsPage> | null;
    portfolio: WithId<PortfolioItem>[];
  }> => {
    const { loadPortfolioRouteSeo } = await import("@/lib/seo/static-page-loaders");
    return loadPortfolioRouteSeo();
  },
);

export const loadBlogRouteSeoFn = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<{
    cms: WithId<CmsPage> | null;
    posts: WithId<BlogPost>[];
  }> => {
    const { loadBlogRouteSeo } = await import("@/lib/seo/static-page-loaders");
    return loadBlogRouteSeo();
  },
);

export const loadContactRouteSeoFn = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<{
    cms: WithId<CmsPage> | null;
    faqs: WithId<FaqItem>[];
  }> => {
    const { loadContactRouteSeo } = await import("@/lib/seo/static-page-loaders");
    return loadContactRouteSeo();
  },
);

export const loadServiceForSeoFn = createServerFn({ method: "GET", strict: false })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<WithId<Service> | null> => {
    const { loadServiceForSeo } = await import("@/lib/seo/cms-loaders");
    return loadServiceForSeo(data.slug);
  });

export const loadBlogPostForSeoFn = createServerFn({ method: "GET", strict: false })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<WithId<BlogPost> | null> => {
    const { loadBlogPostForSeo } = await import("@/lib/seo/cms-loaders");
    return loadBlogPostForSeo(data.slug);
  });

export const loadPortfolioItemForSeoFn = createServerFn({ method: "GET", strict: false })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<WithId<PortfolioItem> | null> => {
    const { loadPortfolioItemForSeo } = await import("@/lib/seo/cms-loaders");
    return loadPortfolioItemForSeo(data.slug);
  });

export const loadSitemapEntriesFn = createServerFn({ method: "GET", strict: false }).handler(
  async (): Promise<{
    services: WithId<Service>[];
    blog: WithId<BlogPost>[];
    portfolio: WithId<PortfolioItem>[];
  }> => {
    const { loadSitemapEntries } = await import("@/lib/seo/cms-loaders");
    return loadSitemapEntries();
  },
);
