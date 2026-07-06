import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  limit,
} from "firebase/firestore";
import { db, COLLECTIONS, withFirestoreTimeout } from "@/lib/firebase/firestore";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { nowIso } from "@/lib/cms/admin-utils";
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

const READ_MS = 5000;

function mapDoc<T>(snap: { id: string; data: () => T | undefined }): WithId<T> {
  return { id: snap.id, ...snap.data()! };
}

function sortByField<T>(items: WithId<T>[], field: string, direction: "asc" | "desc" = "asc") {
  const dir = direction === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const av = (a as Record<string, unknown>)[field];
    const bv = (b as Record<string, unknown>)[field];
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
    return 0;
  });
}

async function getPublished<T>(
  collectionName: string,
  orderField = "order",
  max?: number,
): Promise<WithId<T>[]> {
  // فلترة status فقط — بدون orderBy في Firestore (يتجنّب index مركّب)
  const q = query(collection(db, collectionName), where("status", "==", "published"));
  const snap = await withFirestoreTimeout(getDocs(q), READ_MS);
  let items = snap.docs.map((d) => mapDoc<T>(d));
  items = sortByField(items, orderField, "asc");
  if (max) items = items.slice(0, max);
  return items;
}

async function safeList<T>(
  fetcher: () => Promise<WithId<T>[]>,
): Promise<WithId<T>[]> {
  if (!isFirebaseConfigured()) return [];
  try {
    return await fetcher();
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const snap = await withFirestoreTimeout(
      getDoc(doc(db, COLLECTIONS.siteSettings, "global")),
      READ_MS,
    );
    return snap.exists() ? (snap.data() as SiteSettings) : null;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string): Promise<WithId<CmsPage> | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const q = query(
      collection(db, COLLECTIONS.pages),
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
    const snap = await withFirestoreTimeout(getDoc(doc(db, COLLECTIONS.pages, id)), READ_MS);
    if (!snap.exists()) return null;
    const page = mapDoc<CmsPage>(snap);
    return page.status === "published" ? page : null;
  } catch {
    return null;
  }
}

export async function getServices(): Promise<WithId<Service>[]> {
  return safeList(() => getPublished<Service>(COLLECTIONS.services));
}

export async function getServiceBySlug(slug: string): Promise<WithId<Service> | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const q = query(
      collection(db, COLLECTIONS.services),
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
  return safeList(() => getPublished<PortfolioItem>(COLLECTIONS.portfolio));
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
    const q = query(collection(db, COLLECTIONS.blogPosts), where("status", "==", "published"));
    const snap = await withFirestoreTimeout(getDocs(q), READ_MS);
    let items = snap.docs.map((d) => normalizeBlogPost(d.id, mapDoc<BlogPost>(d)));
    items = sortByField(items, "publishedAt", "desc");
    if (max) items = items.slice(0, max);
    return items;
  });
}

export async function getBlogPostBySlug(slug: string): Promise<WithId<BlogPost> | null> {
  const normalized = normalizeBlogSlugParam(slug);
  if (!normalized || !isFirebaseConfigured()) return null;

  try {
    const snap = await withFirestoreTimeout(
      getDoc(doc(db, COLLECTIONS.blogPosts, normalized)),
      READ_MS,
    );
    if (snap.exists()) {
      const post = normalizeBlogPost(snap.id, mapDoc<BlogPost>(snap));
      if (post.status === "published") return post;
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

export async function createLead(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}): Promise<void> {
  const ref = doc(collection(db, COLLECTIONS.leads));
  const ts = nowIso();
  await withFirestoreTimeout(
    setDoc(ref, {
      ...input,
      source: input.source ?? "contact_form",
      status: "new" as const,
      createdAt: ts,
      updatedAt: ts,
    }),
    READ_MS,
  );
}
