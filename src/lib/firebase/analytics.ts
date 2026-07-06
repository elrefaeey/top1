import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getFirebaseApp } from "./config";

let analytics: Analytics | null = null;

export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (analytics) return analytics;
  const supported = await isSupported();
  if (!supported) return null;
  analytics = getAnalytics(getFirebaseApp());
  return analytics;
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!analytics) return;
  logEvent(analytics, name, params);
}

export function trackPageView(path: string) {
  trackEvent("page_view", { page_path: path });
}

export function trackWhatsAppClick(source: string) {
  trackEvent("whatsapp_click", { source });
}
