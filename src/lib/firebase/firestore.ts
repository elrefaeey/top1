import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp } from "./config";

let dbInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (dbInstance) return dbInstance;

  const app = getFirebaseApp();
  try {
    dbInstance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    dbInstance = getFirestore(app);
  }
  return dbInstance;
}

/** @deprecated use getDb() — kept for existing imports */
export const db = getDb();

export const COLLECTIONS = {
  users: "users",
  siteSettings: "site_settings",
  pages: "pages",
  services: "services",
  portfolio: "portfolio",
  blogPosts: "blog_posts",
  blogCategories: "blog_categories",
  blogTags: "blog_tags",
  testimonials: "testimonials",
  pricingPlans: "pricing_plans",
  faqs: "faqs",
  siteStats: "site_stats",
  leads: "leads",
  media: "media",
} as const;

export function withFirestoreTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Firestore request timed out")), ms);
    }),
  ]);
}
