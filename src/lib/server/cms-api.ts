import {
  getBlogPostBySlug,
  getBlogPosts,
  getFaqs,
  getPageBySlug,
  getPortfolio,
  getPortfolioItemBySlug,
  getPricingPlans,
  getServiceBySlug,
  getServices,
  getSiteSettings,
  getSiteStats,
  getTestimonials,
  getTrendingPosts,
} from "@/lib/cms/content-service";
import { getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase/config";

function ensureServerFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase env vars are not set on the server");
  }
  getFirebaseApp();
}

export async function handleCmsApiGet(
  resource: string,
  searchParams: URLSearchParams,
): Promise<unknown> {
  ensureServerFirebase();

  switch (resource) {
    case "health": {
      try {
        const services = await getServices();
        return {
          ok: true,
          servicesCount: services.length,
        };
      } catch {
        return { ok: false };
      }
    }
    case "settings":
      return getSiteSettings();
    case "services":
      return getServices();
    case "service": {
      const slug = searchParams.get("slug");
      if (!slug) throw new Error("Missing slug");
      return getServiceBySlug(slug);
    }
    case "portfolio":
      return getPortfolio();
    case "portfolio-item": {
      const slug = searchParams.get("slug");
      if (!slug) throw new Error("Missing slug");
      return getPortfolioItemBySlug(slug);
    }
    case "blog": {
      const maxRaw = searchParams.get("max");
      const max = maxRaw ? Number(maxRaw) : undefined;
      return getBlogPosts(Number.isFinite(max) ? max : undefined);
    }
    case "blog-post": {
      const slug = searchParams.get("slug");
      if (!slug) throw new Error("Missing slug");
      return getBlogPostBySlug(slug);
    }
    case "trending": {
      const maxRaw = searchParams.get("max");
      const max = maxRaw ? Number(maxRaw) : 3;
      return getTrendingPosts(max);
    }
    case "testimonials":
      return getTestimonials();
    case "pricing":
      return getPricingPlans();
    case "faqs":
      return getFaqs();
    case "stats":
      return getSiteStats();
    case "home": {
      const blogMaxRaw = searchParams.get("blogMax");
      const blogMax = blogMaxRaw ? Number(blogMaxRaw) : 3;
      const [settings, services, portfolio, stats, testimonials, faqs, blog] = await Promise.all([
        getSiteSettings(),
        getServices(),
        getPortfolio(),
        getSiteStats(),
        getTestimonials(),
        getFaqs(),
        getBlogPosts(Number.isFinite(blogMax) ? blogMax : 3),
      ]);
      return {
        settings,
        services,
        portfolio,
        stats,
        testimonials,
        faqs,
        blog,
      };
    }
    case "page": {
      const slug = searchParams.get("slug");
      if (!slug) throw new Error("Missing slug");
      return getPageBySlug(slug);
    }
    case "page-id": {
      const id = searchParams.get("id");
      if (!id) throw new Error("Missing id");
      const { getPageById } = await import("@/lib/cms/content-service");
      return getPageById(id);
    }
    default:
      return null;
  }
}
