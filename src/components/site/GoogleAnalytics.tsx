import { useEffect } from "react";

/** GA4 property for the public site. Override per-environment with VITE_GA_MEASUREMENT_ID. */
const DEFAULT_MEASUREMENT_ID = "G-KQB0TRPEL2";

function readMeasurementId(): string {
  const fromEnv = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  return DEFAULT_MEASUREMENT_ID;
}

function scheduleIdle(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const timer = globalThis.setTimeout(callback, 2000);
  return () => globalThis.clearTimeout(timer);
}

/**
 * Google Analytics 4 (gtag.js), loaded after idle so it stays off the critical path.
 * SPA navigations are counted by GA4 enhanced measurement (browser history events),
 * so no manual page_view is sent — that would double-count every route change.
 */
export function GoogleAnalytics() {
  const measurementId = readMeasurementId();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined") return;

    return scheduleIdle(() => {
      if (document.getElementById("ga-gtag-script")) return;

      window.dataLayer = window.dataLayer ?? [];
      if (!window.gtag) {
        window.gtag = function gtag() {
          // gtag.js reads the raw `arguments` object — do not convert it to an array.
          // eslint-disable-next-line prefer-rest-params
          window.dataLayer!.push(arguments as unknown as Record<string, unknown>);
        };
        window.gtag("js", new Date());
      }

      const script = document.createElement("script");
      script.id = "ga-gtag-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);

      window.gtag("config", measurementId);
    });
  }, [measurementId]);

  return null;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}
