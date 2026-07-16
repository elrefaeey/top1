import { createFileRoute } from "@tanstack/react-router";
import { isValidFirebaseConfig, readFirebaseConfigFromEnv } from "@/lib/firebase/env";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const CONFIG_RATE_MAX = 30;

export const Route = createFileRoute("/api/firebase-config")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const rl = await checkRateLimitAsync(
          rateLimitKey(request, "firebase-config"),
          CONFIG_RATE_MAX,
        );
        if (!rl.ok) {
          return applySecurityHeaders(
            Response.json(
              { error: "طلبات كثيرة — حاول لاحقاً" },
              { status: 429, headers: rateLimitHeaders(rl, CONFIG_RATE_MAX) },
            ),
          );
        }

        const config = readFirebaseConfigFromEnv();
        if (!isValidFirebaseConfig(config)) {
          return jsonError("Firebase غير مُعد على السيرفر", 503);
        }
        return applySecurityHeaders(
          Response.json(config, {
            headers: {
              "cache-control": "public, max-age=300, s-maxage=300",
              ...rateLimitHeaders(rl, CONFIG_RATE_MAX),
            },
          }),
        );
      },
    },
  },
});
