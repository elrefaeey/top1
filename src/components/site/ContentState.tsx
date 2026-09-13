import { cn } from "@/lib/utils";
import { useT } from "@/providers/LocaleProvider";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-block", className)} aria-hidden />;
}

export function ContentLoading({ label }: { label?: string }) {
  const m = useT();
  return (
    <div className="content-state" role="status" aria-live="polite">
      <Skeleton className="h-4 w-40 mx-auto" />
      <p className="content-state-label">{label ?? m.common.loading}</p>
    </div>
  );
}

export function ContentEmpty({ message }: { message: string }) {
  return (
    <p className="content-state content-state--empty surface-card text-center text-muted-foreground">
      {message}
    </p>
  );
}

export function ContentError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const m = useT();
  return (
    <div className="content-state content-state--error surface-card" role="alert">
      <p>{message ?? m.common.loadFailed}</p>
      {onRetry ? (
        <button type="button" className="btn-ghost mt-3 !text-sm" onClick={onRetry}>
          {m.common.retry}
        </button>
      ) : null}
    </div>
  );
}
