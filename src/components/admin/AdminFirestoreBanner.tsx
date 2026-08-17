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
    <div className="mx-4 mt-4 flex items-start gap-3 rounded-[var(--admin-radius,0.625rem)] border border-amber-500/25 bg-amber-50 px-4 py-3 text-sm text-amber-950 md:mx-0">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">تعذّر الاتصال بـ Firestore</p>
        <p className="mt-0.5 text-xs opacity-90">
          {kind === "permission" ? (
            <>
              حسابك مسجّل لكن Firestore يرفض الطلب. أنشئ مستند{" "}
              <code className="rounded bg-amber-500/10 px-1 text-[0.7rem]" dir="ltr">
                users/UID
              </code>{" "}
              مع <code className="rounded bg-amber-500/10 px-1 text-[0.7rem]">role: admin</code>، ثم{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline hover:text-[var(--admin-primary,#1149b0)]"
              >
                انشر firestore.rules
              </a>
              .
            </>
          ) : (
            <>
              فعّل Firestore في Firebase Console، انشر قواعد الأمان، ثم{" "}
              <Link to="/admin" className="font-medium underline hover:text-[var(--admin-primary,#1149b0)]">
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
          className="admin-btn admin-btn-sm admin-btn-ghost mt-2 !min-h-8"
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
