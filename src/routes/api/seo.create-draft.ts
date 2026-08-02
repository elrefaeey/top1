import { createFileRoute } from "@tanstack/react-router";
import { authorizeSeoApiRequest } from "@/lib/seo/automation/auth";
import { createAiBlogDraft } from "@/lib/seo/automation/drafts";
import { applySecurityHeaders, jsonError } from "@/lib/security/headers";
import { checkRateLimitAsync, rateLimitHeaders, rateLimitKey } from "@/lib/security/rate-limit";
import type { AiBlogDraftInput } from "@/types/seo-automation";

const SEO_DRAFT_RATE_MAX = 20;

export const Route = createFileRoute("/api/seo/create-draft")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rl = await checkRateLimitAsync(
            rateLimitKey(request, "seo-create-draft"),
            SEO_DRAFT_RATE_MAX,
          );
          if (!rl.ok) {
            return applySecurityHeaders(
              Response.json(
                { error: "طلبات كثيرة — حاول لاحقاً" },
                { status: 429, headers: rateLimitHeaders(rl, SEO_DRAFT_RATE_MAX) },
              ),
            );
          }

          await authorizeSeoApiRequest(request);

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

          const tags = Array.isArray(body.tags)
            ? body.tags.map((t) => String(t))
            : typeof body.tags === "string"
              ? String(body.tags)
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : undefined;

          const input: AiBlogDraftInput = {
            title: String(body.title ?? ""),
            slug: body.slug != null ? String(body.slug) : undefined,
            excerpt: body.excerpt != null ? String(body.excerpt) : undefined,
            content: String(body.content ?? ""),
            featuredImage: body.featuredImage != null ? String(body.featuredImage) : undefined,
            featuredImageAlt:
              body.featuredImageAlt != null ? String(body.featuredImageAlt) : undefined,
            category: body.category != null ? String(body.category) : undefined,
            tags,
            author: body.author != null ? String(body.author) : undefined,
            metaTitle: body.metaTitle != null ? String(body.metaTitle) : undefined,
            metaDescription:
              body.metaDescription != null ? String(body.metaDescription) : undefined,
            status: body.status != null ? String(body.status) : undefined,
          };

          const result = await createAiBlogDraft(input);

          return applySecurityHeaders(
            Response.json(
              { ok: true, ...result },
              { status: 201, headers: rateLimitHeaders(rl, SEO_DRAFT_RATE_MAX) },
            ),
          );
        } catch (err) {
          console.error("[api/seo/create-draft]", err);
          const message = err instanceof Error ? err.message : "";
          if (message.includes("غير مصرح") || message.includes("صلاحية") || message.includes("رمز")) {
            return jsonError(message || "غير مصرح", 401);
          }
          if (
            message.includes("مطلوب") ||
            message.includes("draft") ||
            message.includes("Base64") ||
            message.includes("مسودات")
          ) {
            return jsonError(message || "طلب غير صالح", 400);
          }
          if (message.includes("FIREBASE_SERVICE_ACCOUNT") || message.includes("Service account")) {
            return jsonError("إعدادات السيرفر غير مكتملة", 503);
          }
          return jsonError("تعذّر إنشاء المسودة", 503);
        }
      },
    },
  },
});
