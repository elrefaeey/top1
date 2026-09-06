import type { ReactNode } from "react";
import { Link, useMatch } from "@tanstack/react-router";
import {
  ArrowRight,
  FileText,
  Image as ImageIcon,
  LayoutList,
  Pencil,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
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

export type AdminSectionTone = "blue" | "teal" | "violet" | "amber" | "emerald" | "rose" | "sky" | "slate";

function inferSectionTone(title: string): AdminSectionTone {
  const t = title.toLowerCase();
  if (/seo|سيو|meta/.test(t)) return "emerald";
  if (/صورة|غلاف|وسائط|avatar|ميديا/.test(t)) return "violet";
  if (/تصنيف|نشر|إعداد|ترتيب|حالة/.test(t)) return "amber";
  if (/محتوى|وصف|سيرة|اقتباس|سؤال|إجابة|ميزات|تفاصيل|تسليم/.test(t)) return "teal";
  if (/أساسي|عنوان|خدمة|كاتب|اسم|باقة|مشروع|رأي|إحصائ/.test(t)) return "blue";
  if (/زر|cta|رابط/.test(t)) return "sky";
  return "slate";
}

function inferSectionIcon(title: string, tone: AdminSectionTone): LucideIcon {
  if (/seo|سيو|meta/.test(title.toLowerCase())) return Search;
  if (/صورة|غلاف|وسائط|avatar/.test(title)) return ImageIcon;
  if (/تصنيف|نشر|إعداد|ترتيب|حالة/.test(title)) return Settings2;
  if (/محتوى|وصف|سيرة|اقتباس|سؤال|ميزات|تفاصيل/.test(title)) return FileText;
  if (tone === "blue") return Sparkles;
  return LayoutList;
}

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
    <div className="admin-page-hero mb-6 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        {backTo && (
          <Link
            to={backTo}
            className="mb-2 inline-flex min-h-10 items-center gap-1.5 text-sm text-[var(--admin-muted,#5b6b82)] hover:text-[var(--admin-primary,#1149b0)]"
          >
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" /> {backLabel}
          </Link>
        )}
        <h1 className="text-xl font-bold tracking-tight text-[var(--admin-text,#152238)] sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--admin-muted,#5b6b82)]">
            {description}
          </p>
        )}
      </div>
      {actionTo && actionLabel && (
        <Link
          to={actionTo}
          params={actionParams}
          className="admin-btn admin-btn-primary w-full sm:w-auto"
        >
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
    published: "bg-emerald-500/12 text-emerald-800 border-emerald-500/25",
    draft: "bg-amber-500/12 text-amber-800 border-amber-500/25",
    scheduled: "bg-sky-500/12 text-sky-800 border-sky-500/25",
    new: "bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_12%,white)] text-[var(--admin-primary,#1149b0)] border-[color-mix(in_srgb,var(--admin-primary,#1149b0)_25%,transparent)]",
    contacted: "bg-amber-500/12 text-amber-800 border-amber-500/25",
    closed: "bg-[var(--admin-surface-muted,#eef1f6)] text-[var(--admin-muted,#5b6b82)] border-[var(--admin-border,#dde3ec)]",
    pending: "bg-amber-500/12 text-amber-800 border-amber-500/25",
    reviewed: "bg-sky-500/12 text-sky-800 border-sky-500/25",
    completed: "bg-emerald-500/12 text-emerald-800 border-emerald-500/25",
  };
  const labels: Record<string, string> = {
    published: "منشور",
    draft: "مسودة",
    scheduled: "مجدول",
    new: "جديد",
    contacted: "تم التواصل",
    closed: "مغلق",
    pending: "بانتظار",
    reviewed: "تمت المراجعة",
    completed: "مكتمل",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold",
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
      <label htmlFor={id} className="text-sm font-semibold text-[var(--admin-text,#152238)]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-[var(--admin-muted,#5b6b82)]">{hint}</p>}
    </div>
  );
}

export function adminInputClass(extra = "") {
  return cn("admin-input", extra);
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("admin-card p-4 sm:p-5 md:p-6", className)}>{children}</div>;
}

