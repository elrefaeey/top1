import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function readServiceAccount(): Record<string, unknown> {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON غير مُعد على السيرفر — مطلوب لإرسال نماذج التواصل بأمان",
    );
  }
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
      throw new Error("invalid");
    }
    return parsed;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON غير صالح (JSON)");
  }
}

export function getFirebaseAdminApp(): App {
  if (adminApp) return adminApp;
  const existing = getApps()[0];
  if (existing) {
    adminApp = existing;
    return adminApp;
  }
  const sa = readServiceAccount();
  adminApp = initializeApp({
    credential: cert(sa as Parameters<typeof cert>[0]),
  });
  return adminApp;
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;
  adminDb = getFirestore(getFirebaseAdminApp());
  return adminDb;
}
