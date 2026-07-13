import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  initAnalytics,
  isAnalyticsInitialized,
  trackPageView,
} from "@/lib/firebase/analytics";

function scheduleIdle(callback: () => void): () => void {
  if (typeof globalThis === "undefined") return () => {};
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const timer = globalThis.setTimeout(callback, 2000);
  return () => globalThis.clearTimeout(timer);
}

export function FirebaseAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let cancelled = false;

    const track = () => {
      void initAnalytics().then(() => {
        if (!cancelled) trackPageView(pathname);
      });
    };

    // Cold start: defer Firebase Analytics SDK off the critical path.
    // Subsequent SPA navigations track immediately once the SDK is warm.
    if (isAnalyticsInitialized()) {
      track();
      return () => {
        cancelled = true;
      };
    }

    const cancelIdle = scheduleIdle(track);
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [pathname]);

  return null;
}
