import { createFileRoute } from "@tanstack/react-router";
import { handleImageUploadRequest } from "@/lib/server/image-upload";
import { applySecurityHeaders } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const UPLOAD_RATE_MAX = 20;

export const Route = createFileRoute("/api/upload-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rl = await checkRateLimitAsync(rateLimitKey(request, "upload"), UPLOAD_RATE_MAX);
        if (!rl.ok) {
          return applySecurityHeaders(
            Response.json(
              { error: "طلبات رفع كثيرة — حاول لاحقاً" },
              { status: 429, headers: rateLimitHeaders(rl, UPLOAD_RATE_MAX) },
            ),
          );
        }
        const response = await handleImageUploadRequest(request);
        const headers = new Headers(response.headers);
        for (const [key, value] of Object.entries(rateLimitHeaders(rl, UPLOAD_RATE_MAX))) {
          headers.set(key, value);
        }
        return applySecurityHeaders(
          new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          }),
        );
      },
    },
  },
});
