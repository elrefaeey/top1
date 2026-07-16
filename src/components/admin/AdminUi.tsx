import type { ReactNode } from "react";
import { Link, useMatch } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import type { PublishStatus } from "@/types/cms";
import { cn } from "@/lib/utils";
import {
  checkIcon,
  evaluateStaticPageSeo,
  getSummaryChecks,
  type AdminSeoScoreInput,
} from "@/lib/seo/admin-seo-score";

/* Shared admin UI co-exports hooks/helpers for DX — refresh boundary lives at route level. */
/* eslint-disable react-refresh/only-export-components */

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
          <Link
            to={backTo}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
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
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        map[status] ?? map.draft,
      )}
    >
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
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
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

export function AdminEmpty({
  message,
  actionTo,
  actionParams,
  actionLabel,
}: {
  message: string;
  actionTo?: string;
  actionParams?: Record<string, string>;
  actionLabel?: string;
}) {
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
        <button
          type="button"
          onClick={onDelete}
          className="btn-ghost !text-destructive hover:!border-destructive/30"
        >
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
  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;
  const titleHint =
    titleLen === 0
      ? "فارغ — سيُستخدم النص الافتراضي للموقع"
      : titleLen >= 30 && titleLen <= 60
        ? `${titleLen} حرف — طول مثالي`
        : `${titleLen} حرف — المثالي 30–60`;
  const descHint =
    descLen === 0
      ? "فارغ — سيُستخدم النص الافتراضي للموقع"
      : descLen >= 120 && descLen <= 160
        ? `${descLen} حرف — طول مثالي`
        : `${descLen} حرف — المثالي 120–160`;

  return (
    <AdminCard className="space-y-4">
      <div>
        <h2 className="font-semibold">SEO</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          العناوين والوصف تظهر في Google ومشاركات السوشيال ميديا.
        </p>
      </div>
      {showSlug && (
        <AdminField label="Slug" id="slug" hint="معرّف الصفحة في الرابط — بالإنجليزية.">
          <input
            id="slug"
            dir="ltr"
            value={slug}
            onChange={(e) => onSlug(e.target.value)}
            className={adminInputClass("text-start")}
          />
        </AdminField>
      )}
      <AdminField label="Meta Title" id="metaTitle" hint={titleHint}>
        <input
          id="metaTitle"
          value={metaTitle}
          onChange={(e) => onMetaTitle(e.target.value)}
          className={adminInputClass()}
          placeholder="عنوان يظهر في نتائج البحث"
        />
      </AdminField>
      <AdminField label="Meta Description" id="metaDescription" hint={descHint}>
        <textarea
          id="metaDescription"
          rows={4}
          value={metaDescription}
          onChange={(e) => onMetaDescription(e.target.value)}
          className={adminInputClass()}
          placeholder="وصف مختصر يشجّع على النقر"
        />
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
      <select
        id="status"
        value={value}
        onChange={(e) => onChange(e.target.value as PublishStatus)}
        className={adminInputClass()}
      >
        <option value="published">منشور</option>
        <option value="draft">مسودة</option>
        <option value="scheduled">مجدول</option>
      </select>
    </AdminField>
  );
}

/** غلاف قسم داخل صفحة الأدمن */
export function AdminSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-8", className)}>
      <div className="mb-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** جدول داخل بطاقة مع تنسيق موحّد */
export function AdminTableCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("surface-card overflow-hidden", className)}>{children}</div>;
}

export function AdminActionLink({
  to,
  params,
  href,
  label,
  icon: Icon = Pencil,
}: {
  to?: string;
  params?: Record<string, string>;
  href?: string;
  label?: string;
  icon?: typeof Pencil;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <Icon className="h-3.5 w-3.5" />
        {label ?? "فتح"}
      </a>
    );
  }

  if (!to) return null;

  return (
    <Link to={to} params={params} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {label ?? "تحرير"}
    </Link>
  );
}

export function AdminRowActions({
  editTo,
  editParams,
  onDelete,
  deleteLabel = "حذف",
}: {
  editTo: string;
  editParams: Record<string, string>;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={editTo}
        params={editParams}
        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title="تحرير"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          title={deleteLabel}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function scoreBarColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 70) return "bg-emerald-400";
  if (score >= 50) return "bg-amber-500";
  return "bg-destructive";
}

/** لوحة تقييم SEO — للبطاقات أو الجداول */
export function AdminSeoScorePanel({
  title,
  subtitle,
  editTo,
  editParams,
  ...input
}: AdminSeoScoreInput & {
  title: string;
  subtitle?: string;
  editTo?: string;
  editParams?: Record<string, string>;
}) {
  const result = evaluateStaticPageSeo(input);
  const items = getSummaryChecks(result.checks).slice(0, 5);

  return (
    <div className="surface-card flex h-full flex-col p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground truncate" dir="ltr">
              {subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0 text-end">
          <div className="text-2xl font-bold tabular-nums leading-none" dir="ltr">
            {result.score}
          </div>
          <div className="text-[10px] text-muted-foreground" dir="ltr">
            / 100
          </div>
          <div className={cn("mt-1 text-xs font-medium", result.labelClassName)}>
            {result.label}
          </div>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", scoreBarColor(result.score))}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <ul className="mt-4 flex-1 space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-xs leading-snug">
            <span className="shrink-0">{checkIcon(item.status)}</span>
            <span className={item.status === "pass" ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {editTo && (
        <div className="mt-4 pt-3 border-t border-border">
          <AdminActionLink to={editTo} params={editParams} label="تحرير SEO" />
        </div>
      )}
    </div>
  );
}

/** معاينة نص SEO — يدعم العربية والإنجليزية بدون عكس الكلمات */
export function AdminMetaPreview({
  text,
  fallback = "نص افتراضي",
}: {
  text?: string;
  fallback?: string;
}) {
  const value = text?.trim() || fallback;
  const isDefault = !text?.trim();
  return (
    <p
      className={cn(
        "text-xs leading-relaxed line-clamp-2 [unicode-bidi:plaintext]",
        isDefault ? "text-muted-foreground italic" : "text-foreground/80",
      )}
      dir="auto"
      title={value}
    >
      {value}
    </p>
  );
}

/** شارة تقييم SEO مدمجة — للجداول */
export function AdminSeoScoreBadge(input: AdminSeoScoreInput) {
  const result = evaluateStaticPageSeo(input);
  const topIssue = getSummaryChecks(result.checks).find((c) => c.status !== "pass");

  return (
    <div
      className="inline-flex flex-col gap-1.5"
      title={topIssue ? `${topIssue.label}` : undefined}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-bold tabular-nums",
            result.score >= 90 && "bg-emerald-500/15 text-emerald-700",
            result.score >= 70 && result.score < 90 && "bg-emerald-500/10 text-emerald-600",
            result.score >= 50 && result.score < 70 && "bg-amber-500/15 text-amber-700",
            result.score < 50 && "bg-destructive/10 text-destructive",
          )}
          dir="ltr"
        >
          {result.score}
        </span>
        <span className={cn("text-xs font-medium", result.labelClassName)}>{result.label}</span>
      </div>
      <div className="h-1 w-full max-w-[5.5rem] overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", scoreBarColor(result.score))}
          style={{ width: `${result.score}%` }}
        />
      </div>
    </div>
  );
}
