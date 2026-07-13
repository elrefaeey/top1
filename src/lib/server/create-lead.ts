import { COLLECTIONS } from "@/lib/firebase/firestore";
import { nowIso } from "@/lib/cms/admin-utils";
import { getAdminDb } from "@/lib/server/firebase-admin";

/** Server-only lead write — bypasses client Firestore rules via Admin SDK. */
export async function createLeadSecure(input: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
}): Promise<void> {
  const db = getAdminDb();
  const ref = db.collection(COLLECTIONS.leads).doc();
  const ts = nowIso();
  await ref.set({
    name: input.name,
    ...(input.email ? { email: input.email } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    message: input.message,
    source: input.source ?? "contact_form",
    status: "new" as const,
    createdAt: ts,
    updatedAt: ts,
  });
}
