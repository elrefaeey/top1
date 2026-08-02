import { createFileRoute } from "@tanstack/react-router";
import {
  buildGoogleAuthorizeUrl,
  createOAuthState,
  extractBearerToken,
  getGscOAuthConfig,
  resolveGscRedirectUri,
} from "@/lib/seo/gsc/auth";
import { verifyFirebaseAdminRole } from "@/lib/security/firebase-auth-server";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 20;

export const Route = createFileRoute("/api/seo/gsc/connect")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(
            rateLimitKey(request, "seo-gsc-connect"),
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
          const { clientId, clientSecret } = getGscOAuthConfig();
          const redirectUri = resolveGscRedirectUri(request);
          const state = createOAuthState(uid, clientSecret);
          const authorizeUrl = buildGoogleAuthorizeUrl({
            clientId,
            redirectUri,
            state,
          });

          return applySecurityHeaders(
            Response.json(
              { authorizeUrl, redirectUri },
              { headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
          );
        } catch (err) {
          console.error("[api/seo/gsc/connect]", err);
          const message = err instanceof Error ? err.message : "";
          if (
            message.includes("غير مصرح") ||
            message.includes("مدير") ||
            message.includes("رمز") ||
            message.includes("صلاحية")
          ) {
            return jsonError(message || "غير مصرح", 401);
          }
          if (message.includes("GOOGLE_CLIENT")) {
            return jsonError(message, 503);
          }
          return jsonError("تعذّر بدء ربط Google Search Console", 503);
        }
      },
    },
  },
});
