import type { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  const code = (error as FirebaseError)?.code;

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "البريد أو كلمة المرور غير صحيحة. تأكد أن المستخدم موجود في Firebase → Authentication (ليس Firestore فقط).";
    case "auth/too-many-requests":
      return "محاولات كثيرة. انتظر دقيقة ثم حاول مجدداً.";
    case "auth/network-request-failed":
      return "تعذّر الاتصال بـ Firebase. تحقق من الإنترنت أو أن Auth مفعّل في Console.";
    case "auth/unauthorized-domain":
      return "النطاق غير مصرّح. أضف localhost في Firebase → Authentication → Authorized domains.";
    case "auth/user-disabled":
      return "هذا الحساب معطّل في Firebase.";
    case "auth/operation-not-allowed":
      return "تسجيل الدخول بالبريد غير مفعّل. فعّل Email/Password في Firebase Console.";
    default:
      return code
        ? `فشل الدخول (${code}). راجع إعدادات Firebase Authentication.`
        : "فشل الدخول. حاول مجدداً.";
  }
}
