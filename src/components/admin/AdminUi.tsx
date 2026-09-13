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
import { useAdminI18n } from "@/providers/LocaleProvider";
import type { AdminMessages } from "@/lib/i18n/admin-messages";
import type { Locale } from "@/lib/i18n/locale";
import {
  checkIcon,
  evaluateStaticPageSeo,
  getSummaryChecks,
  type AdminSeoScoreInput,
  type SeoCheckItem,
} from "@/lib/seo/admin-seo-score";

function localizeSeoCheckLabel(
  item: SeoCheckItem,
  locale: Locale,
  a: AdminMessages,
  t: (template: string, vars?: Record<string, string | number>) => string,
): string {
  if (locale !== "en") return item.label;
  switch (item.id) {
    case "meta-title":
      return /ظ…ط®طµطµ|custom/i.test(item.label) ? a.seoCheckMetaTitleCustom : a.seoCheckMetaTitleDefault;
    case "meta-description":
      return /ظ…ط®طµطµ|custom/i.test(item.label) ? a.seoCheckMetaDescCustom : a.seoCheckMetaDescDefault;
    case "custom-meta":
      return a.seoCheckCustomMeta;
    case "keywords": {
      const m = item.label.match(/(\d+)\s*\/\s*(\d+)/);
      if (m) return t(a.seoCheckKeywordsPartial, { matched: m[1]!, total: m[2]! });
      return a.seoCheckKeywordsOk;
    }
    case "schema": {
      const listMatch = item.label.match(/\(([^)]+)\)|:\s*(.+)$/);
      const list = (listMatch?.[1] || listMatch?.[2] || "").trim();
      if (/ظ†ط§ظ‚طµ|missing/i.test(item.label)) return t(a.seoCheckSchemaMissing, { list });
      return t(a.seoCheckSchemaOk, { list });
    }
    case "canonical":
      return /ط؛ظٹط±|invalid/i.test(item.label) ? a.seoCheckCanonicalBad : a.seoCheckCanonicalOk;
    case "og-image":
      return /ظ…ط®طµطµ|custom/i.test(item.label) ? a.seoCheckOgCustom : a.seoCheckOgDefault;
    case "images":
      return /ظ…ط®طµطµ|custom/i.test(item.label) ? a.seoCheckAltCustom : a.seoCheckAltDefault;
    case "content": {
      const words = item.label.match(/~?\s*(\d+)/);
      const min = item.label.match(/(?:ط§ظ„ظ…ط·ظ„ظˆط¨|need)\s*(\d+)/i);
      if (words && min) return t(a.seoCheckContentShort, { words: words[1]!, min: min[1]! });
      return a.seoCheckContentOk;
    }
    default:
      return item.label;
  }
}

/* Shared admin UI co-exports hooks/helpers for DX â€” refresh boundary lives at route level. */
/* eslint-disable react-refresh/only-export-components */

export type AdminSectionTone = "blue" | "teal" | "violet" | "amber" | "emerald" | "rose" | "sky" | "slate";

function inferSectionTone(title: string): AdminSectionTone {
  const t = title.toLowerCase();
  if (/seo|ط³ظٹظˆ|meta/.test(t)) return "emerald";
  if (/طµظˆط±ط©|ط؛ظ„ط§ظپ|ظˆط³ط§ط¦ط·|avatar|ظ…ظٹط¯ظٹط§|image|cover|media|photo/.test(t)) return "violet";
  if (/طھطµظ†ظٹظپ|ظ†ط´ط±|ط¥ط¹ط¯ط§ط¯|طھط±طھظٹط¨|ط­ط§ظ„ط©|categor|publish|setting|order|status/.test(t)) return "amber";
  if (/ظ…ط­طھظˆظ‰|ظˆطµظپ|ط³ظٹط±ط©|ط§ظ‚طھط¨ط§ط³|ط³ط¤ط§ظ„|ط¥ط¬ط§ط¨ط©|ظ…ظٹط²ط§طھ|طھظپط§طµظٹظ„|طھط³ظ„ظٹظ…|content|bio|quote|question|feature|detail|deliver/.test(t))
    return "teal";
  if (/ط£ط³ط§ط³ظٹ|ط¹ظ†ظˆط§ظ†|ط®ط¯ظ…ط©|ظƒط§طھط¨|ط§ط³ظ…|ط¨ط§ظ‚ط©|ظ…ط´ط±ظˆط¹|ط±ط£ظٹ|ط¥ط­طµط§ط¦|basic|title|service|author|project|testimonial|stat/.test(t))
    return "blue";
  if (/ط²ط±|cta|ط±ط§ط¨ط·|link|button/.test(t)) return "sky";
  return "slate";
}

