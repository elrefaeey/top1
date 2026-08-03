import { createFileRoute } from "@tanstack/react-router";
import { extractBearerToken } from "@/lib/seo/gsc/auth";
import { getAnyGscConnectionStatus, getGscConnectionStatus } from "@/lib/seo/gsc/client";
import { safeEqualString } from "@/lib/server/firebase-admin";
import { verifyFirebaseAdminRole } from "@/lib/security/firebase-auth-server";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 60;

function hasValidAutomationKey(request: Request): boolean {
  const automationKey = (process.env.SEO_AUTOMATION_API_KEY ?? "").trim();
  const providedKey = (request.headers.get("x-seo-automation-key") ?? "").trim();
  return Boolean(automationKey && providedKey && safeEqualString(providedKey, automationKey));
}

export const Route = createFileRoute("/api/seo/gsc/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(rateLimitKey(request, "seo-gsc-status"), RATE_MAX);
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, RATE_MAX) },
              ),
            );
          }

          const status = hasValidAutomationKey(request)
            ? await getAnyGscConnectionStatus()
            : await (async () => {
                const idToken = extractBearerToken(request);
                const uid = await verifyFirebaseAdminRole(idToken);
                return getGscConnectionStatus(uid, idToken);
              })();

          console.info(
            `[gsc-oauth:status] mode=${hasValidAutomationKey(request) ? "automation" : "admin"} connected=${status.connected} connected_email_set=${Boolean(status.connectedEmail)}`,
          );

          // Never return refresh tokens
          return applySecurityHeaders(
            Response.json(
              {
                connected: status.connected,
                connectedEmail: status.connectedEmail,
                siteUrl: status.siteUrl,
              },
              { headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
          );
        } catch (err) {
          console.error("[api/seo/gsc/status]", err);
          const message = err instanceof Error ? err.message : "";
          if (
            message.includes("غير مصرح") ||
            message.includes("مدير") ||
            message.includes("رمز") ||
            message.includes("صلاحية")
          ) {
            return jsonError(message || "غير مصرح", 401);
          }
          return jsonError("تعذّر التحقق من حالة الربط", 503);
        }
      },
    },
  },
});
