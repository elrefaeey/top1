import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Briefcase,
  BookOpen,
  Image,
  Inbox,
  HelpCircle,
  Search,
  MessageSquare,
  Pencil,
  Clock,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useAdminI18n } from "@/providers/LocaleProvider";
import {
  useAdminBlogPosts,
  useAdminFaqs,
  useAdminLeads,
  useAdminPages,
  useAdminPortfolio,
  useAdminServices,
  useAdminTestimonials,
} from "@/hooks/use-admin-cms";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import type { AdminMessages } from "@/lib/i18n/admin-messages";
import {
  localizeBlogPost,
  localizeFaq,
  localizePortfolio,
  localizeService,
  localizeTestimonial,
} from "@/lib/i18n/localize-cms";
import type { BlogPost, FaqItem, Lead, PortfolioItem, Service, Testimonial, WithId } from "@/types/cms";
import type { Locale } from "@/lib/i18n/locale";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

/** Same inventory as `/admin/pages` (static + legal + SEO landings). */
const LISTED_SITE_PAGE_SLUGS = [
  "home",
  "about",
  "contact",
  "services",
  "portfolio",
  "blog",
  "privacy",
  "terms",
] as const;

type ActivityItem = {
  id: string;
  title: string;
  kind: string;
  at: string;
  to:
    | "/admin/blog/$id"
    | "/admin/portfolio/$id"
    | "/admin/services/$id"
    | "/admin/testimonials/$id"
    | "/admin/faqs/$id"
    | "/admin/pages/$id";
  params: { id: string };
};

