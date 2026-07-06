import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cmsKeys } from "@/hooks/use-cms";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  setFirebaseConfig,
} from "@/lib/firebase/config";
import {
  getBootstrapAdminEmail,
  isValidFirebaseConfig,
  setAppRuntimeConfig,
  type FirebasePublicConfig,
} from "@/lib/firebase/env";

const FirebaseReadyContext = createContext(false);

export function useFirebaseReady() {
  return useContext(FirebaseReadyContext);
}

type ServerFirebasePayload = FirebasePublicConfig & {
  bootstrapAdminEmail?: string;
};

async function fetchServerFirebaseConfig(): Promise<ServerFirebasePayload | null> {
  try {
    const res = await fetch("/api/firebase-config");
    if (!res.ok) return null;
    const config = (await res.json()) as ServerFirebasePayload;
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
      const needsRuntimeConfig = !isFirebaseConfigured() || !getBootstrapAdminEmail();
      if (needsRuntimeConfig) {
        const config = await fetchServerFirebaseConfig();
        if (cancelled) return;
        if (config) {
          if (!isFirebaseConfigured()) {
            setFirebaseConfig(config);
          }
          if (config.bootstrapAdminEmail) {
            setAppRuntimeConfig({ bootstrapAdminEmail: config.bootstrapAdminEmail });
          }
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
