import { createFileRoute } from "@tanstack/react-router";
import { hasLlmConfigured } from "@/lib/seo/ai/provider";
import { authorizeSeoApiRequest } from "@/lib/seo/automation/auth";
import { listGscSnapshots, listSeoInsights } from "@/lib/seo/automation/drafts";
import { getAnyGscConnectionStatus } from "@/lib/seo/gsc/client";
import {
  getServiceAccountDiagnostics,
  hasFirebaseServiceAccount,
} from "@/lib/server/firebase-admin";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 30;

/**
 * STEP 1 health check for weekly AI SEO automation.
 * Never returns secrets — booleans and counts only.
 */
export const Route = createFileRoute("/api/seo/health")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(rateLimitKey(request, "seo-health"), RATE_MAX);
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, RATE_MAX) },
              ),
            );
          }

          await authorizeSeoApiRequest(request);

          const sa = getServiceAccountDiagnostics();
          const firestoreReady = hasFirebaseServiceAccount() && sa.parse_ok;
          let gscConnected = false;
          let gscSiteUrl: string | null = null;
          let snapshotCount = 0;
          let insightCount = 0;
          let firestoreReadable = false;

          if (firestoreReady) {
            try {
              const status = await getAnyGscConnectionStatus();
              gscConnected = status.connected;
              gscSiteUrl = status.siteUrl;
              const [snapshots, insights] = await Promise.all([
                listGscSnapshots({ limit: 5 }),
                listSeoInsights(5),
              ]);
              snapshotCount = snapshots.length;
              insightCount = insights.length;
              firestoreReadable = true;
            } catch {
              firestoreReadable = false;
            }
          }

          const seoAi = {
            templateFallback: true,
            llmConfigured: hasLlmConfigured(),
            automationKeyConfigured: Boolean((process.env.SEO_AUTOMATION_API_KEY ?? "").trim()),
            googleOAuthConfigured: Boolean(
              (process.env.GOOGLE_CLIENT_ID ?? "").trim() &&
              (process.env.GOOGLE_CLIENT_SECRET ?? "").trim(),
            ),
          };

          const ok = firestoreReady && firestoreReadable && seoAi.automationKeyConfigured;

          return applySecurityHeaders(
            Response.json(
              {
                ok,
                searchConsole: {
                  connected: gscConnected,
                  siteUrl: gscSiteUrl,
                  snapshotSampleCount: snapshotCount,
                },
                firestore: {
                  serviceAccountConfigured: sa.has_service_account,
                  parseOk: sa.parse_ok,
                  readable: firestoreReadable,
                  insightSampleCount: insightCount,
                },
                seoAi,
              },
              { headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          if (
            message.includes("غير مصرح") ||
            message.includes("صلاحية") ||
            message.includes("رمز") ||
            message.includes("محرر")
          ) {
            return jsonError(message || "غير مصرح", 401);
          }
          return jsonError("تعذّر فحص صحة نظام SEO", 503);
        }
      },
    },
  },
});