function parseTime(iso?: string): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function formatRelative(iso: string, a: AdminMessages, locale: Locale): string {
  const t = parseTime(iso);
  if (!t) return "—";
  const diffMs = Date.now() - t;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return a.relativeNow;
  if (mins < 60) return a.relativeMins.replace("{n}", String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return a.relativeHours.replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  if (days < 30) return a.relativeDays.replace("{n}", String(days));
  try {
    return new Date(t).toLocaleDateString(locale === "en" ? "en-GB" : "ar", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function countListedSitePages(cmsPages: Array<{ id: string; slug: string }>): number {
  const ids = new Set<string>([
    ...LISTED_SITE_PAGE_SLUGS,
    ...SEO_LANDING_PAGES.map((p) => p.slug),
  ]);
  for (const p of cmsPages) {
    const key = (p.slug || p.id || "").trim();
    if (key) ids.add(key);
  }
  return ids.size;
}

function buildRecentActivity(
  input: {
    blogPosts: WithId<BlogPost>[];
    portfolio: WithId<PortfolioItem>[];
    services: WithId<Service>[];
    testimonials: WithId<Testimonial>[];
    faqs: WithId<FaqItem>[];
    cmsPages: Array<{ id: string; title: string; slug: string; updatedAt?: string }>;
  },
  a: AdminMessages,
  locale: Locale,
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const p of input.blogPosts) {
    const localized = localizeBlogPost(p, locale);
    items.push({
      id: `blog-${p.id}`,
      title: localized.title || p.id,
      kind: a.kindPost,
      at: p.updatedAt || p.publishedAt || p.createdAt || "",
      to: "/admin/blog/$id",
      params: { id: p.id },
    });
  }
  for (const p of input.portfolio) {
    const localized = localizePortfolio(p, locale);
    items.push({
      id: `portfolio-${p.id}`,
      title: localized.title || p.id,
      kind: a.kindProject,
      at: p.updatedAt || "",
      to: "/admin/portfolio/$id",
      params: { id: p.id },
    });
  }
  for (const s of input.services) {
    const localized = localizeService(s, locale);
    items.push({
      id: `service-${s.id}`,
      title: localized.title || s.id,
      kind: a.kindService,
      at: s.updatedAt || "",
      to: "/admin/services/$id",
      params: { id: s.id },
    });
  }
  for (const t of input.testimonials) {
    const localized = localizeTestimonial(t, locale);
    items.push({
      id: `testimonial-${t.id}`,
      title: localized.name || t.id,
      kind: a.kindTestimonial,
      at: t.updatedAt || "",
      to: "/admin/testimonials/$id",
      params: { id: t.id },
    });
  }
  for (const f of input.faqs) {
    const localized = localizeFaq(f, locale);
    items.push({
      id: `faq-${f.id}`,
      title: localized.question || f.id,
      kind: a.kindFaq,
      at: f.updatedAt || "",
      to: "/admin/faqs/$id",
      params: { id: f.id },
    });
  }
  for (const p of input.cmsPages) {
    items.push({
      id: `page-${p.id}`,
      title: p.title || p.slug || p.id,
      kind: a.kindPage,
      at: p.updatedAt || "",
      to: "/admin/pages/$id",
      params: { id: p.id },
    });
  }

  return items
    .filter((i) => parseTime(i.at) > 0)
    .sort((x, y) => parseTime(y.at) - parseTime(x.at))
    .slice(0, 8);
}

type AttentionItem = {
  id: string;
  label: string;
  detail: string;
  to: "/admin/leads" | "/admin/blog";
};

function buildAttentionItems(
  blogPosts: WithId<BlogPost>[],
  leads: WithId<Lead>[],
  a: AdminMessages,
  t: (template: string, vars?: Record<string, string | number>) => string,
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const drafts = blogPosts.filter((p) => p.status === "draft");
  const missingImage = blogPosts.filter((p) => !p.featuredImage?.trim());
  const missingAuthor = blogPosts.filter((p) => !p.authorSlug?.trim());
  const missingSeo = blogPosts.filter(
    (p) => !p.metaTitle?.trim() || !p.metaDescription?.trim(),
  );
  const newLeads = leads.filter((l) => l.status === "new");

  if (newLeads.length > 0) {
    items.push({
      id: "leads-new",
      label: a.attnNewLeads,
      detail: t(a.attnNewLeadsDetail, { n: newLeads.length }),
      to: "/admin/leads",
    });
  }
  if (drafts.length > 0) {
    items.push({
      id: "blog-drafts",
      label: a.attnDrafts,
      detail: t(a.attnDraftsDetail, { n: drafts.length }),
      to: "/admin/blog",
    });
  }
  if (missingImage.length > 0) {
    items.push({
      id: "blog-image",
      label: a.attnNoImage,
      detail: t(a.attnNoImageDetail, { n: missingImage.length }),
      to: "/admin/blog",
    });
  }
  if (missingAuthor.length > 0) {
    items.push({
      id: "blog-author",
      label: a.attnNoAuthor,
      detail: t(a.attnNoAuthorDetail, { n: missingAuthor.length }),
      to: "/admin/blog",
    });
  }
  if (missingSeo.length > 0) {
    items.push({
      id: "blog-seo",
      label: a.attnSeo,
      detail: t(a.attnSeoDetail, { n: missingSeo.length }),
      to: "/admin/blog",
    });
  }

  return items.slice(0, 6);
}

function AdminDashboard() {
  const { user } = useAuth();
  const { a, t, locale } = useAdminI18n();
  const { data: blogPosts = [] } = useAdminBlogPosts();
  const { data: services = [] } = useAdminServices();
  const { data: portfolio = [] } = useAdminPortfolio();
  const { data: testimonials = [] } = useAdminTestimonials();
  const { data: faqs = [] } = useAdminFaqs();
  const { data: leads = [] } = useAdminLeads();
  const { data: cmsPages = [] } = useAdminPages();

  const publishedPosts = useMemo(
    () => blogPosts.filter((p) => p.status === "published"),
    [blogPosts],
  );
  const draftPosts = useMemo(
    () => blogPosts.filter((p) => p.status === "draft"),
    [blogPosts],
  );
  const newLeads = useMemo(() => leads.filter((l) => l.status === "new"), [leads]);
  const pagesCount = useMemo(() => countListedSitePages(cmsPages), [cmsPages]);

  const recentActivity = useMemo(
    () =>
      buildRecentActivity(
        {
          blogPosts,
          portfolio,
          services,
          testimonials,
          faqs,
          cmsPages,
        },
        a,
        locale,
      ),
    [blogPosts, portfolio, services, testimonials, faqs, cmsPages, a, locale],
  );

  const attentionItems = useMemo(
    () => buildAttentionItems(blogPosts, leads, a, t),
    [blogPosts, leads, a, t],
  );

  const todayLabel = useMemo(() => {
    try {
      return new Date().toLocaleDateString(locale === "en" ? "en-GB" : "ar", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }, [locale]);

  const stats: Array<{
    label: string;
    value: number;
    hint?: string;
    icon: LucideIcon;
    tone: string;
  }> = [
    {
      label: a.leads,
      value: leads.length,
      hint: t(a.newCount, { n: newLeads.length }),
      icon: Inbox,
      tone: "sky",
    },
    { label: a.pages, value: pagesCount, hint: a.pagesHint, icon: FileText, tone: "blue" },
    {
      label: a.publishedPosts,
      value: publishedPosts.length,
      hint: draftPosts.length > 0 ? t(a.draftsHint, { n: draftPosts.length }) : a.noDrafts,
      icon: BookOpen,
      tone: "emerald",
    },
    { label: a.drafts, value: draftPosts.length, hint: a.draftStatus, icon: Pencil, tone: "amber" },
    { label: a.services, value: services.length, icon: Briefcase, tone: "violet" },
    { label: a.projects, value: portfolio.length, icon: Image, tone: "teal" },
    { label: a.testimonials, value: testimonials.length, icon: MessageSquare, tone: "rose" },
    { label: a.faqs, value: faqs.length, icon: HelpCircle, tone: "slate" },
  ];

  const quickLinks = [
    { to: "/admin/leads", label: a.leads, icon: Inbox, desc: a.qLeads },
    { to: "/admin/services", label: a.services, icon: Briefcase, desc: a.qServices },
    { to: "/admin/blog", label: a.blog, icon: BookOpen, desc: a.qBlog },
    { to: "/admin/portfolio", label: a.portfolio, icon: Image, desc: a.qPortfolio },
    { to: "/admin/faqs", label: a.faqs, icon: HelpCircle, desc: a.qFaqs },
    { to: "/admin/pages", label: a.pages, icon: FileText, desc: a.qPages },
    { to: "/admin/seo", label: a.seo, icon: Search, desc: a.qSeo },
  ] as const;

  return (
    <div>
      <div className="admin-page-hero mb-7">
        <span className="inline-flex rounded-md bg-[color-mix(in_srgb,var(--admin-primary)_12%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--admin-primary)]">
          {a.panel}
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--admin-text)]">
          {user?.displayName
            ? t(a.welcomeBackNamed, { name: user.displayName })
            : a.welcomeBack}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--admin-muted)]">
          {todayLabel ? t(a.dateStats, { date: todayLabel }) : a.liveStats}
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon, tone }) => (
          <div key={label} className="admin-card admin-kpi p-4 sm:p-5" data-tone={tone}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--admin-muted)]">{label}</span>
              <span className="admin-kpi-icon">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tabular-nums text-[var(--admin-text)]">
              {value}
            </div>
            {hint ? (
              <p className="mt-1 text-[11px] text-[var(--admin-muted)]">{hint}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <section className="admin-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text)]">
            <Clock className="h-4 w-4 text-[var(--admin-primary)]" />
            {a.recentContent}
          </h2>
          {recentActivity.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-muted)]">{a.noRecent}</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--admin-border)]">
              {recentActivity.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    params={item.params}
                    className="flex items-start justify-between gap-3 py-3 transition-colors hover:text-[var(--admin-primary)]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--admin-text)]">
                        {item.title}
                      </div>
                      <span className="admin-kind-pill mt-1">{item.kind}</span>
                    </div>
                    <time className="shrink-0 text-[11px] tabular-nums text-[var(--admin-muted)]">
                      {formatRelative(item.at, a, locale)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text)]">
            <AlertTriangle className="h-4 w-4 text-[var(--admin-warning)]" />
            {a.needsAttention}
          </h2>
          {attentionItems.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-muted)]">{a.noAlerts}</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {attentionItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className="block rounded-[var(--admin-radius)] border border-[color-mix(in_srgb,var(--admin-warning)_22%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-warning)_8%,var(--admin-surface))] px-3 py-2.5 transition-colors hover:border-[color-mix(in_srgb,var(--admin-warning)_40%,var(--admin-border))]"
                  >
                    <div className="text-sm font-medium text-[var(--admin-text)]">{item.label}</div>
                    <div className="mt-0.5 text-xs text-[var(--admin-muted)]">{item.detail}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <h2 className="mb-4 text-sm font-semibold text-[var(--admin-text)]">{a.quickActions}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, label, icon: Icon, desc }) => (
          <Link key={to} to={to} className="admin-card admin-card-interactive group p-5">
            <span className="admin-kpi-icon mb-3">
              <Icon className="h-4 w-4" />
            </span>
            <div className="font-semibold text-[var(--admin-text)] transition-colors group-hover:text-[var(--admin-primary)]">
              {label}
            </div>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
