import { createFileRoute } from "@tanstack/react-router";
import { generateBlogDraftFromInsight } from "@/lib/seo/ai/draft-generator";
import { isDraftApprovedOpportunity } from "@/lib/seo/ai/opportunity-engine";
import { authorizeSeoApiRequest } from "@/lib/seo/automation/auth";
import { appendAiLog, createAiBlogDraft, listSeoInsights } from "@/lib/seo/automation/drafts";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { nowIso } from "@/lib/cms/admin-utils";
import { upsertFirestoreDocument } from "@/lib/server/firebase-admin";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 4;
const DEFAULT_MAX_DRAFTS = 3;
const HARD_MAX_DRAFTS = 5;

export const Route = createFileRoute("/api/seo/generate-drafts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(
            rateLimitKey(request, "seo-generate-drafts"),
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

          let maxDrafts = DEFAULT_MAX_DRAFTS;
          const contentType = request.headers.get("content-type") ?? "";
          if (contentType.includes("application/json")) {
            try {
              const body = (await request.json()) as { maxDrafts?: unknown };
              const n = Number(body.maxDrafts);
              if (Number.isFinite(n)) {
                maxDrafts = Math.min(Math.max(Math.floor(n), 1), HARD_MAX_DRAFTS);
              }
            } catch {
              // empty body is fine
            }
          }

          const insights = await listSeoInsights(100);
          const approved = insights
            .filter((i) => isDraftApprovedOpportunity(i))
            .sort((a, b) => b.estimated_value - a.estimated_value)
            .slice(0, maxDrafts);

          const created: Array<{
            insightId: string;
            id: string;
            slug: string;
            status: "draft";
            provider: string;
            keyword: string;
          }> = [];

          for (const insight of approved) {
            const { input, provider } = await generateBlogDraftFromInsight(insight);
            const draft = await createAiBlogDraft(input);

            await upsertFirestoreDocument(COLLECTIONS.seoInsights, insight.id, {
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
              action: "generate_blog_draft_batch",
              description: `draft ${draft.slug} from insight ${insight.id.slice(0, 8)} via ${provider}`,
              relatedCollection: COLLECTIONS.blogPosts,
              relatedId: draft.id,
            });

            created.push({
              insightId: insight.id,
              id: draft.id,
              slug: draft.slug,
              status: "draft",
              provider,
              keyword: insight.keyword,
            });
          }

          return applySecurityHeaders(
            Response.json(
              {
                ok: true,
                considered: approved.length,
                created: created.length,
                drafts: created,
                note: "مسودات فقط — لا يتم النشر تلقائياً",
              },
              {
                status: created.length > 0 ? 201 : 200,
                headers: rateLimitHeaders(rl, RATE_MAX),
              },
            ),
          );
        } catch (err) {
          console.error("[api/seo/generate-drafts]", err instanceof Error ? err.message : "failed");
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
            message.includes("OPENAI") ||
            message.includes("ANTHROPIC") ||
            message.includes("FIREBASE_SERVICE_ACCOUNT") ||
            message.includes("Service account")
          ) {
            return jsonError("إعدادات السيرفر غير مكتملة", 503);
          }
          return jsonError(message || "تعذّر توليد المسودات", 503);
        }
      },
    },
  },
});
