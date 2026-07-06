import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId,
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (getApps().length) return getApps()[0]!;
  if (!isFirebaseConfigured()) return null;
  return initializeApp(firebaseConfig);
}

export const SITE_URL = import.meta.env.VITE_SITE_URL || "";
