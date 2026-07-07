import { createFileRoute } from "@tanstack/react-router";
import { handleCmsApiGet } from "@/lib/server/cms-api";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimit, rateLimitKey } from "@/lib/security/rate-limit";

export const Route = createFileRoute("/api/cms/$resource")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        if (!checkRateLimit(rateLimitKey(request, `cms:${params.resource}`), 120)) {
          return jsonError("طلبات كثيرة — حاول لاحقاً", 429);
        }
        try {
          const url = new URL(request.url);
          const data = await handleCmsApiGet(params.resource, url.searchParams);
          if (data === null) {
            return jsonError("المورد غير موجود", 404);
          }
          return applySecurityHeaders(
            Response.json(data, {
              headers: { "cache-control": "public, max-age=60" },
            }),
          );
        } catch (err) {
          console.error(`[api/cms/${params.resource}]`, err);
          return jsonError("تعذّر تحميل المحتوى", 503);
        }
      },
    },
  },
});
