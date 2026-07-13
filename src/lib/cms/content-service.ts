import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { getDb, COLLECTIONS, getReadTimeoutMs, withFirestoreTimeout } from "@/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type {
  BlogPost,
  CmsPage,
  FaqItem,
  PortfolioItem,
  PricingPlan,
  Service,
  SiteSettings,
  SiteStat,
  Testimonial,
  WithId,
} from "@/types/cms";
import { normalizePublicSiteSettings } from "@/lib/cms/normalize-settings";

const READ_MS = getReadTimeoutMs();

function mapDoc<T>(snap: { id: string; data: () => unknown }): WithId<T> {
  return { id: snap.id, ...(snap.data() as T) };
}

function sortByField<T>(items: WithId<T>[], field: string, direction: "asc" | "desc" = "asc") {
  const dir = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[field];
    const bv = (b as unknown as Record<string, unknown>)[field];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
    return 0;
  });
}

function isPublicCmsItem(item: Record<string, unknown>): boolean {
  const status = item.status;
  return status === undefined || status === null || status === "published";
}

async function getPublished<T>(
  collectionName: string,
  orderField = "order",
  max?: number,
): Promise<WithId<T>[]> {
  try {
    const q = query(collection(getDb(), collectionName), where("status", "==", "published"));
    const snap = await withFirestoreTimeout(getDocs(q), READ_MS);
    if (snap.docs.length > 0) {
      let items = snap.docs.map((d) => mapDoc<T>(d));
      items = sortByField(items, orderField, "asc");
      if (max) items = items.slice(0, max);
      return items;
    }
  } catch (err) {
    console.error(`[cms] published query failed for ${collectionName}:`, err);
  }

  // مستندات قديمة بدون حقل status
  const snap = await withFirestoreTimeout(getDocs(collection(getDb(), collectionName)), READ_MS);
  let items = snap.docs
    .map((d) => mapDoc<T>(d))
    .filter((item) => isPublicCmsItem(item as unknown as Record<string, unknown>));
  items = sortByField(items, orderField, "asc");
  if (max) items = items.slice(0, max);
  return items;
}

async function safeList<T>(
  fetcher: () => Promise<WithId<T>[]>,
  label?: string,
): Promise<WithId<T>[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return await fetcher();
  } catch (err) {
    console.error(`[cms] safeList failed${label ? ` (${label})` : ""}:`, err);
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const snap = await withFirestoreTimeout(
      getDoc(doc(getDb(), COLLECTIONS.siteSettings, "global")),
      READ_MS,
    );
    if (!snap.exists()) return null;
    return normalizePublicSiteSettings(snap.data() as SiteSettings);
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<WithId<CmsPage> | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const q = query(
      collection(getDb(), COLLECTIONS.pages),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1),
    );
    const snap = await withFirestoreTimeout(getDocs(q), READ_MS);
    if (snap.empty) return null;
    return mapDoc<CmsPage>(snap.docs[0]!);
  } catch {
    return null;
  }
}

export async function getPageById(id: string): Promise<WithId<CmsPage> | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const snap = await withFirestoreTimeout(getDoc(doc(getDb(), COLLECTIONS.pages, id)), READ_MS);
    if (!snap.exists()) return null;
    const page = mapDoc<CmsPage>(snap);
    return isPublicCmsItem(page as unknown as Record<string, unknown>) ? page : null;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<WithId<Service>[]> {
  return safeList(() => getPublished<Service>(COLLECTIONS.services), "services");
}

export async function getServiceBySlug(slug: string): Promise<WithId<Service> | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const q = query(
      collection(getDb(), COLLECTIONS.services),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1),
    );
    const snap = await withFirestoreTimeout(getDocs(q), READ_MS);
    if (!snap.empty) return mapDoc<Service>(snap.docs[0]!);
  } catch {
    // empty
  }
  return null;
}

export async function getPortfolio(): Promise<WithId<PortfolioItem>[]> {
  return safeList(() => getPublished<PortfolioItem>(COLLECTIONS.portfolio), "portfolio");
}

function normalizePortfolioItem(docId: string, item: PortfolioItem): WithId<PortfolioItem> {
  const slug = item.slug?.trim() || docId;
  return { ...item, id: docId, slug };
}

