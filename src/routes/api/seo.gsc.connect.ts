import { createFileRoute } from "@tanstack/react-router";
import {
  buildGoogleAuthorizeUrl,
  buildGscFirebaseSessionCookie,
  createOAuthState,
  extractBearerToken,
  getGscOAuthConfig,
  logGscOAuthDebug,
  rememberGscFirebaseSession,
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
          logGscOAuthDebug({ redirectUri, clientId, source: "connect" });
          const state = createOAuthState(uid, clientSecret);
          // Bridge ID token to callback (memory + cookie). Never log the token.
          rememberGscFirebaseSession(state, idToken);
          const authorizeUrl = buildGoogleAuthorizeUrl({
            clientId,
            redirectUri,
            state,
          });

          const response = applySecurityHeaders(
            Response.json(
              { authorizeUrl, redirectUri },
              { headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
          );
          // Persist Firebase session for callback write when service account is absent.
          response.headers.append("Set-Cookie", buildGscFirebaseSessionCookie(request, idToken));
          console.info(
            `[gsc-oauth:connect] session_bridged uid_suffix=${uid.slice(-6)} has_sa=${Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim())}`,
          );
          return response;
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
