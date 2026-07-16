import {
  initializeFirestore,
  getFirestore,
  type Firestore,
  type FirestoreSettings,
} from "firebase/firestore";
import { getFirebaseApp, isFirebaseConfigured } from "./config";

export { COLLECTIONS } from "./collections";

let dbInstance: Firestore | null = null;

function isServerRuntime(): boolean {
  return typeof window === "undefined";
}

export function getReadTimeoutMs(): number {
  // Vercel/serverless: أول اتصال Firestore قد يأخذ وقتاً أطول
  return isServerRuntime() ? 30_000 : 8_000;
}

export function getDb(): Firestore {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured");
  }
  if (dbInstance) return dbInstance;

  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase is not configured");
  try {
    const settings: FirestoreSettings = isServerRuntime()
      ? ({ preferRest: true } as FirestoreSettings)
      : { experimentalAutoDetectLongPolling: true };
    dbInstance = initializeFirestore(app, settings);
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

export function withFirestoreTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("Firestore request timed out")), ms);
    }),
  ]);
}
