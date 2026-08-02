import { createFileRoute } from "@tanstack/react-router";
import { extractBearerToken } from "@/lib/seo/gsc/auth";
import { syncGscSearchAnalytics } from "@/lib/seo/gsc/sync";
import { verifyFirebaseAdminRole } from "@/lib/security/firebase-auth-server";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 6;

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

          const idToken = extractBearerToken(request);
          const uid = await verifyFirebaseAdminRole(idToken);
          const result = await syncGscSearchAnalytics(uid);

          return applySecurityHeaders(
            Response.json(
              { ok: true, ...result },
              { headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
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
