import type { FirebaseError } from "firebase/app";
import type { Locale } from "@/lib/i18n/locale";
import { getAdminMessages, adminT } from "@/lib/i18n/admin-messages";

export function getAuthErrorMessage(error: unknown, locale: Locale = "ar"): string {
  const a = getAdminMessages(locale);
  const code = (error as FirebaseError)?.code;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return a.authBadCredentials;
    case "auth/too-many-requests":
      return a.authTooMany;
    case "auth/network-request-failed":
      return a.authNetwork;
    case "auth/unauthorized-domain":
      return a.authUnauthorizedDomain;
    case "auth/user-disabled":
      return a.authDisabled;
    case "auth/operation-not-allowed":
      return a.authNotAllowed;
    default:
      return code ? adminT(a.authFailedCode, { code }) : a.authFailed;
  }
}
