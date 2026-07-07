import { createFileRoute } from "@tanstack/react-router";
import { createLead } from "@/lib/cms/content-service";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimit, rateLimitKey } from "@/lib/security/rate-limit";
import { isHoneypotTriggered, validateLeadInput } from "@/lib/security/validate";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!checkRateLimit(rateLimitKey(request, "leads"))) {
            return jsonError("طلبات كثيرة — حاول بعد دقيقة", 429);
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
            email: String(body.email ?? ""),
            phone: body.phone ? String(body.phone) : undefined,
            message: String(body.message ?? ""),
            source: body.source ? String(body.source) : "contact_form",
          });

          await createLead(lead);
          return applySecurityHeaders(Response.json({ ok: true }));
        } catch (err) {
          console.error("[api/leads]", err);
          const message =
            err instanceof Error && err.message && !err.message.includes("Firebase")
              ? err.message
              : "تعذّر إرسال الرسالة";
          return jsonError(message, 400);
        }
      },
    },
  },
});