export async function getPortfolioItemBySlug(slug: string): Promise<WithId<PortfolioItem> | null> {
  const normalized = normalizeBlogSlugParam(slug);
  if (!normalized || !isFirebaseConfigured()) return null;

  try {
    const snap = await withFirestoreTimeout(
      getDoc(doc(getDb(), COLLECTIONS.portfolio, normalized)),
      READ_MS,
    );
    if (snap.exists()) {
      const item = normalizePortfolioItem(snap.id, mapDoc<PortfolioItem>(snap));
      if (isPublicCmsItem(item as unknown as Record<string, unknown>)) return item;
    }
  } catch {
    // continue to list lookup
  }

  try {
    const items = await getPortfolio();
    return (
      items.find(
        (p) =>
          p.slug === normalized ||
          p.id === normalized ||
          (p.slug && encodeURIComponent(p.slug) === slug),
      ) ?? null
    );
  } catch {
    return null;
  }
}

function normalizeBlogPost(docId: string, post: BlogPost): WithId<BlogPost> {
  const slug = post.slug?.trim() || docId;
  return { ...post, id: docId, slug };
}

function normalizeBlogSlugParam(slug: string): string {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

export async function getBlogPosts(max?: number): Promise<WithId<BlogPost>[]> {
  return safeList(async () => {
    try {
      const q = query(collection(getDb(), COLLECTIONS.blogPosts), where("status", "==", "published"));
      const snap = await withFirestoreTimeout(getDocs(q), READ_MS);
      if (snap.docs.length > 0) {
        let items = snap.docs.map((d) => normalizeBlogPost(d.id, mapDoc<BlogPost>(d)));
        items = sortByField(items, "publishedAt", "desc");
        if (max) items = items.slice(0, max);
        return items;
      }
    } catch (err) {
      console.error("[cms] blog published query failed:", err);
    }

    const snap = await withFirestoreTimeout(getDocs(collection(getDb(), COLLECTIONS.blogPosts)), READ_MS);
    let items = snap.docs
      .map((d) => normalizeBlogPost(d.id, mapDoc<BlogPost>(d)))
      .filter((item) => isPublicCmsItem(item as unknown as Record<string, unknown>));
    items = sortByField(items, "publishedAt", "desc");
    if (max) items = items.slice(0, max);
    return items;
  }, "blog");
}

export async function getBlogPostBySlug(slug: string): Promise<WithId<BlogPost> | null> {
  const normalized = normalizeBlogSlugParam(slug);
  if (!normalized || !isFirebaseConfigured()) return null;

  try {
    const snap = await withFirestoreTimeout(
      getDoc(doc(getDb(), COLLECTIONS.blogPosts, normalized)),
      READ_MS,
    );
    if (snap.exists()) {
      const post = normalizeBlogPost(snap.id, mapDoc<BlogPost>(snap));
      if (isPublicCmsItem(post as unknown as Record<string, unknown>)) return post;
    }
  } catch {
    // continue to list lookup
  }

  try {
    const posts = await getBlogPosts();
    return (
      posts.find(
        (p) =>
          p.slug === normalized ||
          p.id === normalized ||
          (p.slug && encodeURIComponent(p.slug) === slug),
      ) ?? null
    );
  } catch {
    return null;
  }
}

export async function getTrendingPosts(max = 3): Promise<WithId<BlogPost>[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.trending).slice(0, max);
}

export async function getTestimonials(): Promise<WithId<Testimonial>[]> {
  return safeList(() => getPublished<Testimonial>(COLLECTIONS.testimonials));
}

export async function getPricingPlans(): Promise<WithId<PricingPlan>[]> {
  return safeList(() => getPublished<PricingPlan>(COLLECTIONS.pricingPlans));
}

export async function getFaqs(): Promise<WithId<FaqItem>[]> {
  return safeList(() => getPublished<FaqItem>(COLLECTIONS.faqs));
}

export async function getSiteStats(): Promise<WithId<SiteStat>[]> {
  const { FALLBACK_SITE_STATS } = await import("@/lib/cms/fallback-data");
  const items = await safeList(() => getPublished<SiteStat>(COLLECTIONS.siteStats));
  if (items.length > 0) return items;
  return FALLBACK_SITE_STATS.map((s) => ({ ...s }));
}

