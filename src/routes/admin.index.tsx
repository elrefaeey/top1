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
} from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/providers/AuthProvider";
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
import type { BlogPost, Lead, WithId } from "@/types/cms";

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

const quickLinks = [
  { to: "/admin/leads", label: "الرسائل", icon: Inbox, desc: "استفسارات الزوار" },
  { to: "/admin/services", label: "الخدمات", icon: Briefcase, desc: "إدارة الخدمات" },
  { to: "/admin/blog", label: "المدونة", icon: BookOpen, desc: "المقالات وSEO" },
  { to: "/admin/portfolio", label: "أعمالنا", icon: Image, desc: "عرض المشاريع" },
  { to: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle, desc: "أسئلة وأجوبة" },
  { to: "/admin/pages", label: "الصفحات", icon: FileText, desc: "SEO الصفحات" },
  { to: "/admin/seo", label: "SEO", icon: Search, desc: "نظرة عامة SEO" },
];

type ActivityItem = {
  id: string;
  title: string;
  kind: string;
  at: string;
  to: "/admin/blog/$id" | "/admin/portfolio/$id" | "/admin/services/$id" | "/admin/testimonials/$id" | "/admin/faqs/$id" | "/admin/pages/$id";
  params: { id: string };
};

function parseTime(iso?: string): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function formatRelativeAr(iso: string): string {
  const t = parseTime(iso);
  if (!t) return "—";
  const diffMs = Date.now() - t;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} س`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `منذ ${days} ي`;
  try {
    return new Date(t).toLocaleDateString("ar", { year: "numeric", month: "short", day: "numeric" });
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

function buildRecentActivity(input: {
  blogPosts: WithId<BlogPost>[];
  portfolio: Array<{ id: string; title: string; updatedAt?: string }>;
  services: Array<{ id: string; title: string; updatedAt?: string }>;
  testimonials: Array<{ id: string; name: string; updatedAt?: string }>;
  faqs: Array<{ id: string; question: string; updatedAt?: string }>;
  cmsPages: Array<{ id: string; title: string; slug: string; updatedAt?: string }>;
}): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const p of input.blogPosts) {
    items.push({
      id: `blog-${p.id}`,
      title: p.title || p.id,
      kind: "مقال",
      at: p.updatedAt || p.publishedAt || p.createdAt || "",
      to: "/admin/blog/$id",
      params: { id: p.id },
    });
  }
  for (const p of input.portfolio) {
    items.push({
      id: `portfolio-${p.id}`,
      title: p.title || p.id,
      kind: "مشروع",
      at: p.updatedAt || "",
      to: "/admin/portfolio/$id",
      params: { id: p.id },
    });
  }
  for (const s of input.services) {
    items.push({
      id: `service-${s.id}`,
      title: s.title || s.id,
      kind: "خدمة",
      at: s.updatedAt || "",
      to: "/admin/services/$id",
      params: { id: s.id },
    });
  }
  for (const t of input.testimonials) {
    items.push({
      id: `testimonial-${t.id}`,
      title: t.name || t.id,
      kind: "رأي عميل",
      at: t.updatedAt || "",
      to: "/admin/testimonials/$id",
      params: { id: t.id },
    });
  }
  for (const f of input.faqs) {
    items.push({
      id: `faq-${f.id}`,
      title: f.question || f.id,
      kind: "سؤال شائع",
      at: f.updatedAt || "",
      to: "/admin/faqs/$id",
      params: { id: f.id },
    });
  }
  for (const p of input.cmsPages) {
    items.push({
      id: `page-${p.id}`,
      title: p.title || p.slug || p.id,
      kind: "صفحة",
      at: p.updatedAt || "",
      to: "/admin/pages/$id",
      params: { id: p.id },
    });
  }

  return items
    .filter((i) => parseTime(i.at) > 0)
    .sort((a, b) => parseTime(b.at) - parseTime(a.at))
    .slice(0, 8);
}

type AttentionItem = {
  id: string;
  label: string;
  detail: string;
  to: "/admin/leads" | "/admin/blog";
};

function buildAttentionItems(blogPosts: WithId<BlogPost>[], leads: WithId<Lead>[]): AttentionItem[] {
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
      label: "رسائل جديدة",
      detail: `${newLeads.length} رسالة بانتظار المتابعة`,
      to: "/admin/leads",
    });
  }
  if (drafts.length > 0) {
    items.push({
      id: "blog-drafts",
      label: "مسودات مقالات",
      detail: `${drafts.length} مقال بحالة مسودة`,
      to: "/admin/blog",
    });
  }
  if (missingImage.length > 0) {
    items.push({
      id: "blog-image",
      label: "مقالات بدون صورة غلاف",
      detail: `${missingImage.length} مقال`,
      to: "/admin/blog",
    });
  }
  if (missingAuthor.length > 0) {
    items.push({
      id: "blog-author",
      label: "مقالات بدون كاتب مرتبط",
      detail: `${missingAuthor.length} مقال بلا authorSlug`,
      to: "/admin/blog",
    });
  }
  if (missingSeo.length > 0) {
    items.push({
      id: "blog-seo",
      label: "مقالات ناقصة SEO",
      detail: `${missingSeo.length} مقال بلا عنوان أو وصف meta`,
      to: "/admin/blog",
    });
  }

  return items.slice(0, 6);
}

function AdminDashboard() {
  const { user, isAdmin } = useAuth();
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
      buildRecentActivity({
        blogPosts,
        portfolio,
        services,
        testimonials,
        faqs,
        cmsPages,
      }),
    [blogPosts, portfolio, services, testimonials, faqs, cmsPages],
  );

  const attentionItems = useMemo(
    () => buildAttentionItems(blogPosts, leads),
    [blogPosts, leads],
  );

  const stats = [
    { label: "الرسائل", value: leads.length, hint: `${newLeads.length} جديدة`, icon: Inbox },
    { label: "الصفحات", value: pagesCount, hint: "ثابتة + CMS + هبوط", icon: FileText },
    {
      label: "مقالات منشورة",
      value: publishedPosts.length,
      hint: draftPosts.length > 0 ? `${draftPosts.length} مسودة` : "لا مسودات",
      icon: BookOpen,
    },
    { label: "المسودات", value: draftPosts.length, hint: "حالة draft", icon: Pencil },
    { label: "الخدمات", value: services.length, icon: Briefcase },
    { label: "المشاريع", value: portfolio.length, icon: Image },
    { label: "آراء العملاء", value: testimonials.length, icon: MessageSquare },
    { label: "الأسئلة الشائعة", value: faqs.length, icon: HelpCircle },
  ];

  return (
    <div>
      <div className="mb-7">
        <span className="inline-flex rounded-md bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_10%,white)] px-2.5 py-1 text-xs font-semibold text-[var(--admin-primary,#1149b0)]">
          لوحة التحكم
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--admin-text,#152238)]">
          أهلاً بعودتك{user?.displayName ? `، ${user.displayName}` : ""}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--admin-muted,#5b6b82)]">
          أرقام حية من Firestore — مقالات، صفحات، ورسائل.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="admin-card p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--admin-muted,#5b6b82)]">{label}</span>
              <span className="grid h-8 w-8 place-items-center rounded-[var(--admin-radius,0.625rem)] bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_10%,white)] text-[var(--admin-primary,#1149b0)]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3 text-2xl font-bold tabular-nums text-[var(--admin-text,#152238)]">
              {value}
            </div>
            {hint ? (
              <p className="mt-1 text-[11px] text-[var(--admin-muted,#5b6b82)]">{hint}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <section className="admin-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text,#152238)]">
            <Clock className="h-4 w-4 text-[var(--admin-primary,#1149b0)]" />
            آخر المحتوى المحدَّث
          </h2>
          {recentActivity.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-muted,#5b6b82)]">لا يوجد نشاط حديث بعد.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--admin-border,#dde3ec)]">
              {recentActivity.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    params={item.params}
                    className="flex items-start justify-between gap-3 py-3 transition-colors hover:text-[var(--admin-primary,#1149b0)]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-[var(--admin-text,#152238)]">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-xs text-[var(--admin-muted,#5b6b82)]">
                        {item.kind}
                      </div>
                    </div>
                    <time className="shrink-0 text-[11px] tabular-nums text-[var(--admin-muted,#5b6b82)]">
                      {formatRelativeAr(item.at)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--admin-text,#152238)]">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            يحتاج انتباهك
          </h2>
          {attentionItems.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--admin-muted,#5b6b82)]">
              لا توجد تنبيهات واضحة حاليًا.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {attentionItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className="block rounded-[var(--admin-radius,0.625rem)] border border-[var(--admin-border,#dde3ec)] bg-[var(--admin-surface-muted,#eef1f6)] px-3 py-2.5 transition-colors hover:border-[color-mix(in_srgb,var(--admin-primary,#1149b0)_28%,var(--admin-border,#dde3ec))]"
                  >
                    <div className="text-sm font-medium text-[var(--admin-text,#152238)]">
                      {item.label}
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--admin-muted,#5b6b82)]">
                      {item.detail}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <h2 className="mb-4 text-sm font-semibold text-[var(--admin-text,#152238)]">إجراءات سريعة</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map(({ to, label, icon: Icon, desc }) => (
          <Link
            key={to}
            to={to}
            className="admin-card group p-5 transition-colors hover:border-[color-mix(in_srgb,var(--admin-primary,#1149b0)_30%,var(--admin-border,#dde3ec))]"
          >
            <span className="mb-3 grid h-9 w-9 place-items-center rounded-[var(--admin-radius,0.625rem)] bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_10%,white)] text-[var(--admin-primary,#1149b0)]">
              <Icon className="h-4 w-4" />
            </span>
            <div className="font-semibold text-[var(--admin-text,#152238)] transition-colors group-hover:text-[var(--admin-primary,#1149b0)]">
              {label}
            </div>
            <p className="mt-1 text-xs text-[var(--admin-muted,#5b6b82)]">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
