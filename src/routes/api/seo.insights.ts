import { createFileRoute } from "@tanstack/react-router";
import { authorizeSeoApiRequest } from "@/lib/seo/automation/auth";
import { listSeoInsights } from "@/lib/seo/automation/drafts";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const SEO_RATE_MAX = 60;

export const Route = createFileRoute("/api/seo/insights")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(
            rateLimitKey(request, "seo-insights"),
            SEO_RATE_MAX,
          );
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, SEO_RATE_MAX) },
              ),
            );
          }

          await authorizeSeoApiRequest(request);

          const url = new URL(request.url);
          const limitRaw = Number(url.searchParams.get("limit") ?? "50");
          const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;
          const insights = await listSeoInsights(limit);

          return applySecurityHeaders(
            Response.json(
              { insights },
              { headers: rateLimitHeaders(rl, SEO_RATE_MAX) },
            ),
          );
        } catch (err) {
          console.error("[api/seo/insights]", err);
          const message = err instanceof Error ? err.message : "";
          if (message.includes("غير مصرح") || message.includes("صلاحية") || message.includes("رمز")) {
            return jsonError(message || "غير مصرح", 401);
          }
          if (message.includes("FIREBASE_SERVICE_ACCOUNT") || message.includes("Service account")) {
            return jsonError("إعدادات السيرفر غير مكتملة", 503);
          }
          return jsonError("تعذّر تحميل توصيات SEO", 503);
        }
      },
    },
  },
});
