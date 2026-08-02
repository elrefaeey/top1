import { createFileRoute } from "@tanstack/react-router";
import {
  exchangeAuthorizationCode,
  fetchGoogleAccountEmail,
  getGscOAuthConfig,
  logGscOAuthDebug,
  parseOAuthState,
  resolveGscRedirectUri,
} from "@/lib/seo/gsc/auth";
import { saveGscCredentials } from "@/lib/seo/gsc/client";
import { appendAiLog } from "@/lib/seo/automation/drafts";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { applySecurityHeaders } from "@/lib/security/headers";

function adminRedirect(request: Request, params: Record<string, string>): Response {
  const url = new URL(request.url);
  const target = new URL("/admin/seo-ai", url.origin);
  for (const [k, v] of Object.entries(params)) target.searchParams.set(k, v);
  return applySecurityHeaders(
    new Response(null, {
      status: 302,
      headers: { Location: target.toString(), "Cache-Control": "no-store" },
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

        if (error) {
          return adminRedirect(request, {
            gsc: "error",
            message: error === "access_denied" ? "تم إلغاء الربط" : error,
          });
        }

        if (!code || !state) {
          return adminRedirect(request, {
            gsc: "error",
            message: "استجابة Google ناقصة",
          });
        }

        try {
          const { clientId, clientSecret } = getGscOAuthConfig();
          const { uid } = parseOAuthState(state, clientSecret);
          const redirectUri = resolveGscRedirectUri(request);
          logGscOAuthDebug({ redirectUri, clientId, source: "callback" });
          const tokens = await exchangeAuthorizationCode({
            code,
            redirectUri,
            clientId,
            clientSecret,
          });
          const email = await fetchGoogleAccountEmail(tokens.accessToken);
          await saveGscCredentials({
            userId: uid,
            refreshToken: tokens.refreshToken,
            connectedEmail: email || "connected",
          });
          await appendAiLog({
            action: "gsc_connect",
            description: `GSC connected for user ${uid}${email ? ` (${email})` : ""}`,
            relatedCollection: COLLECTIONS.gscCredentials,
            relatedId: uid,
          });

          return adminRedirect(request, { gsc: "connected" });
        } catch (err) {
          console.error("[api/seo/gsc/callback]", err);
          const message = err instanceof Error ? err.message : "فشل الربط";
          return adminRedirect(request, {
            gsc: "error",
            message: message.slice(0, 180),
          });
        }
      },
    },
  },
});
