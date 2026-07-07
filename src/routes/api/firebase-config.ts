import { createFileRoute } from "@tanstack/react-router";
import {
  isValidFirebaseConfig,
  readFirebaseConfigFromEnv,
} from "@/lib/firebase/env";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimit, rateLimitKey } from "@/lib/security/rate-limit";

export const Route = createFileRoute("/api/firebase-config")({
  server: {
    handlers: {
      GET: ({ request }) => {
        if (!checkRateLimit(rateLimitKey(request, "firebase-config"), 30)) {
          return jsonError("طلبات كثيرة — حاول لاحقاً", 429);
        }
        const config = readFirebaseConfigFromEnv();
        if (!isValidFirebaseConfig(config)) {
          return jsonError("Firebase غير مُعد على السيرفر", 503);
        }
        return applySecurityHeaders(
          Response.json(config, {
            headers: { "cache-control": "public, max-age=300" },
          }),
        );
      },
    },
  },
});
