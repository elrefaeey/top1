import { createHash } from "node:crypto";
import { nowIso } from "@/lib/cms/admin-utils";
import { COLLECTIONS } from "@/lib/firebase/collections";
import type { OpportunityType, SeoOpportunityDraft } from "@/lib/seo/ai/types";
import { appendAiLog } from "@/lib/seo/automation/drafts";
import { upsertFirestoreDocument, type FirestoreDocumentData } from "@/lib/server/firebase-admin";
import type { GscSnapshot, SeoInsightPriority } from "@/types/seo-automation";

function insightId(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 28);
}

function pagePath(page: string): string {
  try {
    return new URL(page).pathname || page;
  } catch {
    return page.startsWith("/") ? page : `/${page}`;
  }
}

function isThinOrGenericPage(page: string): boolean {
  const path = pagePath(page).replace(/\/+$/, "") || "/";
  return path === "/" || path === "/blog" || path === "/services" || path.length < 3;
}

function priorityFor(row: GscSnapshot, type: OpportunityType): SeoInsightPriority {
  if (type === "quick_win") {
    if (row.impressions >= 100 && row.ctr < 0.01) return "high";
    if (row.impressions >= 30) return "medium";
    return "low";
  }
  if (type === "content_opportunity") {
    if (row.impressions >= 40) return "high";
    if (row.impressions >= 15) return "medium";
    return "low";
  }
  if (row.impressions >= 80 && row.position <= 15) return "high";
  if (row.impressions >= 25) return "medium";
  return "low";
}

function estimatedValue(row: GscSnapshot, type: OpportunityType): number {
  const ctrGap = Math.max(0.02 - row.ctr, 0);
  const posBoost = row.position > 20 ? 1.4 : row.position > 10 ? 1.2 : 1;
  const typeBoost = type === "quick_win" ? 1.3 : type === "content_opportunity" ? 1.1 : 1;
  return Math.round(row.impressions * (1 + ctrGap * 40) * posBoost * typeBoost);
}

function suggestedTitleFor(keyword: string, type: OpportunityType): string {
  const k = keyword.trim();
  if (type === "content_opportunity") {
    if (/seo|تحسين محركات/i.test(k)) {
      return `أفضل شركة SEO في السعودية: كيف تختار وكالة تحسين محركات البحث`;
    }
    if (/تصميم|مواقع|موقع/i.test(k)) {
      return `أفضل شركة تصميم مواقع في الرياض — دليل اختيار الوكالة المناسبة`;
    }
    return `${k}: دليل عملي للشركات في السعودية`;
  }
  if (type === "page_improvement") {
    return `تحسين صفحة: ${k.slice(0, 60)}`;
  }
  return `كيف تحسّن ظهور «${k.slice(0, 50)}» في نتائج Google`;
}

function suggestedOutline(keyword: string, page: string, type: OpportunityType): string {
  const path = pagePath(page);
  if (type === "quick_win") {
    return [
      `تحسين Title و Meta Description حول: ${keyword}`,
      "إضافة كلمات سعودية ورياض عند الصلة",
      "قسم FAQ مع Schema",
      `روابط داخلية من/إلى ${path}`,
      "تقوية H1 ومقدمة الصفحة",
    ].join(" · ");
  }
  if (type === "content_opportunity") {
    return [
      "H1 + مقدمة تستهدف نية البحث",
      "أقسام H2/H3 عملية",
      "FAQ عربي",
      "CTA لـ TOP1MARKTING",
      "روابط: /seo-services · /web-design-riyadh · /contact",
    ].join(" · ");
  }
  return [
    "تحديث meta title / description",
    "تحسين H1",
    "توسيع المحتوى",
    "إضافة FAQ",
    "روابط داخلية للخدمات ذات الصلة",
  ].join(" · ");
}

