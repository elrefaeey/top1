import { COLLECTIONS } from "@/lib/firebase/firestore";
import { nowIso } from "@/lib/cms/admin-utils";
import { createFirestoreDocument } from "@/lib/server/firebase-admin";

/** Server-only lead write — bypasses client Firestore rules via Admin REST. */
export async function createLeadSecure(input: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
}): Promise<void> {
  const ts = nowIso();
  await createFirestoreDocument(COLLECTIONS.leads, {
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    source: input.source ?? "contact_form",
    status: "new",
    createdAt: ts,
    updatedAt: ts,
  });
}
