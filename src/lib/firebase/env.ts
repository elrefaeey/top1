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
  const value = import.meta.env[key];
  return typeof value === "string" ? value : "";
}

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
