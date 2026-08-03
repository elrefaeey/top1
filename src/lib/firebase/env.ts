export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

function readEnv(key: string): string {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key]!;
  }

  // Static access — Vite only inlines these; dynamic import.meta.env[key] stays empty on SSR.
  const fromVite = readViteEnv(key);
  if (fromVite) return fromVite;

  try {
    const value = import.meta.env[key];
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

function readViteEnv(key: string): string {
  switch (key) {
    case "VITE_FIREBASE_API_KEY":
      return String(import.meta.env.VITE_FIREBASE_API_KEY ?? "");
    case "VITE_FIREBASE_AUTH_DOMAIN":
      return String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "");
    case "VITE_FIREBASE_PROJECT_ID":
      return String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "");
    case "VITE_FIREBASE_STORAGE_BUCKET":
      return String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "");
    case "VITE_FIREBASE_MESSAGING_SENDER_ID":
      return String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "");
    case "VITE_FIREBASE_APP_ID":
      return String(import.meta.env.VITE_FIREBASE_APP_ID ?? "");
    case "VITE_FIREBASE_MEASUREMENT_ID":
      return String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "");
    case "VITE_SITE_URL":
      return String(import.meta.env.VITE_SITE_URL ?? "");
    case "VITE_GTM_ID":
      return String(import.meta.env.VITE_GTM_ID ?? "");
    case "VITE_GSC_VERIFICATION":
      return String(import.meta.env.VITE_GSC_VERIFICATION ?? "");
    default:
      return "";
  }
}

export { readEnv };

/** يقرأ من VITE_* — يعمل على السيرفر (Vercel runtime) والمتصفح (build time) */
export function readFirebaseConfigFromEnv(): FirebasePublicConfig {
  return {
    apiKey: readEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("VITE_FIREBASE_APP_ID"),
    measurementId: readEnv("VITE_FIREBASE_MEASUREMENT_ID") || undefined,
  };
}

export function isValidFirebaseConfig(config: FirebasePublicConfig): boolean {
  return Boolean(config.apiKey && config.projectId && config.appId);
}
