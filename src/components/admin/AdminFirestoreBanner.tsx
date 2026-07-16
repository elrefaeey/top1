import { useState } from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  clearAdminFirestoreUnavailable,
  getAdminFirestoreErrorKind,
  isAdminFirestoreUnavailable,
} from "@/lib/cms/admin-service";
import { useAdminServices } from "@/hooks/use-admin-cms";

export function AdminFirestoreBanner() {
  const { isFetched, refetch } = useAdminServices();
  const [dismissed, setDismissed] = useState(false);
  const [retrying, setRetrying] = useState(false);

  if (dismissed || !isFetched || !isAdminFirestoreUnavailable()) return null;

  const kind = getAdminFirestoreErrorKind();

  async function handleRetry() {
    setRetrying(true);
    clearAdminFirestoreUnavailable();
    try {
      await refetch();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="mx-6 mt-4 md:mx-8 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="font-medium">تعذّر الاتصال بـ Firestore</p>
        <p className="mt-0.5 text-xs opacity-90">
          {kind === "permission" ? (
            <>
              حسابك مسجّل لكن Firestore يرفض الطلب. أنشئ مستند{" "}
              <code className="text-[0.7rem] bg-amber-500/10 px-1 rounded" dir="ltr">
                users/UID
              </code>{" "}
              مع <code className="text-[0.7rem] bg-amber-500/10 px-1 rounded">role: admin</code>، ثم{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-primary"
              >
                انشر firestore.rules
              </a>
              .
            </>
          ) : (
            <>
              فعّل Firestore في Firebase Console، انشر قواعد الأمان، ثم{" "}
              <Link to="/admin" className="underline font-medium hover:text-primary">
                استورد المحتوى
              </Link>{" "}
              من لوحة التحكم.
            </>
          )}
        </p>
        <button
          type="button"
          disabled={retrying}
          onClick={() => void handleRetry()}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium underline hover:text-primary disabled:opacity-60"
        >
          <RefreshCw className={`h-3 w-3 ${retrying ? "animate-spin" : ""}`} />
          {retrying ? "جاري إعادة المحاولة…" : "إعادة المحاولة"}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded p-1 hover:bg-amber-500/20"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
