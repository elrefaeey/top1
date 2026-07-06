import type { ReactNode } from "react";
import { Link, useMatch } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import type { PublishStatus } from "@/types/cms";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  backTo,
  backLabel = "رجوع",
  actionTo,
  actionParams,
  actionLabel,
}: {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actionTo?: string;
  actionParams?: Record<string, string>;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {backTo && (
          <Link to={backTo} className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" /> {backLabel}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionTo && actionLabel && (
        <Link to={actionTo} params={actionParams} className="btn-primary !py-2.5 !px-4 !text-sm">
          <Plus className="h-4 w-4" /> {actionLabel}
        </Link>
      )}
    </div>
  );
}

/** إذا كان مسار $id نشطاً يعرض النموذج فقط */
export function useAdminChildRoute(from: string) {
  return useMatch({ from: from as never, shouldThrow: false });
}

export function AdminStatusBadge({ status }: { status: PublishStatus | string }) {
  const map: Record<string, string> = {
    published: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    draft: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    scheduled: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    new: "bg-primary/10 text-primary border-primary/20",
    contacted: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    closed: "bg-muted text-muted-foreground border-border",
  };
  const labels: Record<string, string> = {
    published: "منشور",
    draft: "مسودة",
    scheduled: "مجدول",
    new: "جديد",
    contacted: "تم التواصل",
    closed: "مغلق",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium", map[status] ?? map.draft)}>
      {labels[status] ?? status}
    </span>
  );
}

export function AdminField({
  label,
  id,
  children,
  hint,
}: {
  label: string;
  id?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function adminInputClass(extra = "") {
  return cn(
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30",
    extra,
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("surface-card p-5 md:p-6", className)}>{children}</div>;
}

export function AdminLoading() {
  return <div className="p-8 text-center text-sm text-muted-foreground">جاري التحميل…</div>;
}

/** شريط تحميل خفيف — لا يحجب الصفحة */
export function AdminFetchingBar({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <div className="mb-4 h-0.5 overflow-hidden rounded-full bg-primary/15">
      <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
    </div>
  );
}

export function AdminEmpty({ message, actionTo, actionParams, actionLabel }: { message: string; actionTo?: string; actionParams?: Record<string, string>; actionLabel?: string }) {
  return (
    <div className="surface-card p-10 text-center">
      <p className="text-muted-foreground text-sm">{message}</p>
      {actionTo && actionLabel && (
        <Link to={actionTo} params={actionParams} className="btn-primary mt-4 inline-flex !text-sm">
          <Plus className="h-4 w-4" /> {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function AdminFormActions({
  saving,
  onDelete,
  deleteLabel = "حذف",
}: {
  saving: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        {saving ? "جاري الحفظ…" : "حفظ"}
      </button>
      {onDelete && (
        <button type="button" onClick={onDelete} className="btn-ghost !text-destructive hover:!border-destructive/30">
          {deleteLabel}
        </button>
      )}
    </div>
  );
}

export function AdminSeoSection({
  metaTitle,
  metaDescription,
  slug,
  onMetaTitle,
  onMetaDescription,
  onSlug,
  showSlug = true,
}: {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  onMetaTitle: (v: string) => void;
  onMetaDescription: (v: string) => void;
  onSlug: (v: string) => void;
  showSlug?: boolean;
}) {
  return (
    <AdminCard className="space-y-4">
      <h2 className="font-semibold">SEO</h2>
      {showSlug && (
        <AdminField label="Slug" id="slug">
          <input id="slug" dir="ltr" value={slug} onChange={(e) => onSlug(e.target.value)} className={adminInputClass("text-start")} />
        </AdminField>
      )}
      <AdminField label="Meta Title" id="metaTitle">
        <input id="metaTitle" value={metaTitle} onChange={(e) => onMetaTitle(e.target.value)} className={adminInputClass()} />
      </AdminField>
      <AdminField label="Meta Description" id="metaDescription">
        <textarea id="metaDescription" rows={3} value={metaDescription} onChange={(e) => onMetaDescription(e.target.value)} className={adminInputClass()} />
      </AdminField>
    </AdminCard>
  );
}

export function AdminPublishSelect({
  value,
  onChange,
}: {
  value: PublishStatus;
  onChange: (v: PublishStatus) => void;
}) {
  return (
    <AdminField label="الحالة" id="status">
      <select id="status" value={value} onChange={(e) => onChange(e.target.value as PublishStatus)} className={adminInputClass()}>
        <option value="published">منشور</option>
        <option value="draft">مسودة</option>
        <option value="scheduled">مجدول</option>
      </select>
    </AdminField>
  );
}
