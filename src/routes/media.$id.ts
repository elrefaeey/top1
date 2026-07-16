import { createFileRoute } from "@tanstack/react-router";
import { readFirestoreMedia } from "@/lib/server/media-firestore";
import { applySecurityHeaders } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const MEDIA_RATE_MAX = 240;

export const Route = createFileRoute("/media/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const rl = await checkRateLimitAsync(rateLimitKey(request, "media"), MEDIA_RATE_MAX);
        if (!rl.ok) {
          return applySecurityHeaders(
            new Response("Too Many Requests", {
              status: 429,
              headers: rateLimitHeaders(rl, MEDIA_RATE_MAX),
            }),
          );
        }

        try {
          const media = await readFirestoreMedia(params.id);
          if (!media) {
            return applySecurityHeaders(new Response("Not Found", { status: 404 }));
          }

          return applySecurityHeaders(
            new Response(new Uint8Array(media.bytes), {
              status: 200,
              headers: {
                "Content-Type": media.contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
                ...rateLimitHeaders(rl, MEDIA_RATE_MAX),
              },
            }),
          );
        } catch (err) {
          console.error("[media]", err);
          return applySecurityHeaders(new Response("Error", { status: 500 }));
        }
      },
    },
  },
});
