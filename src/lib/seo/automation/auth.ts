import { verifyFirebaseEditorRole } from "@/lib/security/firebase-auth-server";
import { safeEqualString } from "@/lib/server/firebase-admin";

export type SeoApiActor =
  | { kind: "editor"; uid: string }
  | { kind: "automation" };

/**
 * Authorize SEO automation APIs via:
 * 1) Authorization: Bearer <Firebase ID token> + editor/admin role, or
 * 2) x-seo-automation-key matching SEO_AUTOMATION_API_KEY (when set).
 */
export async function authorizeSeoApiRequest(request: Request): Promise<SeoApiActor> {
  const automationKey = (process.env.SEO_AUTOMATION_API_KEY ?? "").trim();
  const providedKey = (request.headers.get("x-seo-automation-key") ?? "").trim();

  if (automationKey && providedKey && safeEqualString(providedKey, automationKey)) {
    return { kind: "automation" };
  }

  const auth = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  if (!match?.[1]) {
    throw new Error("غير مصرح — يلزم توكن محرر أو مفتاح الأتمتة");
  }

  const uid = await verifyFirebaseEditorRole(match[1].trim());
  return { kind: "editor", uid };
}
