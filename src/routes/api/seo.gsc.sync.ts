import { createFileRoute } from "@tanstack/react-router";
import { extractBearerToken } from "@/lib/seo/gsc/auth";
import { resolveGscSyncUserId } from "@/lib/seo/gsc/client";
import { syncGscSearchAnalytics } from "@/lib/seo/gsc/sync";
import { safeEqualString } from "@/lib/server/firebase-admin";
import { verifyFirebaseAdminRole } from "@/lib/security/firebase-auth-server";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 6;

function hasValidAutomationKey(request: Request): boolean {
  const automationKey = (process.env.SEO_AUTOMATION_API_KEY ?? "").trim();
  const providedKey = (request.headers.get("x-seo-automation-key") ?? "").trim();
  return Boolean(automationKey && providedKey && safeEqualString(providedKey, automationKey));
}

export const Route = createFileRoute("/api/seo/gsc/sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(rateLimitKey(request, "seo-gsc-sync"), RATE_MAX);
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, RATE_MAX) },
              ),
            );
          }

          let result;
          if (hasValidAutomationKey(request)) {
            // Weekly Cursor automation: use any linked GSC credential via service account.
            const userId = await resolveGscSyncUserId();
            result = await syncGscSearchAnalytics(userId);
          } else {
            const idToken = extractBearerToken(request);
            const uid = await verifyFirebaseAdminRole(idToken);
            result = await syncGscSearchAnalytics(uid, idToken);
          }

          return applySecurityHeaders(
            Response.json({ ok: true, ...result }, { headers: rateLimitHeaders(rl, RATE_MAX) }),
          );
        } catch (err) {
          console.error("[api/seo/gsc/sync]", err);
          const message = err instanceof Error ? err.message : "";
          if (
            message.includes("غير مصرح") ||
            message.includes("مدير") ||
            message.includes("رمز") ||
            message.includes("صلاحية")
          ) {
            return jsonError(message || "غير مصرح", 401);
          }
          if (message.includes("غير مربوط") || message.includes("refresh_token")) {
            return jsonError(message, 400);
          }
          if (
            message.includes("GOOGLE_CLIENT") ||
            message.includes("FIREBASE_SERVICE_ACCOUNT") ||
            message.includes("Service account")
          ) {
            return jsonError("إعدادات السيرفر غير مكتملة", 503);
          }
          return jsonError(message || "تعذّر مزامنة Search Console", 503);
        }
      },
    },
  },
});
