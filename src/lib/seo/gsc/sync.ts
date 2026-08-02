import { nowIso } from "@/lib/cms/admin-utils";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { runOpportunityEngineFromSnapshots } from "@/lib/seo/ai/opportunity-engine";
import {
  getAccessTokenForUser,
  gscSnapshotDocId,
  querySearchAnalytics,
} from "@/lib/seo/gsc/client";
import { getGscOAuthConfig } from "@/lib/seo/gsc/auth";
import type { GscSearchRow, GscSyncResult } from "@/lib/seo/gsc/types";
import { appendAiLog } from "@/lib/seo/automation/drafts";
import { upsertFirestoreDocument } from "@/lib/server/firebase-admin";
import type { GscSnapshot } from "@/types/seo-automation";

function formatDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function last28DayRange(): { startDate: string; endDate: string } {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { startDate: formatDateUTC(start), endDate: formatDateUTC(end) };
}

function rowsToSnapshots(rows: GscSearchRow[], date: string): GscSnapshot[] {
  return rows.map((row, index) => ({
    id: gscSnapshotDocId({ ...row, date }) || `row-${index}`,
    query: row.query,
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
    date,
    country: row.country,
    device: row.device,
  }));
}

/**
 * Opportunity engine from GSC rows → seo_insights (quick wins / content / page improvements).
 * Never publishes blog posts.
 */
export async function prepareInsightsFromSnapshots(
  rows: GscSearchRow[],
  periodEnd: string,
): Promise<number> {
  const snapshots = rowsToSnapshots(rows, periodEnd);
  const { opportunities } = await runOpportunityEngineFromSnapshots(snapshots);
  return opportunities;
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
