import { createFileRoute } from "@tanstack/react-router";
import {
  clearGscFirebaseSessionCookie,
  exchangeAuthorizationCode,
  fetchGoogleAccountEmail,
  getGscOAuthConfig,
  logGscOAuthDebug,
  parseOAuthState,
  readGscFirebaseSessionCookie,
  resolveGscRedirectUri,
  takeGscFirebaseSession,
} from "@/lib/seo/gsc/auth";
import { getGscCredentials, saveGscCredentials } from "@/lib/seo/gsc/client";
import { appendAiLog } from "@/lib/seo/automation/drafts";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { applySecurityHeaders } from "@/lib/security/headers";
import { hasFirebaseServiceAccount } from "@/lib/server/firebase-admin";

function adminRedirect(
  request: Request,
  params: Record<string, string>,
  extraHeaders?: HeadersInit,
): Response {
  const url = new URL(request.url);
  const target = new URL("/admin/seo-ai", url.origin);
  for (const [k, v] of Object.entries(params)) target.searchParams.set(k, v);
  const headers = new Headers(extraHeaders);
  headers.set("Location", target.toString());
  headers.set("Cache-Control", "no-store");
  return applySecurityHeaders(
    new Response(null, {
      status: 302,
      headers,
    }),
  );
}

export const Route = createFileRoute("/api/seo/gsc/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const error = url.searchParams.get("error");
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const clearCookie = clearGscFirebaseSessionCookie(request);

        if (error) {
          return adminRedirect(
            request,
            {
              gsc: "error",
              message: error === "access_denied" ? "تم إلغاء الربط" : error,
            },
            { "Set-Cookie": clearCookie },
          );
        }

        if (!code || !state) {
          return adminRedirect(
            request,
            {
              gsc: "error",
              message: "استجابة Google ناقصة",
            },
            { "Set-Cookie": clearCookie },
          );
        }

        try {
          const { clientId, clientSecret } = getGscOAuthConfig();
          const { uid, nonce } = parseOAuthState(state, clientSecret);
          const redirectUri = resolveGscRedirectUri(request);
          logGscOAuthDebug({ redirectUri, clientId, source: "callback" });

          const tokens = await exchangeAuthorizationCode({
            code,
            redirectUri,
            clientId,
            clientSecret,
          });
          const email = await fetchGoogleAccountEmail(tokens.accessToken);
          const fromCookie = readGscFirebaseSessionCookie(request);
          const fromMemory = takeGscFirebaseSession(nonce);
          const firebaseIdToken = fromCookie || fromMemory || undefined;

          console.info(
            `[gsc-oauth:callback] save_start uid_suffix=${uid.slice(-6)} has_sa=${hasFirebaseServiceAccount()} has_user_token=${Boolean(firebaseIdToken)} token_from_cookie=${Boolean(fromCookie)} token_from_memory=${Boolean(fromMemory)}`,
          );

          await saveGscCredentials({
            userId: uid,
            refreshToken: tokens.refreshToken,
            connectedEmail: email || "connected",
            firebaseIdToken,
          });

          // Safe verify — never log token values
          let docExists = false;
          let hasRefreshToken = false;
          let hasConnectedEmail = false;
          try {
            const saved = await getGscCredentials(uid, firebaseIdToken);
            docExists = Boolean(saved);
            hasRefreshToken = Boolean(saved?.refreshToken);
            hasConnectedEmail = Boolean(saved?.connectedEmail);
          } catch (verifyErr) {
            console.info(
              `[gsc-oauth:callback] verify_failed uid_suffix=${uid.slice(-6)} reason=${verifyErr instanceof Error ? verifyErr.message.slice(0, 80) : "unknown"}`,
            );
          }

          console.info(
            `[gsc-oauth:callback] credentials_persisted uid_suffix=${uid.slice(-6)} doc_exists=${docExists} has_refresh_token=${hasRefreshToken} connected_email_set=${hasConnectedEmail}`,
          );

          try {
            await appendAiLog({
              action: "gsc_connect",
              description: `GSC connected for user ${uid.slice(-6)}${email ? " (email_set)" : ""}`,
              relatedCollection: COLLECTIONS.gscCredentials,
              relatedId: uid,
            });
          } catch (logErr) {
            // Persistence of credentials must succeed even if ai_logs write needs service account.
            console.info(
              `[gsc-oauth:callback] ai_log_skipped reason=${logErr instanceof Error ? logErr.message.slice(0, 80) : "unknown"}`,
            );
          }

          return adminRedirect(request, { gsc: "connected" }, { "Set-Cookie": clearCookie });
        } catch (err) {
          console.error("[api/seo/gsc/callback]", err instanceof Error ? err.message : "failed");
          const message = err instanceof Error ? err.message : "فشل الربط";
          return adminRedirect(
            request,
            {
              gsc: "error",
              message: message.slice(0, 180),
            },
            { "Set-Cookie": clearCookie },
          );
        }
      },
    },
  },
});
