import { createFileRoute } from "@tanstack/react-router";
import { handleCmsApiGet } from "@/lib/server/cms-api";
import {
  cmsCacheControlHeaders,
  cmsCacheKey,
  getCachedCmsValue,
  setCachedCmsValue,
} from "@/lib/server/cms-cache";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const CMS_RATE_MAX = 120;

export const Route = createFileRoute("/api/cms/$resource")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const rl = await checkRateLimitAsync(
          rateLimitKey(request, `cms:${params.resource}`),
          CMS_RATE_MAX,
        );
        if (!rl.ok) {
          return applySecurityHeaders(
            Response.json(
              { error: "طلبات كثيرة — حاول لاحقاً" },
              { status: 429, headers: rateLimitHeaders(rl, CMS_RATE_MAX) },
            ),
          );
        }

        try {
          const url = new URL(request.url);
          const cacheKey = cmsCacheKey(params.resource, url.searchParams);
          const cached = getCachedCmsValue(cacheKey);

          if (cached !== undefined) {
            return applySecurityHeaders(
              Response.json(cached, {
                headers: {
                  ...cmsCacheControlHeaders(),
                  "x-cms-cache": "HIT",
                  ...rateLimitHeaders(rl, CMS_RATE_MAX),
                },
              }),
            );
          }

          const data = await handleCmsApiGet(params.resource, url.searchParams);
          if (data === null) {
            return jsonError("المورد غير موجود", 404);
          }

          // Don't cache hard failures of health; cache successful payloads only.
          if (params.resource !== "health" || (data as { ok?: boolean }).ok !== false) {
            setCachedCmsValue(cacheKey, data);
          }

          return applySecurityHeaders(
            Response.json(data, {
              headers: {
                ...cmsCacheControlHeaders(),
                "x-cms-cache": "MISS",
                ...rateLimitHeaders(rl, CMS_RATE_MAX),
              },
            }),
          );
        } catch (err) {
          console.error(`[api/cms/${params.resource}]`, err);
          const message = err instanceof Error ? err.message : "";
          if (message.startsWith("Missing ")) {
            return jsonError("طلب غير صالح", 400);
          }
          return jsonError("تعذّر تحميل المحتوى", 503);
        }
      },
    },
  },
});