function buildQuickWin(row: GscSnapshot, ts: string): SeoOpportunityDraft {
  const type: OpportunityType = "quick_win";
  const issue = "الصفحة تظهر في Google لكن الترتيب أو CTR ضعيفان.";
  const opportunity = "فرصة سريعة لتحسين الظهور والنقرات دون بناء صفحة جديدة بالكامل.";
  const recommended_action = [
    "تحسين وسم العنوان (Title)",
    "إضافة كلمات مفتاحية سعودية",
    "إضافة قسم أسئلة شائعة + Schema",
    "تعزيز الروابط الداخلية",
  ].join(" · ");
  const title = `فرصة سريعة: ${row.query.slice(0, 70)}`;
  const suggested_title = suggestedTitleFor(row.query, type);
  return {
    id: insightId(["quick_win", row.query, row.page, row.date || ""]),
    type,
    title,
    description: `ظهور ${Math.round(row.impressions)} · نقرات ${Math.round(row.clicks)} · ترتيب ${row.position.toFixed(1)} · CTR ${(row.ctr * 100).toFixed(1)}%`,
    keyword: row.query,
    page: row.page,
    targetPage: row.page,
    issue,
    opportunity,
    priority: priorityFor(row, type),
    recommended_action,
    recommendation: recommended_action,
    suggested_title,
    suggested_content: suggestedOutline(row.query, row.page, type),
    estimated_value: estimatedValue(row, type),
    currentPosition: Number(row.position.toFixed(2)),
    impressions: Math.round(row.impressions),
    clicks: Math.round(row.clicks),
    ctr: Number(row.ctr.toFixed(4)),
    status: "pending",
    createdAt: ts,
    updatedAt: ts,
  };
}

function buildContentOpportunity(row: GscSnapshot, ts: string): SeoOpportunityDraft {
  const type: OpportunityType = "content_opportunity";
  const issue = "هناك طلب بحث واضح مع تغطية محتوى ضعيفة أو عامة على الموقع.";
  const opportunity = "مقال مسودة جديد يمكنه استهداف الاستعلام وجلب زيارات مؤهلة.";
  const recommended_action =
    "إنشاء مسودة مقال SEO عربي (مسودة فقط) مع استهداف السوق السعودي وروابط داخلية.";
  const suggested_title = suggestedTitleFor(row.query, type);
  return {
    id: insightId(["content", row.query, row.page, row.date || ""]),
    type,
    title: `فرصة محتوى: ${row.query.slice(0, 70)}`,
    description: `استعلام بظهور ${Math.round(row.impressions)} دون تغطية محتوى كافية.`,
    keyword: row.query,
    page: row.page,
    targetPage: row.page,
    issue,
    opportunity,
    priority: priorityFor(row, type),
    recommended_action,
    recommendation: recommended_action,
    suggested_title,
    suggested_content: suggestedOutline(row.query, row.page, type),
    estimated_value: estimatedValue(row, type),
    currentPosition: Number(row.position.toFixed(2)),
    impressions: Math.round(row.impressions),
    clicks: Math.round(row.clicks),
    ctr: Number(row.ctr.toFixed(4)),
    status: "pending",
    createdAt: ts,
    updatedAt: ts,
  };
}

function buildPageImprovement(row: GscSnapshot, ts: string): SeoOpportunityDraft {
  const type: OpportunityType = "page_improvement";
  const issue = "الصفحة موجودة وتظهر، وتحتاج تحسين on-page لرفع الترتيب وCTR.";
  const opportunity = "تحسين الصفحة الحالية (عنوان، وصف، H1، محتوى، FAQ).";
  const recommended_action = [
    "تحديث Meta Title",
    "تحديث Meta Description",
    "تحسين H1",
    "توسيع المحتوى",
    "إضافة FAQ",
  ].join(" · ");
  return {
    id: insightId(["page", row.query, row.page, row.date || ""]),
    type,
    title: `تحسين صفحة: ${row.query.slice(0, 70)}`,
    description: `الصفحة ${pagePath(row.page)} بترتيب ${row.position.toFixed(1)} وظهور ${Math.round(row.impressions)}.`,
    keyword: row.query,
    page: row.page,
    targetPage: row.page,
    issue,
    opportunity,
    priority: priorityFor(row, type),
    recommended_action,
    recommendation: recommended_action,
    suggested_title: suggestedTitleFor(row.query, type),
    suggested_content: suggestedOutline(row.query, row.page, type),
    estimated_value: estimatedValue(row, type),
    currentPosition: Number(row.position.toFixed(2)),
    impressions: Math.round(row.impressions),
    clicks: Math.round(row.clicks),
    ctr: Number(row.ctr.toFixed(4)),
    status: "pending",
    createdAt: ts,
    updatedAt: ts,
  };
}

