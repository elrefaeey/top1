import { createFileRoute } from "@tanstack/react-router";
import { handleImageUploadRequest } from "@/lib/server/image-upload";
import { applySecurityHeaders } from "@/lib/security/headers";
import { checkRateLimit, rateLimitKey } from "@/lib/security/rate-limit";

export const Route = createFileRoute("/api/upload-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!checkRateLimit(rateLimitKey(request, "upload"), 20)) {
          return applySecurityHeaders(
            Response.json({ error: "طلبات رفع كثيرة — حاول لاحقاً" }, { status: 429 }),
          );
        }
        return applySecurityHeaders(await handleImageUploadRequest(request));
      },
    },
  },
});
