import {
  getAuth as getFirebaseAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp, isFirebaseConfigured } from "./config";

export type UserRole = "admin" | "editor";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole | null;
}

let authInstance: Auth | null = null;

function getAuthInstance(): Auth {
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase is not configured");
  if (!authInstance) authInstance = getFirebaseAuth(app);
  return authInstance;
}

export const auth = new Proxy({} as Auth, {
  get(_target, prop) {
    if (!isFirebaseConfigured()) {
      if (prop === "currentUser") return null;
      if (prop === "app") return null;
      if (prop === "name") return "[DEFAULT]";
      if (prop === "onAuthStateChanged") {
        return (callback: (user: User | null) => void) => {
          callback(null);
          return () => {};
        };
      }
      return () => Promise.reject(new Error("Firebase is not configured"));
    }
    const instance = getAuthInstance();
    const value = Reflect.get(instance as object, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

const BOOTSTRAP_ADMIN_EMAIL = (
  import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAIL as string | undefined
)?.toLowerCase().trim();

export function isBootstrapAdminEmail(email: string | null | undefined): boolean {
  if (!BOOTSTRAP_ADMIN_EMAIL || !email) return false;
  return email.toLowerCase().trim() === BOOTSTRAP_ADMIN_EMAIL;
}

export async function ensureBootstrapAdminRole(user: User): Promise<UserRole | null> {
  const existing = await getUserRole(user.uid);
  if (existing) return existing;

  try {
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
    const { db, withFirestoreTimeout } = await import("./firestore");
    const role: UserRole = isBootstrapAdminEmail(user.email) ? "admin" : "editor";
    await withFirestoreTimeout(
      setDoc(doc(db, "users", user.uid), {
        role,
        email: user.email,
        createdAt: serverTimestamp(),
      }),
      8000,
    );
    return role;
  } catch (err) {
    console.error("[auth] bootstrap role failed:", err);
    if (import.meta.env.DEV) {
      return isBootstrapAdminEmail(user.email) ? "admin" : "editor";
    }
    return null;
  }
}

export async function loginWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase غير مُعد — أضف متغيرات VITE_FIREBASE_* في Vercel ثم أعد النشر");
  }
  const credential = await signInWithEmailAndPassword(getAuthInstance(), email, password);
  await ensureBootstrapAdminRole(credential.user);
  return credential;
}

export async function logout() {
  if (!isFirebaseConfigured()) return;
  return signOut(getAuthInstance());
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured()) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(getAuthInstance(), callback);
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const { db, withFirestoreTimeout } = await import("./firestore");
    const snap = await withFirestoreTimeout(getDoc(doc(db, "users", uid)), 5000);
    if (snap.exists()) {
      const role = snap.data().role as UserRole | undefined;
      if (role === "admin" || role === "editor") return role;
    }
  } catch {
  }
  return null;
}

export async function toAppUser(user: User): Promise<AppUser> {
  let role = await getUserRole(user.uid);
  if (!role) {
    role = await ensureBootstrapAdminRole(user);
  }
  if (!role && import.meta.env.DEV) {
    role = isBootstrapAdminEmail(user.email) ? "admin" : "editor";
  }
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role,
  };
}
