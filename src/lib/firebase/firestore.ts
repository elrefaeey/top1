import { initializeFirestore, getFirestore, type Firestore } from "firebase/firestore";
import { getFirebaseApp, isFirebaseConfigured } from "./config";

let dbInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured");
  }
  if (dbInstance) return dbInstance;

  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase is not configured");
  try {
    dbInstance = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    dbInstance = getFirestore(app);
  }
  return dbInstance;
}

function createLazyDb(): Firestore {
  return new Proxy({} as Firestore, {
    get(_target, prop) {
      if (!isFirebaseConfigured()) {
        throw new Error("Firebase is not configured");
      }
      const instance = getDb();
      const value = Reflect.get(instance as object, prop, instance);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  });
}

/** Lazy Firestore — avoids init during SSR module load */
export const db = createLazyDb();

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
