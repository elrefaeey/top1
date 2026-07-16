import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { readFirebaseConfigFromEnv, isValidFirebaseConfig, type FirebasePublicConfig } from "./env";

export { SITE_URL } from "@/lib/site-config";

let overrideConfig: FirebasePublicConfig | null = null;

export function getFirebaseConfig(): FirebasePublicConfig {
  return overrideConfig ?? readFirebaseConfigFromEnv();
}

export function setFirebaseConfig(config: FirebasePublicConfig) {
  overrideConfig = config;
}

export function isFirebaseConfigured(): boolean {
  if (getApps().length > 0) return true;
  return isValidFirebaseConfig(getFirebaseConfig());
}

export function getFirebaseApp(): FirebaseApp | null {
  if (getApps().length) return getApps()[0]!;
  const config = getFirebaseConfig();
  if (!isValidFirebaseConfig(config)) return null;
  return initializeApp(config);
}