/**
 * Analyze GSC snapshot rows into seo_insights opportunities.
 * Rule-based (no LLM required). Never publishes content.
 */
export function analyzeGscSnapshotsForOpportunities(
  rows: GscSnapshot[],
  options?: { maxPerType?: number },
): SeoOpportunityDraft[] {
  const maxPerType = options?.maxPerType ?? 15;
  const ts = nowIso();
  const quickWins: SeoOpportunityDraft[] = [];
  const contentOps: SeoOpportunityDraft[] = [];
  const pageImps: SeoOpportunityDraft[] = [];

  const sorted = [...rows].sort((a, b) => b.impressions - a.impressions);

  for (const row of sorted) {
    if (!row.query?.trim() || !row.page?.trim()) continue;

    const lowCtr = row.ctr <= 0.02;
    const midLowPos = row.position >= 10 && row.position <= 100;

    if (row.impressions > 10 && lowCtr && midLowPos && quickWins.length < maxPerType) {
      quickWins.push(buildQuickWin(row, ts));
      continue;
    }

    if (
      row.impressions >= 8 &&
      (row.position > 20 || isThinOrGenericPage(row.page)) &&
      contentOps.length < maxPerType
    ) {
      contentOps.push(buildContentOpportunity(row, ts));
      continue;
    }

    if (
      row.impressions >= 10 &&
      row.position >= 4 &&
      row.position < 20 &&
      !isThinOrGenericPage(row.page) &&
      pageImps.length < maxPerType
    ) {
      pageImps.push(buildPageImprovement(row, ts));
    }
  }

  return [...quickWins, ...contentOps, ...pageImps].sort(
    (a, b) => b.estimated_value - a.estimated_value,
  );
}

function toFirestorePayload(op: SeoOpportunityDraft): FirestoreDocumentData {
  return {
    type: op.type,
    title: op.title,
    description: op.description,
    keyword: op.keyword,
    page: op.page,
    targetPage: op.targetPage,
    issue: op.issue,
    opportunity: op.opportunity,
    priority: op.priority,
    recommended_action: op.recommended_action,
    recommendation: op.recommendation,
    suggested_title: op.suggested_title,
    suggested_content: op.suggested_content,
    estimated_value: op.estimated_value,
    currentPosition: op.currentPosition,
    impressions: op.impressions,
    clicks: op.clicks,
    ctr: op.ctr,
    status: op.status,
    createdAt: op.createdAt,
    updatedAt: op.updatedAt,
  };
}

export async function persistSeoOpportunities(
  opportunities: SeoOpportunityDraft[],
): Promise<number> {
  let written = 0;
  for (const op of opportunities) {
    await upsertFirestoreDocument(COLLECTIONS.seoInsights, op.id, toFirestorePayload(op));
    written += 1;
  }

  if (written > 0) {
    await appendAiLog({
      action: "generate_seo_insight",
      description: `created ${written} opportunities from GSC analysis`,
      relatedCollection: COLLECTIONS.seoInsights,
    });
  }

  return written;
}

export async function runOpportunityEngineFromSnapshots(
  rows: GscSnapshot[],
): Promise<{ opportunities: number }> {
  const opportunities = analyzeGscSnapshotsForOpportunities(rows);
  const written = await persistSeoOpportunities(opportunities);
  return { opportunities: written };
}
