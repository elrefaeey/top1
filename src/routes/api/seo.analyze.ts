import { createFileRoute } from "@tanstack/react-router";
import { runOpportunityEngineFromSnapshots } from "@/lib/seo/ai/opportunity-engine";
import { authorizeSeoApiRequest } from "@/lib/seo/automation/auth";
import { listGscSnapshots } from "@/lib/seo/automation/drafts";
import {
  getServiceAccountDiagnostics,
} from "@/lib/server/firebase-admin";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";

const RATE_MAX = 10;

function logSaDiagnostics(phase: string): void {
  const d = getServiceAccountDiagnostics();
  // Never log JSON / keys / emails — booleans + length only.
  console.info(
    `[api/seo/analyze] phase=${phase} has_service_account=${d.has_service_account} environment=${d.environment} json_char_length=${d.json_char_length} parse_ok=${d.parse_ok} has_project_id=${d.has_project_id} has_client_email=${d.has_client_email} has_private_key=${d.has_private_key}`,
  );
}

export const Route = createFileRoute("/api/seo/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(rateLimitKey(request, "seo-analyze"), RATE_MAX);
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, RATE_MAX) },
              ),
            );
          }

          logSaDiagnostics("start");
          await authorizeSeoApiRequest(request);

          logSaDiagnostics("list_snapshots");
          const snapshots = await listGscSnapshots({ limit: 200 });
          if (snapshots.length === 0) {
            return jsonError("لا توجد بيانات GSC — نفّذ المزامنة أولاً", 400);
          }

          logSaDiagnostics("write_insights");
          const { opportunities } = await runOpportunityEngineFromSnapshots(snapshots);

          logSaDiagnostics("done");
          return applySecurityHeaders(
            Response.json(
              { ok: true, opportunities, snapshotCount: snapshots.length },
              { headers: rateLimitHeaders(rl, RATE_MAX) },
            ),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          logSaDiagnostics("error");
          console.error("[api/seo/analyze]", message || "failed");

          if (
            message.includes("غير مصرح") ||
            message.includes("صلاحية") ||
            message.includes("رمز") ||
            message.includes("محرر")
          ) {
            return jsonError(message || "غير مصرح", 401);
          }

          // Distinguish Admin init vs Firestore I/O without exposing secrets.
          if (message.includes("FIREBASE_SERVICE_ACCOUNT_JSON غير مُعد")) {
            return jsonError("إعدادات السيرفر غير مكتملة — FIREBASE_SERVICE_ACCOUNT_JSON مفقود", 503);
          }
          if (message.includes("FIREBASE_SERVICE_ACCOUNT_JSON غير صالح")) {
            return jsonError(
              "إعدادات السيرفر غير مكتملة — FIREBASE_SERVICE_ACCOUNT_JSON غير صالح (أعد لصق JSON كاملاً في سطر واحد)",
              503,
            );
          }
          if (message.includes("تعذّر قراءة المستند") || message.includes("تعذّر تحديث المستند") || message.includes("تعذّر حفظ")) {
            return jsonError(`فشل الوصول إلى Firestore — ${message.slice(0, 120)}`, 503);
          }
          if (message.includes("تعذّر الحصول على توكن Firebase")) {
            return jsonError("فشل تهيئة Firebase Admin (JWT) — تحقق من private_key في Service Account", 503);
          }

          return jsonError(message || "تعذّر تحليل فرص SEO", 503);
        }
      },
    },
  },
});
