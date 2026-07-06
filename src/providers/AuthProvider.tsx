import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  auth,
  subscribeToAuth,
  toAppUser,
  ensureBootstrapAdminRole,
  type AppUser,
} from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAdmin: false,
  isEditor: false,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }

    const unsub = subscribeToAuth((firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      void toAppUser(firebaseUser)
        .then(setUser)
        .finally(() => setLoading(false));
    });
    return unsub;
  }, []);

  async function refreshUser() {
    if (!isFirebaseConfigured()) {
      setUser(null);
      return;
    }
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    setLoading(true);
    try {
      await ensureBootstrapAdminRole(firebaseUser);
      setUser(await toAppUser(firebaseUser));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        isEditor: user?.role === "admin" || user?.role === "editor",
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
