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
  upsertFirestoreDocument,
} from "@/lib/server/firebase-admin";

export async function saveGscCredentials(input: {
  userId: string;
  refreshToken: string;
  connectedEmail: string;
}): Promise<void> {
  const existing = await getFirestoreDocument(COLLECTIONS.gscCredentials, input.userId);
  const ts = nowIso();
  await upsertFirestoreDocument(COLLECTIONS.gscCredentials, input.userId, {
    userId: input.userId,
    refreshToken: input.refreshToken,
    connectedEmail: input.connectedEmail,
    createdAt: typeof existing?.createdAt === "string" ? existing.createdAt : ts,
    updatedAt: ts,
  });
}

export async function getGscCredentials(userId: string): Promise<GscCredential | null> {
  const doc = await getFirestoreDocument(COLLECTIONS.gscCredentials, userId);
  if (!doc) return null;
  const refreshToken = String(doc.refreshToken ?? "");
  if (!refreshToken) return null;
  return {
    id: doc.id,
    userId: String(doc.userId ?? userId),
    refreshToken,
    connectedEmail: String(doc.connectedEmail ?? ""),
    createdAt: String(doc.createdAt ?? ""),
    updatedAt: String(doc.updatedAt ?? ""),
  };
}

export async function getGscConnectionStatus(userId: string): Promise<GscConnectionStatus> {
  const { siteUrl } = getGscOAuthConfig();
  const creds = await getGscCredentials(userId);
  return {
    connected: Boolean(creds?.refreshToken),
    connectedEmail: creds?.connectedEmail || null,
    siteUrl,
  };
}

export async function getAccessTokenForUser(userId: string): Promise<string> {
  const creds = await getGscCredentials(userId);
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
