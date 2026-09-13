import { useState } from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  clearAdminFirestoreUnavailable,
  getAdminFirestoreErrorKind,
  isAdminFirestoreUnavailable,
} from "@/lib/cms/admin-service";
import { useAdminServices } from "@/hooks/use-admin-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export function AdminFirestoreBanner() {
  const { a } = useAdminI18n();
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
    <div className="mx-4 mt-4 flex items-start gap-3 rounded-[var(--admin-radius)] border border-[color-mix(in_srgb,var(--admin-warning)_28%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-warning)_8%,white)] px-4 py-3 text-sm text-[var(--admin-text)] md:mx-0">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--admin-warning)]" />
      <div className="flex-1">
        <p className="font-semibold">{a.fsBannerTitle}</p>
        <p className="mt-0.5 text-xs text-[var(--admin-muted)]">
          {kind === "permission" ? (
            <>
              {a.fsBannerPermission}{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--admin-primary)] underline hover:opacity-80"
              >
                {a.fsBannerPublishRules}
              </a>
            </>
          ) : (
            <>
              {a.fsBannerGeneric}{" "}
              <Link to="/admin" className="font-medium text-[var(--admin-primary)] underline hover:opacity-80">
                {a.fsBannerImport}
              </Link>
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
          {retrying ? a.retrying : a.retry}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-md p-1 text-[var(--admin-muted)] hover:bg-[color-mix(in_srgb,var(--admin-warning)_15%,transparent)] hover:text-[var(--admin-text)]"
        aria-label={a.close}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
