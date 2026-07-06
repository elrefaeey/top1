import {
  getBlogPostBySlug,
  getBlogPosts,
  getFaqs,
  getPageBySlug,
  getPortfolio,
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
        const { collection, getDocs, query, where } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase/firestore");
        const snap = await getDocs(
          query(collection(db, "services"), where("status", "==", "published")),
        );
        const services = await getServices();
        const blog = await getBlogPosts();
        const portfolio = await getPortfolio();
        return {
          ok: true,
          firebase: true,
          directQueryCount: snap.size,
          servicesCount: services.length,
          blogCount: blog.length,
          portfolioCount: portfolio.length,
        };
      } catch (err) {
        return {
          ok: false,
          firebase: true,
          error: err instanceof Error ? err.message : "CMS health check failed",
        };
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