function inferSectionIcon(title: string, tone: AdminSectionTone): LucideIcon {
  const t = title.toLowerCase();
  if (/seo|ط³ظٹظˆ|meta/.test(t)) return Search;
  if (/طµظˆط±ط©|ط؛ظ„ط§ظپ|ظˆط³ط§ط¦ط·|avatar|image|cover|media|photo/.test(t)) return ImageIcon;
  if (/طھطµظ†ظٹظپ|ظ†ط´ط±|ط¥ط¹ط¯ط§ط¯|طھط±طھظٹط¨|ط­ط§ظ„ط©|categor|publish|setting|order|status/.test(t)) return Settings2;
  if (/ظ…ط­طھظˆظ‰|ظˆطµظپ|ط³ظٹط±ط©|ط§ظ‚طھط¨ط§ط³|ط³ط¤ط§ظ„|ظ…ظٹط²ط§طھ|طھظپط§طµظٹظ„|content|bio|quote|question|feature|detail/.test(t))
    return FileText;
  if (tone === "blue") return Sparkles;
  return LayoutList;
}

export function AdminPageHeader({
  title,
  description,
  backTo,
  backLabel,
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
  const { a } = useAdminI18n();
  const resolvedBack = backLabel ?? a.back;
  return (
    <div className="admin-page-hero mb-6 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        {backTo && (
          <Link
            to={backTo}
            className="mb-2 inline-flex min-h-10 items-center gap-1.5 text-sm text-[var(--admin-muted,#5c6785)] hover:text-[var(--admin-primary,#1149b0)]"
          >
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" /> {resolvedBack}
          </Link>
        )}
        <h1 className="text-xl font-bold tracking-tight text-[var(--admin-text,#111c36)] sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[var(--admin-muted,#5c6785)]">
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

/** ط¥ط°ط§ ظƒط§ظ† ظ…ط³ط§ط± $id ظ†ط´ط·ط§ظ‹ ظٹط¹ط±ط¶ ط§ظ„ظ†ظ…ظˆط°ط¬ ظپظ‚ط· */
export function useAdminChildRoute(from: string) {
  return useMatch({ from: from as never, shouldThrow: false });
}

export function AdminStatusBadge({ status }: { status: PublishStatus | string }) {
  const { a } = useAdminI18n();
  const map: Record<string, string> = {
    published: "bg-emerald-500/12 text-emerald-800 border-emerald-500/25",
    draft: "bg-amber-500/12 text-amber-800 border-amber-500/25",
    scheduled: "bg-sky-500/12 text-sky-800 border-sky-500/25",
    new: "bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_12%,white)] text-[var(--admin-primary,#1149b0)] border-[color-mix(in_srgb,var(--admin-primary,#1149b0)_25%,transparent)]",
    contacted: "bg-amber-500/12 text-amber-800 border-amber-500/25",
    closed: "bg-[var(--admin-surface-muted,#eef2f8)] text-[var(--admin-muted,#5c6785)] border-[var(--admin-border,#dce3ef)]",
    pending: "bg-amber-500/12 text-amber-800 border-amber-500/25",
    reviewed: "bg-sky-500/12 text-sky-800 border-sky-500/25",
    completed: "bg-emerald-500/12 text-emerald-800 border-emerald-500/25",
  };
  const labels: Record<string, string> = {
    published: a.statusPublished,
    draft: a.statusDraft,
    scheduled: a.statusScheduled,
    new: a.statusNew,
    contacted: a.statusContacted,
    closed: a.statusClosed,
    pending: a.statusPending,
    reviewed: a.statusReviewed,
    completed: a.statusCompleted,
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
      <label htmlFor={id} className="text-sm font-semibold text-[var(--admin-text,#111c36)]">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-[var(--admin-muted,#5c6785)]">{hint}</p>}
    </div>
  );
}

export function adminInputClass(extra = "") {
  return cn("admin-input", extra);
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("admin-card p-4 sm:p-5 md:p-6", className)}>{children}</div>;
}

/** ط¨ط·ط§ظ‚ط© ظ†ظ…ظˆط°ط¬ ظ…ظ„ظˆظ‘ظ†ط© ط¨ط£ظٹظ‚ظˆظ†ط© â€” ظ„ظ†ظ…ط§ط°ط¬ ط§ظ„ط¥ط¶ط§ظپط©/ط§ظ„طھط¹ط¯ظٹظ„ */
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
          <h2 className="text-sm font-bold text-[var(--admin-text,#111c36)]">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--admin-muted,#5c6785)]">
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
  const { a } = useAdminI18n();
  return (
    <div className="flex flex-col items-center gap-3 p-10 text-center text-sm text-[var(--admin-muted)]">
      <div className="admin-spinner" aria-hidden />
      {a.loading}
    </div>
  );
}

/** ط´ط±ظٹط· طھط­ظ…ظٹظ„ ط®ظپظٹظپ â€” ظ„ط§ ظٹط­ط¬ط¨ ط§ظ„طµظپط­ط© */
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
      <p className="text-sm text-[var(--admin-muted,#5c6785)]">{message}</p>
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
  deleteLabel,
}: {
  saving: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  const { a } = useAdminI18n();
  return (
    <div className="admin-form-actions-bar">
      <button type="submit" disabled={saving} className="admin-btn admin-btn-primary min-w-[7.5rem]">
        {saving ? a.saving : a.save}
      </button>
      {onDelete && (
        <button type="button" onClick={onDelete} className="admin-btn admin-btn-danger">
          {deleteLabel ?? a.delete}
        </button>
      )}
      <p className="ms-auto hidden text-xs text-[var(--admin-muted,#5c6785)] sm:block">
        {a.saveBeforeLeave}
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
  const { a, t } = useAdminI18n();
  const titleLen = metaTitle.length;
  const descLen = metaDescription.length;
  const titleHint =
    titleLen === 0
      ? a.metaTitleEmpty
      : titleLen >= 30 && titleLen <= 60
        ? t(a.metaTitleIdeal, { n: titleLen })
        : t(a.metaTitleHint, { n: titleLen });
  const descHint =
    descLen === 0
      ? a.metaDescEmpty
      : descLen >= 120 && descLen <= 160
        ? t(a.metaDescIdeal, { n: descLen })
        : t(a.metaDescHint, { n: descLen });

  return (
    <AdminCardSection
      title="SEO"
      description={a.seoDesc}
      tone="emerald"
      icon={Search}
    >
      {showSlug && (
        <AdminField label="Slug" id="slug" hint={a.slugHint}>
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
          placeholder={a.metaTitlePlaceholder}
        />
      </AdminField>
      <AdminField label="Meta Description" id="metaDescription" hint={descHint}>
        <textarea
          id="metaDescription"
          rows={4}
          value={metaDescription}
          onChange={(e) => onMetaDescription(e.target.value)}
          className={adminInputClass()}
          placeholder={a.metaDescPlaceholder}
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
  const { a } = useAdminI18n();
  return (
    <AdminField label={a.labelStatus} id="status">
      <select
        id="status"
        value={value}
        onChange={(e) => onChange(e.target.value as PublishStatus)}
        className={adminInputClass()}
      >
        <option value="published">{a.statusPublished}</option>
        <option value="draft">{a.statusDraft}</option>
        <option value="scheduled">{a.statusScheduled}</option>
      </select>
    </AdminField>
  );
}

/** ط؛ظ„ط§ظپ ظ‚ط³ظ… ط¯ط§ط®ظ„ طµظپط­ط© ط§ظ„ط£ط¯ظ…ظ† */
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
        <h2 className="text-base font-semibold text-[var(--admin-text,#111c36)]">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--admin-muted,#5c6785)]">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

/** ط¬ط¯ظˆظ„ ط¯ط§ط®ظ„ ط¨ط·ط§ظ‚ط© â€” ظٹط³ظ…ط­ ط¨ط§ظ„طھظ…ط±ظٹط± ط§ظ„ط£ظپظ‚ظٹ ط¹ظ„ظ‰ ط§ظ„ظ…ظˆط¨ط§ظٹظ„ */
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
  const { a } = useAdminI18n();
  const className =
    "inline-flex items-center gap-1.5 rounded-[var(--admin-radius)] px-2.5 py-1.5 text-xs font-semibold text-[var(--admin-primary,#1149b0)] hover:bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_10%,white)] transition-colors";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <Icon className="h-3.5 w-3.5" />
        {label ?? a.open}
      </a>
    );
  }

  if (!to) return null;

  return (
    <Link to={to} params={params} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {label ?? a.edit}
    </Link>
  );
}

export function AdminRowActions({
  editTo,
  editParams,
  onDelete,
  deleteLabel,
}: {
  editTo: string;
  editParams: Record<string, string>;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  const { a } = useAdminI18n();
  const resolvedDelete = deleteLabel ?? a.delete;
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        to={editTo}
        params={editParams}
        className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius)] text-[var(--admin-muted,#5c6785)] transition-colors hover:bg-[var(--admin-surface-muted,#eef2f8)] hover:text-[var(--admin-text,#111c36)]"
        title={a.edit}
        aria-label={a.edit}
      >
        <Pencil className="h-4 w-4" />
      </Link>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius)] text-[var(--admin-muted,#5c6785)] transition-colors hover:bg-destructive/10 hover:text-destructive"
          title={resolvedDelete}
          aria-label={resolvedDelete}
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

/** ظ„ظˆط­ط© طھظ‚ظٹظٹظ… SEO â€” ظ„ظ„ط¨ط·ط§ظ‚ط§طھ ط£ظˆ ط§ظ„ط¬ط¯ط§ظˆظ„ */
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
  const { a, t, locale } = useAdminI18n();
  const result = evaluateStaticPageSeo(input);
  const items = getSummaryChecks(result.checks).slice(0, 5);
  const gradeLabel =
    result.score >= 90
      ? a.seoGradeExcellent
      : result.score >= 70
        ? a.seoGradeGood
        : result.score >= 50
          ? a.seoGradeNeedsWork
          : a.seoGradePoor;

  return (
    <div className="admin-card flex h-full flex-col p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-[var(--admin-text,#111c36)]">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-[var(--admin-muted,#5c6785)]" dir="ltr">
              {subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0 text-end">
          <div className="text-2xl font-bold tabular-nums leading-none" dir="ltr">
            {result.score}
          </div>
          <div className="text-[10px] text-[var(--admin-muted,#5c6785)]" dir="ltr">
            / 100
          </div>
          <div className={cn("mt-1 text-xs font-medium", result.labelClassName)}>
            {gradeLabel}
          </div>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--admin-surface-muted,#eef2f8)]">
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
                  ? "text-[var(--admin-text,#111c36)]"
                  : "text-[var(--admin-muted,#5c6785)]"
              }
            >
              {localizeSeoCheckLabel(item, locale, a, t)}
            </span>
          </li>
        ))}
      </ul>

      {editTo && (
        <div className="mt-4 border-t border-[var(--admin-border,#dce3ef)] pt-3">
          <AdminActionLink to={editTo} params={editParams} label={a.editSeo} />
        </div>
      )}
    </div>
  );
}

/** ظ…ط¹ط§ظٹظ†ط© ظ†طµ SEO â€” ظٹط¯ط¹ظ… ط§ظ„ط¹ط±ط¨ظٹط© ظˆط§ظ„ط¥ظ†ط¬ظ„ظٹط²ظٹط© ط¨ط¯ظˆظ† ط¹ظƒط³ ط§ظ„ظƒظ„ظ…ط§طھ */
export function AdminMetaPreview({
  text,
  fallback,
}: {
  text?: string;
  fallback?: string;
}) {
  const { a } = useAdminI18n();
  const resolvedFallback = fallback ?? a.metaDefault;
  const value = text?.trim() || resolvedFallback;
  const isDefault = !text?.trim();
  return (
    <p
      className={cn(
        "text-xs leading-relaxed line-clamp-2 [unicode-bidi:plaintext]",
        isDefault ? "italic text-[var(--admin-muted,#5c6785)]" : "text-[var(--admin-text,#111c36)]/80",
      )}
      dir="auto"
      title={value}
    >
      {value}
    </p>
  );
}

/** ط´ط§ط±ط© طھظ‚ظٹظٹظ… SEO ظ…ط¯ظ…ط¬ط© â€” ظ„ظ„ط¬ط¯ط§ظˆظ„ */
export function AdminSeoScoreBadge(input: AdminSeoScoreInput) {
  const { a, t, locale } = useAdminI18n();
  const result = evaluateStaticPageSeo(input);
  const topIssue = getSummaryChecks(result.checks).find((c) => c.status !== "pass");
  const gradeLabel =
    result.score >= 90
      ? a.seoGradeExcellent
      : result.score >= 70
        ? a.seoGradeGood
        : result.score >= 50
          ? a.seoGradeNeedsWork
          : a.seoGradePoor;
  const topIssueLabel = topIssue ? localizeSeoCheckLabel(topIssue, locale, a, t) : undefined;

  return (
    <div
      className="inline-flex flex-col gap-1.5"
      title={topIssueLabel}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--admin-radius)] px-2 text-sm font-bold tabular-nums",
            result.score >= 90 && "bg-emerald-500/15 text-emerald-700",
            result.score >= 70 && result.score < 90 && "bg-emerald-500/10 text-emerald-600",
            result.score >= 50 && result.score < 70 && "bg-amber-500/15 text-amber-700",
            result.score < 50 && "bg-destructive/10 text-destructive",
          )}
          dir="ltr"
        >
          {result.score}
        </span>
        <span className={cn("text-xs font-medium", result.labelClassName)}>{gradeLabel}</span>
      </div>
      <div className="h-1 w-full max-w-[5.5rem] overflow-hidden rounded-full bg-[var(--admin-surface-muted,#eef2f8)]">
        <div
          className={cn("h-full rounded-full", scoreBarColor(result.score))}
          style={{ width: `${result.score}%` }}
        />
      </div>
    </div>
  );
}
