import { createHash } from "node:crypto";
import { nowIso } from "@/lib/cms/admin-utils";
import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  getGscOAuthConfig,
  refreshGoogleAccessToken,
} from "@/lib/seo/gsc/auth";
import type { GscConnectionStatus, GscCredential, GscSearchRow } from "@/lib/seo/gsc/types";
import {
  getFirestoreDocument,
  getFirestoreDocumentAsUser,
  hasFirebaseServiceAccount,
  upsertFirestoreDocument,
  upsertFirestoreDocumentAsUser,
  type FirestoreDocumentData,
} from "@/lib/server/firebase-admin";

function mapCredentialDoc(
  doc: Record<string, unknown> & { id: string },
  fallbackUserId: string,
): GscCredential | null {
  const refreshToken = String(doc.refreshToken ?? "");
  if (!refreshToken) return null;
  return {
    id: doc.id,
    userId: String(doc.userId ?? fallbackUserId),
    refreshToken,
    connectedEmail: String(doc.connectedEmail ?? ""),
    createdAt: String(doc.createdAt ?? ""),
    updatedAt: String(doc.updatedAt ?? ""),
  };
}

export async function saveGscCredentials(input: {
  userId: string;
  refreshToken: string;
  connectedEmail: string;
  /** Firebase ID token — used when service account is unavailable. */
  firebaseIdToken?: string;
}): Promise<void> {
  if (!input.refreshToken) {
    throw new Error("لم يُرجع Google refresh_token — أعد الربط مع الموافقة");
  }

  const ts = nowIso();
  let createdAt = ts;
  const useSa = hasFirebaseServiceAccount();

  // Prefer user token when present so local OAuth works without service account.
  // Admin REST is used only when SA is configured and no user token was bridged.
  if (input.firebaseIdToken) {
    try {
      const existing = await getFirestoreDocumentAsUser(
        input.firebaseIdToken,
        COLLECTIONS.gscCredentials,
        input.userId,
      );
      if (typeof existing?.createdAt === "string" && existing.createdAt) {
        createdAt = existing.createdAt;
      }
    } catch {
      // first-time create
    }
  } else if (useSa) {
    try {
      const existing = await getFirestoreDocument(COLLECTIONS.gscCredentials, input.userId);
      if (typeof existing?.createdAt === "string" && existing.createdAt) {
        createdAt = existing.createdAt;
      }
    } catch {
      // ignore read errors; still attempt write
    }
  }

  const payload: FirestoreDocumentData = {
    userId: input.userId,
    refreshToken: input.refreshToken,
    connectedEmail: input.connectedEmail,
    createdAt,
    updatedAt: ts,
  };

  if (input.firebaseIdToken) {
    await upsertFirestoreDocumentAsUser(
      input.firebaseIdToken,
      COLLECTIONS.gscCredentials,
      input.userId,
      payload,
    );
    return;
  }

  if (useSa) {
    await upsertFirestoreDocument(COLLECTIONS.gscCredentials, input.userId, payload);
    return;
  }

  throw new Error(
    "تعذّر حفظ بيانات GSC — أعد محاولة الربط من لوحة التحكم (جلسة الربط مفقودة)",
  );
}

export async function getGscCredentials(
  userId: string,
  firebaseIdToken?: string,
): Promise<GscCredential | null> {
  // Prefer the caller's ID token when present (status/sync paths) so local
  // environments without a service account can still read gsc_credentials.
  if (firebaseIdToken) {
    const doc = await getFirestoreDocumentAsUser(
      firebaseIdToken,
      COLLECTIONS.gscCredentials,
      userId,
    );
    return doc ? mapCredentialDoc(doc, userId) : null;
  }

  if (hasFirebaseServiceAccount()) {
    const doc = await getFirestoreDocument(COLLECTIONS.gscCredentials, userId);
    return doc ? mapCredentialDoc(doc, userId) : null;
  }

  return null;
}

export async function getGscConnectionStatus(
  userId: string,
  firebaseIdToken?: string,
): Promise<GscConnectionStatus> {
  const { siteUrl } = getGscOAuthConfig();
  const creds = await getGscCredentials(userId, firebaseIdToken);
  return {
    connected: Boolean(creds?.refreshToken),
    connectedEmail: creds?.connectedEmail || null,
    siteUrl,
  };
}

export async function getAccessTokenForUser(
  userId: string,
  firebaseIdToken?: string,
): Promise<string> {
  const creds = await getGscCredentials(userId, firebaseIdToken);
  if (!creds) throw new Error("Google Search Console غير مربوط — اربط الحساب أولاً");
  const { clientId, clientSecret } = getGscOAuthConfig();
  return refreshGoogleAccessToken({
    refreshToken: creds.refreshToken,
    clientId,
    clientSecret,
  });
}

/** Deterministic snapshot id so re-sync overwrites the same row. */
export function gscSnapshotDocId(row: GscSearchRow & { date: string }): string {
  const key = [row.date, row.query, row.page, row.country, row.device].join("|");
  return createHash("sha256").update(key).digest("hex").slice(0, 32);
}

export async function querySearchAnalytics(input: {
  accessToken: string;
  siteUrl: string;
  startDate: string;
  endDate: string;
  startRow?: number;
  rowLimit?: number;
}): Promise<GscSearchRow[]> {
  const sitePath = encodeURIComponent(input.siteUrl);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${sitePath}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${input.accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      startDate: input.startDate,
      endDate: input.endDate,
      dimensions: ["query", "page", "country", "device"],
      rowLimit: input.rowLimit ?? 1000,
      startRow: input.startRow ?? 0,
      dataState: "final",
    }),
  });

  const data = (await res.json()) as {
    rows?: Array<{
      keys?: string[];
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
    }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(data.error?.message || `فشل جلب Search Console (${res.status})`);
  }

  return (data.rows ?? []).map((row) => {
    const keys = row.keys ?? [];
    return {
      query: keys[0] ?? "",
      page: keys[1] ?? "",
      country: keys[2] ?? "",
      device: keys[3] ?? "",
      clicks: Number(row.clicks ?? 0),
      impressions: Number(row.impressions ?? 0),
      ctr: Number(row.ctr ?? 0),
      position: Number(row.position ?? 0),
    };
  });
}
