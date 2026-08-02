import { nowIso } from "@/lib/cms/admin-utils";
import { COLLECTIONS } from "@/lib/firebase/collections";
import {
  getAccessTokenForUser,
  gscSnapshotDocId,
  querySearchAnalytics,
} from "@/lib/seo/gsc/client";
import { getGscOAuthConfig } from "@/lib/seo/gsc/auth";
import type { GscSearchRow, GscSyncResult } from "@/lib/seo/gsc/types";
import { appendAiLog } from "@/lib/seo/automation/drafts";
import { upsertFirestoreDocument } from "@/lib/server/firebase-admin";

function formatDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function last28DayRange(): { startDate: string; endDate: string } {
  const end = new Date();
  // GSC data often lags ~2 days; end at yesterday UTC
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: formatDateUTC(start), endDate: formatDateUTC(end) };
}

/**
 * Rule-based insight prep (no LLM) — high impressions + weak CTR/position → pending seo_insights.
 * Keeps status pending for human / future AI review. Never publishes blog posts.
 */
export async function prepareInsightsFromSnapshots(
  rows: GscSearchRow[],
  periodEnd: string,
): Promise<number> {
  const candidates = rows
    .filter((r) => r.impressions >= 50 && (r.ctr < 0.03 || r.position > 10))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25);

  const ts = nowIso();
  let written = 0;

  for (const row of candidates) {
    const id = gscSnapshotDocId({ ...row, date: `insight-${periodEnd}` }).slice(0, 28);
    const priority =
      row.impressions >= 500 && row.ctr < 0.02
        ? "high"
        : row.impressions >= 150
          ? "medium"
          : "low";

    await upsertFirestoreDocument(COLLECTIONS.seoInsights, id, {
      type: "gsc_opportunity",
      title: `تحسين الظهور لـ: ${row.query.slice(0, 80)}`,
      description: `استعلام بإظهار ${Math.round(row.impressions)} ونقرات ${Math.round(row.clicks)} ومتوسط ترتيب ${row.position.toFixed(1)}.`,
      keyword: row.query,
      targetPage: row.page,
      currentPosition: Number(row.position.toFixed(2)),
      impressions: Math.round(row.impressions),
      clicks: Math.round(row.clicks),
      ctr: Number(row.ctr.toFixed(4)),
      priority,
      status: "pending",
      recommendation:
        row.ctr < 0.03
          ? "CTR منخفض — حسّن العنوان والوصف التعريفي، أو أنشئ مسودة مقال تستهدف الاستعلام."
          : "ترتيب خارج الصفحة الأولى — عزّز المحتوى والروابط الداخلية نحو الصفحة المستهدفة.",
      createdAt: ts,
      updatedAt: ts,
    });
    written += 1;
  }

  return written;
}

export async function syncGscSearchAnalytics(
  userId: string,
  firebaseIdToken?: string,
): Promise<GscSyncResult> {
  const { siteUrl } = getGscOAuthConfig();
  const accessToken = await getAccessTokenForUser(userId, firebaseIdToken);
  const { startDate, endDate } = last28DayRange();

  const allRows: GscSearchRow[] = [];
  const pageSize = 1000;
  const maxRows = 5000;

  for (let startRow = 0; startRow < maxRows; startRow += pageSize) {
    const batch = await querySearchAnalytics({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      startRow,
      rowLimit: pageSize,
    });
    allRows.push(...batch);
    if (batch.length < pageSize) break;
  }

  for (const row of allRows) {
    const id = gscSnapshotDocId({ ...row, date: endDate });
    await upsertFirestoreDocument(COLLECTIONS.gscSnapshots, id, {
      query: row.query,
      page: row.page,
      country: row.country,
      device: row.device,
      clicks: Number(row.clicks.toFixed(2)),
      impressions: Number(row.impressions.toFixed(2)),
      ctr: Number(row.ctr.toFixed(6)),
      position: Number(row.position.toFixed(2)),
      date: endDate,
      periodStart: startDate,
      periodEnd: endDate,
      syncedAt: nowIso(),
    });
  }

  const insightsPrepared = await prepareInsightsFromSnapshots(allRows, endDate);

  await appendAiLog({
    action: "gsc_sync",
    description: `Synced ${allRows.length} GSC rows (${startDate}→${endDate}); prepared ${insightsPrepared} insights`,
    relatedCollection: COLLECTIONS.gscSnapshots,
  });

  return {
    syncedRows: allRows.length,
    insightsPrepared,
    periodStart: startDate,
    periodEnd: endDate,
    siteUrl,
  };
}
