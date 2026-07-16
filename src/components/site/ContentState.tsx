import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-block", className)} aria-hidden />;
}

export function ContentLoading({ label = "جاري التحميل…" }: { label?: string }) {
  return (
    <div className="content-state" role="status" aria-live="polite">
      <Skeleton className="h-4 w-40 mx-auto" />
      <p className="content-state-label">{label}</p>
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
  message = "تعذّر تحميل البيانات. حاول مرة أخرى.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="content-state content-state--error surface-card" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="btn-ghost mt-3 !text-sm" onClick={onRetry}>
          إعادة المحاولة
        </button>
      ) : null}
    </div>
  );
}
