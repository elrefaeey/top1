import { createFileRoute } from "@tanstack/react-router";
import { generateBlogDraftFromInsight } from "@/lib/seo/ai/draft-generator";
import { authorizeSeoApiRequest } from "@/lib/seo/automation/auth";
import { appendAiLog, createAiBlogDraft } from "@/lib/seo/automation/drafts";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { nowIso } from "@/lib/cms/admin-utils";
import { getFirestoreDocument, upsertFirestoreDocument } from "@/lib/server/firebase-admin";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";
import type { SeoInsight } from "@/types/seo-automation";

const RATE_MAX = 8;

function mapInsightDoc(
  doc: Record<string, unknown> & { id: string },
): SeoInsight {
  const str = (k: string) => (typeof doc[k] === "string" ? (doc[k] as string) : "");
  const num = (k: string) => {
    const n = typeof doc[k] === "number" ? (doc[k] as number) : Number(doc[k]);
    return Number.isFinite(n) ? n : 0;
  };
  return {
    id: doc.id,
    type: str("type"),
    title: str("title"),
    description: str("description"),
    keyword: str("keyword"),
    page: str("page") || str("targetPage"),
    targetPage: str("targetPage") || str("page"),
    issue: str("issue"),
    opportunity: str("opportunity"),
    recommended_action: str("recommended_action") || str("recommendation"),
    suggested_title: str("suggested_title"),
    suggested_content: str("suggested_content"),
    estimated_value: num("estimated_value"),
    currentPosition: num("currentPosition"),
    impressions: num("impressions"),
    clicks: num("clicks"),
    ctr: num("ctr"),
    priority: (str("priority") as SeoInsight["priority"]) || "medium",
    status: (str("status") as SeoInsight["status"]) || "pending",
    recommendation: str("recommendation") || str("recommended_action"),
    createdAt: str("createdAt"),
    updatedAt: str("updatedAt"),
  };
}

export const Route = createFileRoute("/api/seo/generate-draft")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(
            rateLimitKey(request, "seo-generate-draft"),
            RATE_MAX,
          );
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, RATE_MAX) },
              ),
            );
          }

          await authorizeSeoApiRequest(request);

          const contentType = request.headers.get("content-type") ?? "";
          if (!contentType.includes("application/json")) {
            return jsonError("طلب غير صالح", 415);
          }

          let body: Record<string, unknown>;
          try {
            body = (await request.json()) as Record<string, unknown>;
          } catch {
            return jsonError("طلب فارغ أو غير صالح", 400);
          }

          const insightId = String(body.insightId ?? "").trim();
          if (!insightId) return jsonError("insightId مطلوب", 400);

          const doc = await getFirestoreDocument(COLLECTIONS.seoInsights, insightId);
          if (!doc) return jsonError("الفرصة غير موجودة", 404);

          const insight = mapInsightDoc(doc);
          if (!insight.keyword) return jsonError("الفرصة بلا كلمة مفتاحية", 400);

          const { input, provider } = await generateBlogDraftFromInsight(insight);
          const draft = await createAiBlogDraft(input);

          // Mark insight reviewed — never publish the blog post.
          await upsertFirestoreDocument(COLLECTIONS.seoInsights, insightId, {
            status: "reviewed",
            updatedAt: nowIso(),
            type: insight.type,
            title: insight.title,
            description: insight.description,
            keyword: insight.keyword,
            page: insight.page,
            targetPage: insight.targetPage,
            issue: insight.issue,
            opportunity: insight.opportunity,
            priority: insight.priority,
            recommended_action: insight.recommended_action,
            recommendation: insight.recommendation,
            suggested_title: insight.suggested_title || draft.slug,
            suggested_content: insight.suggested_content,
            estimated_value: insight.estimated_value,
            currentPosition: insight.currentPosition,
            impressions: insight.impressions,
            clicks: insight.clicks,
            ctr: insight.ctr,
            createdAt: insight.createdAt || nowIso(),
          });

          await appendAiLog({
            action: "generate_blog_draft",
            description: `draft ${draft.slug} from insight ${insightId.slice(0, 8)} via ${provider} (keyword_set=${Boolean(insight.keyword)})`,
            relatedCollection: COLLECTIONS.blogPosts,
            relatedId: draft.id,
          });

          return applySecurityHeaders(
            Response.json(
              {
                ok: true,
                ...draft,
                status: "draft" as const,
                provider,
                insightId,
              },
              { status: 201, headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
          );
        } catch (err) {
          console.error("[api/seo/generate-draft]", err instanceof Error ? err.message : "failed");
          const message = err instanceof Error ? err.message : "";
          if (
            message.includes("غير مصرح") ||
            message.includes("صلاحية") ||
            message.includes("رمز") ||
            message.includes("محرر")
          ) {
            return jsonError(message || "غير مصرح", 401);
          }
          if (
            message.includes("مطلوب") ||
            message.includes("draft") ||
            message.includes("Base64") ||
            message.includes("مسودات") ||
            message.includes("غير موجودة")
          ) {
            return jsonError(message || "طلب غير صالح", 400);
          }
          if (
            message.includes("OPENAI") ||
            message.includes("ANTHROPIC") ||
            message.includes("FIREBASE_SERVICE_ACCOUNT") ||
            message.includes("Service account")
          ) {
            return jsonError("إعدادات السيرفر غير مكتملة", 503);
          }
          return jsonError(message || "تعذّر توليد المسودة", 503);
        }
      },
    },
  },
});
