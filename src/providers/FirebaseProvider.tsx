import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getFirebaseApp, isFirebaseConfigured, setFirebaseConfig } from "@/lib/firebase/config";
import { isValidFirebaseConfig, type FirebasePublicConfig } from "@/lib/firebase/env";

/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */

const FirebaseReadyContext = createContext(false);

export function useFirebaseReady() {
  return useContext(FirebaseReadyContext);
}

async function fetchServerFirebaseConfig(): Promise<FirebasePublicConfig | null> {
  try {
    const res = await fetch("/api/firebase-config");
    if (!res.ok) return null;
    const config = (await res.json()) as FirebasePublicConfig;
    return isValidFirebaseConfig(config) ? config : null;
  } catch {
    return null;
  }
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (typeof window !== "undefined") {
        const config = await fetchServerFirebaseConfig();
        if (cancelled) return;
        if (config && !isFirebaseConfigured()) {
          setFirebaseConfig(config);
        }
      }

      if (isFirebaseConfigured()) {
        getFirebaseApp();
      }

      if (!cancelled) setReady(true);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  return <FirebaseReadyContext.Provider value={ready}>{children}</FirebaseReadyContext.Provider>;
}
