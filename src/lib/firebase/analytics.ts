import type { Analytics } from "firebase/analytics";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  setFirebaseConfig,
} from "./config";
import { isValidFirebaseConfig, type FirebasePublicConfig } from "./env";

type LogEventFn = (
  analytics: Analytics,
  eventName: string,
  eventParams?: Record<string, unknown>,
) => void;

let analytics: Analytics | null = null;
let logEventFn: LogEventFn | null = null;
let initPromise: Promise<Analytics | null> | null = null;

export function isAnalyticsInitialized() {
  return analytics !== null;
}

async function ensurePublicFirebaseConfig(): Promise<void> {
  if (isFirebaseConfigured()) return;
  try {
    const res = await fetch("/api/firebase-config");
    if (!res.ok) return;
    const config = (await res.json()) as FirebasePublicConfig;
    if (isValidFirebaseConfig(config)) {
      setFirebaseConfig(config);
    }
  } catch {
    // Analytics is optional — ignore config fetch failures.
  }
}

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await ensurePublicFirebaseConfig();
    if (!isFirebaseConfigured()) return null;
    const { getAnalytics, isSupported, logEvent } = await import("firebase/analytics");
    const supported = await isSupported();
    if (!supported) return null;
    const app = getFirebaseApp();
    if (!app) return null;
    analytics = getAnalytics(app);
    logEventFn = logEvent as LogEventFn;
    return analytics;
  })();

  return initPromise;
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!analytics || !logEventFn) return;
  logEventFn(analytics, name, params);
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

export function trackWhatsAppClick(source: string) {
  trackEvent("whatsapp_click", { source });
}
