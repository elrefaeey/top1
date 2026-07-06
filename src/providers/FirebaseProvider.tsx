import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cmsKeys } from "@/hooks/use-cms";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  setFirebaseConfig,
} from "@/lib/firebase/config";
import { isValidFirebaseConfig, type FirebasePublicConfig } from "@/lib/firebase/env";

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
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!isFirebaseConfigured()) {
        const config = await fetchServerFirebaseConfig();
        if (cancelled) return;
        if (config) {
          setFirebaseConfig(config);
        }
      }

      if (isFirebaseConfigured()) {
        getFirebaseApp();
        await queryClient.invalidateQueries({ queryKey: cmsKeys.all });
      }

      if (!cancelled) setReady(true);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [queryClient]);

  return (
    <FirebaseReadyContext.Provider value={ready}>
      {children}
    </FirebaseReadyContext.Provider>
  );
}
