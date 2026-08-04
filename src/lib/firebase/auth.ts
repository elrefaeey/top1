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

export async function loginWithEmail(email: string, password: string) {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase غير مُعد — أضف متغيرات VITE_FIREBASE_* في بيئة الإنتاج ثم أعد البناء والنشر",
    );
  }
  return signInWithEmailAndPassword(getAuthInstance(), email, password);
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

function parseRole(value: unknown): UserRole | null {
  return value === "admin" || value === "editor" ? value : null;
}

/** Fallback when the Firestore WebChannel SDK stalls or fails. */
async function getUserRoleViaRest(uid: string): Promise<UserRole | null> {
  try {
    const user = getAuthInstance().currentUser;
    if (!user || user.uid !== uid) return null;
    const token = await user.getIdToken();
    const { getFirebaseConfig } = await import("./config");
    const projectId = getFirebaseConfig().projectId;
    if (!projectId) return null;
    const url =
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
      `/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    const json = (await res.json()) as { fields?: { role?: { stringValue?: string } } };
    return parseRole(json.fields?.role?.stringValue);
  } catch {
    return null;
  }
}

export async function getUserRole(uid: string): Promise<UserRole | null> {
  try {
    const { doc, getDoc } = await import("firebase/firestore");
    const { getDb, withFirestoreTimeout } = await import("./firestore");
    const snap = await withFirestoreTimeout(getDoc(doc(getDb(), "users", uid)), 8000);
    if (snap.exists()) {
      const role = parseRole(snap.data().role);
      if (role) return role;
    }
  } catch {
    // Fall through to REST — common when WebChannel/long-polling times out.
  }
  return getUserRoleViaRest(uid);
}

export async function toAppUser(user: User): Promise<AppUser> {
  const role = await getUserRole(user.uid);
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role,
  };
}
