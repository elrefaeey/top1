import { createFileRoute } from "@tanstack/react-router";
import { createLeadSecure } from "@/lib/server/create-lead";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";
import { isHoneypotTriggered, validateLeadInput } from "@/lib/security/validate";

const LEADS_RATE_MAX = 8;

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(rateLimitKey(request, "leads"), LEADS_RATE_MAX);
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول بعد دقيقة" },
                { status: 429, headers: rateLimitHeaders(rl, LEADS_RATE_MAX) },
              ),
            );
          }

          const contentType = request.headers.get("content-type") ?? "";
          if (!contentType.includes("application/json")) {
            return jsonError("طلب غير صالح", 415);
          }

          let body: Record<string, unknown>;
          try {
            body = (await request.json()) as Record<string, unknown>;
          } catch {
            return jsonError("طلب فارغ أو غير صالح", 400);
          }
          if (!body || typeof body !== "object") {
            return jsonError("طلب فارغ أو غير صالح", 400);
          }
          if (isHoneypotTriggered(String(body.website ?? ""))) {
            return applySecurityHeaders(Response.json({ ok: true }));
          }

          const lead = validateLeadInput({
            name: String(body.name ?? ""),
            email: body.email ? String(body.email) : undefined,
            phone: body.phone ? String(body.phone) : undefined,
            message: String(body.message ?? ""),
            source: body.source ? String(body.source) : "contact_form",
          });

          await createLeadSecure(lead);
          return applySecurityHeaders(
            Response.json({ ok: true }, { headers: rateLimitHeaders(rl, LEADS_RATE_MAX) }),
          );
        } catch (err) {
          console.error("[api/leads]", err);
          const message = err instanceof Error ? err.message : "";
          const isValidation =
            Boolean(message) &&
            !message.includes("Firebase") &&
            !message.includes("Service account") &&
            !message.includes("FIREBASE_") &&
            !message.toLowerCase().includes("unavailable");

          if (isValidation && message && !message.includes("fetch")) {
            return jsonError(message, 400);
          }
          return jsonError("تعذّر إرسال الرسالة", 503);
        }
      },
    },
  },
});
