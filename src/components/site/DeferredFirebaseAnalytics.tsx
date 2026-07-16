import { useEffect, useState } from "react";

/** Loads Firebase Analytics only after idle — keeps firebase/* out of the critical path. */
export function DeferredFirebaseAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    const boot = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const id = window.requestIdleCallback(boot, { timeout: 5000 });
      cancelIdle = () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(boot, 2500);
      cancelIdle = () => clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, []);

  if (!ready) return null;

  return <LazyFirebaseAnalytics />;
}

function LazyFirebaseAnalytics() {
  const [Comp, setComp] = useState<null | typeof import("./FirebaseAnalytics").FirebaseAnalytics>(
    null,
  );

  useEffect(() => {
    let alive = true;
    void import("./FirebaseAnalytics").then((m) => {
      if (alive) setComp(() => m.FirebaseAnalytics);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!Comp) return null;
  return <Comp />;
}
