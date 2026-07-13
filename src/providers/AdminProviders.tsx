import type { ReactNode } from "react";
import { AuthProvider } from "@/providers/AuthProvider";
import { FirebaseProvider } from "@/providers/FirebaseProvider";

/** Firebase Auth + app init — mount only under /admin. */
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider>
      <AuthProvider>{children}</AuthProvider>
    </FirebaseProvider>
  );
}