/** بطاقة نموذج ملوّنة بأيقونة — لنماذج الإضافة/التعديل */
export function AdminCardSection({
  title,
  description,
  children,
  className,
  tone,
  icon: IconProp,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: AdminSectionTone;
  icon?: LucideIcon;
}) {
  const resolvedTone = tone ?? inferSectionTone(title);
  const Icon = IconProp ?? inferSectionIcon(title, resolvedTone);

  return (
    <div className={cn("admin-card admin-card-section", className)} data-tone={resolvedTone}>
      <div className="admin-card-section-head">
        <span className="admin-card-section-icon" aria-hidden>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-sm font-bold text-[var(--admin-text,#152238)]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--admin-muted,#5b6b82)]">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="admin-card-section-body">{children}</div>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-[var(--admin-muted)]">
      <div className="admin-spinner" aria-hidden />
      جاري التحميل…
    </div>
  );
}

/** شريط تحميل خفيف — لا يحجب الصفحة */
export function AdminFetchingBar({ show }: { show?: boolean }) {
  if (!show) return null;
  return (
    <div className="mb-4 h-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_12%,transparent)]">
      <div className="h-full w-1/3 animate-pulse rounded-full bg-[var(--admin-primary,#1149b0)]" />
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
    <div className="admin-card p-10 text-center sm:p-12">
      <p className="text-sm text-[var(--admin-muted,#5b6b82)]">{message}</p>
      {actionTo && actionLabel && (
        <Link to={actionTo} params={actionParams} className="admin-btn admin-btn-primary mt-5">
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
    <div className="admin-form-actions-bar">
      <button type="submit" disabled={saving} className="admin-btn admin-btn-primary min-w-[7.5rem]">
        {saving ? "جاري الحفظ…" : "حفظ"}
      </button>
      {onDelete && (
        <button type="button" onClick={onDelete} className="admin-btn admin-btn-danger">
          {deleteLabel}
        </button>
      )}
      <p className="ms-auto hidden text-xs text-[var(--admin-muted,#5b6b82)] sm:block">
        احفظ التغييرات قبل مغادرة الصفحة
      </p>
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
    <AdminCardSection
      title="SEO"
      description="العناوين والوصف تظهر في Google ومشاركات السوشيال ميديا."
      tone="emerald"
      icon={Search}
    >
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
    </AdminCardSection>
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
      <div className="mb-3.5">
        <h2 className="text-base font-semibold text-[var(--admin-text,#152238)]">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--admin-muted,#5b6b82)]">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/** جدول داخل بطاقة — يسمح بالتمرير الأفقي على الموبايل */
export function AdminTableCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("admin-table-wrap", className)}>{children}</div>;
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
    "inline-flex items-center gap-1.5 rounded-[var(--admin-radius,0.625rem)] px-2.5 py-1.5 text-xs font-semibold text-[var(--admin-primary,#1149b0)] hover:bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_10%,white)] transition-colors";

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
        className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius,0.625rem)] text-[var(--admin-muted,#5b6b82)] transition-colors hover:bg-[var(--admin-surface-muted,#eef1f6)] hover:text-[var(--admin-text,#152238)]"
        title="تحرير"
        aria-label="تحرير"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius,0.625rem)] text-[var(--admin-muted,#5b6b82)] transition-colors hover:bg-destructive/10 hover:text-destructive"
          title={deleteLabel}
          aria-label={deleteLabel}
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
    <div className="admin-card flex h-full flex-col p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--admin-text,#152238)]">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-[var(--admin-muted,#5b6b82)]" dir="ltr">
              {subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0 text-end">
          <div className="text-2xl font-bold tabular-nums leading-none" dir="ltr">
            {result.score}
          </div>
          <div className="text-[10px] text-[var(--admin-muted,#5b6b82)]" dir="ltr">
            / 100
          </div>
          <div className={cn("mt-1 text-xs font-medium", result.labelClassName)}>
            {result.label}
          </div>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--admin-surface-muted,#eef1f6)]">
        <div
          className={cn("h-full rounded-full transition-all", scoreBarColor(result.score))}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <ul className="mt-4 flex-1 space-y-1.5">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-xs leading-snug">
            <span className="shrink-0">{checkIcon(item.status)}</span>
            <span
              className={
                item.status === "pass"
                  ? "text-[var(--admin-text,#152238)]"
                  : "text-[var(--admin-muted,#5b6b82)]"
              }
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      {editTo && (
        <div className="mt-4 border-t border-[var(--admin-border,#dde3ec)] pt-3">
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
        isDefault ? "italic text-[var(--admin-muted,#5b6b82)]" : "text-[var(--admin-text,#152238)]/80",
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
            "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--admin-radius,0.625rem)] px-2 text-sm font-bold tabular-nums",
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
      <div className="h-1 w-full max-w-[5.5rem] overflow-hidden rounded-full bg-[var(--admin-surface-muted,#eef1f6)]">
        <div
          className={cn("h-full rounded-full", scoreBarColor(result.score))}
          style={{ width: `${result.score}%` }}
        />
      </div>
    </div>
  );
}
