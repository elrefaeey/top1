import { createFileRoute } from "@tanstack/react-router";
import { extractBearerToken } from "@/lib/seo/gsc/auth";
import { getGscConnectionStatus } from "@/lib/seo/gsc/client";
import { verifyFirebaseAdminRole } from "@/lib/security/firebase-auth-server";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 60;

export const Route = createFileRoute("/api/seo/gsc/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(
            rateLimitKey(request, "seo-gsc-status"),
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

          const idToken = extractBearerToken(request);
          const uid = await verifyFirebaseAdminRole(idToken);
          const status = await getGscConnectionStatus(uid).catch(() => ({
            connected: false,
            connectedEmail: null as string | null,
            siteUrl: (process.env.GSC_SITE_URL ?? "https://www.top1markting.com/").trim(),
          }));

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
