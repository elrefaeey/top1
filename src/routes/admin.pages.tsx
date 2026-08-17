import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ExternalLink, FileText, MapPin, Pencil, Scale, Sparkles } from "lucide-react";
import {
  AdminActionLink,
  AdminCardSection,
  AdminFetchingBar,
  AdminMetaPreview,
  AdminPageHeader,
  AdminRowActions,
  AdminSeoScoreBadge,
  AdminStatusBadge,
  AdminTableCard,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { STATIC_PAGE_SEO } from "@/lib/seo";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { useAdminPages } from "@/hooks/use-admin-cms";
import type { StaticPageSeoId } from "@/lib/seo/admin-seo-score";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATIC_PAGES: Array<{
  id: StaticPageSeoId;
  title: string;
  path: string;
  slug: string;
}> = [
  { id: "home", title: "الرئيسية", path: "/", slug: "home" },
  { id: "about", title: "من نحن", path: "/about", slug: "about" },
  { id: "contact", title: "تواصل", path: "/contact", slug: "contact" },
  { id: "services", title: "الخدمات", path: "/services", slug: "services" },
  { id: "portfolio", title: "أعمالنا", path: "/portfolio", slug: "portfolio" },
  { id: "blog", title: "المدونة", path: "/blog", slug: "blog" },
];

const OTHER_SITE_PAGES: Array<{ title: string; path: string; slug: string }> = [
  { title: "الخصوصية", path: "/privacy", slug: "privacy" },
  { title: "الشروط", path: "/terms", slug: "terms" },
];

const KNOWN_SLUGS = new Set([
  ...STATIC_PAGES.map((p) => p.slug),
  ...OTHER_SITE_PAGES.map((p) => p.slug),
  ...SEO_LANDING_PAGES.map((p) => p.slug),
]);

export const Route = createFileRoute("/admin/pages")({
  component: AdminPagesList,
});

function PagePathBadge({ path }: { path: string }) {
  return (
    <code
      className="rounded-md border border-[var(--admin-border,#dde3ec)] bg-[var(--admin-surface-muted,#eef1f6)] px-2 py-0.5 text-[11px] font-medium text-[var(--admin-muted,#5b6b82)]"
      dir="ltr"
    >
      {path}
    </code>
  );
}

function PageListCard({
  title,
  path,
  status,
  meta,
  metaFallback,
  score,
  actions,
  accent = "blue",
}: {
  title: string;
  path: string;
  status: string;
  meta?: string;
  metaFallback?: string;
  score?: ReactNode;
  actions: ReactNode;
  accent?: "blue" | "teal" | "amber" | "violet";
}) {
  const accentBar =
    accent === "teal"
      ? "from-teal-500/80 to-teal-400/20"
      : accent === "amber"
        ? "from-amber-500/80 to-amber-400/20"
        : accent === "violet"
          ? "from-violet-500/80 to-violet-400/20"
          : "from-[var(--admin-primary,#1149b0)]/80 to-[var(--admin-primary,#1149b0)]/15";

  return (
    <div className="admin-card relative overflow-hidden p-4 sm:p-5">
      <div
        className={cn("absolute inset-y-0 start-0 w-1 bg-gradient-to-b", accentBar)}
        aria-hidden
      />
      <div className="flex flex-col gap-4 ps-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--admin-text,#152238)]">{title}</h3>
            <PagePathBadge path={path} />
            <AdminStatusBadge status={status} />
          </div>
          {meta !== undefined || metaFallback ? (
            <AdminMetaPreview text={meta} fallback={metaFallback} />
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-5">
          {score}
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </div>
    </div>
  );
}

function AdminPagesList() {
  const isChild = useAdminChildRoute("/admin/pages/$id");
  const { data: cmsPages = [], isFetching } = useAdminPages();

  if (isChild) return <Outlet />;

  const extraPages = cmsPages.filter((p) => !KNOWN_SLUGS.has(p.slug) && !KNOWN_SLUGS.has(p.id));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="الصفحات"
        description="إدارة صفحات الموقع وبيانات SEO. الصفحات الأساسية قابلة للتحرير من هنا؛ صفحات المدن تُعرض للمعاينة فقط."
        actionTo="/admin/pages/$id"
        actionParams={{ id: "new" }}
        actionLabel="صفحة CMS جديدة"
      />

      <AdminFetchingBar show={isFetching} />

      <AdminCardSection
        title="صفحات الموقع الأساسية"
        description="الستة الرئيسية — مرّر على درجة SEO لرؤية أهم ملاحظة."
        tone="blue"
        icon={FileText}
      >
        <div className="space-y-3">
          {STATIC_PAGES.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.slug || c.slug === p.slug);
            return (
              <PageListCard
                key={p.id}
                title={p.title}
                path={p.path}
                status={cms?.status ?? "published"}
                meta={cms?.metaTitle}
                metaFallback={STATIC_PAGE_SEO[p.id].title}
                score={<AdminSeoScoreBadge pageId={p.id} cms={cms} />}
                accent="blue"
                actions={
                  <>
                    <AdminActionLink href={p.path} label="عرض" icon={ExternalLink} />
                    <Link
                      to="/admin/pages/$id"
                      params={{ id: p.slug }}
                      className="admin-btn admin-btn-primary admin-btn-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تحرير SEO
                    </Link>
                  </>
                }
              />
            );
          })}
        </div>
      </AdminCardSection>

      <AdminCardSection
        title="صفحات أخرى"
        description="الصفحات القانونية — عرض على الموقع، وتحرير CMS إن وُجد."
        tone="amber"
        icon={Scale}
      >
        <div className="space-y-3">
          {OTHER_SITE_PAGES.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.slug || c.slug === p.slug);
            return (
              <PageListCard
                key={p.slug}
                title={p.title}
                path={p.path}
                status={cms?.status ?? "published"}
                meta={cms?.metaTitle}
                accent="amber"
                actions={
                  <>
                    <AdminActionLink href={p.path} label="عرض" icon={ExternalLink} />
                    {cms ? (
                      <Link
                        to="/admin/pages/$id"
                        params={{ id: cms.id }}
                        className="admin-btn admin-btn-primary admin-btn-sm"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        تحرير
                      </Link>
                    ) : null}
                  </>
                }
              />
            );
          })}
        </div>
      </AdminCardSection>

      <AdminCardSection
        title="صفحات SEO / المدن"
        description={`${SEO_LANDING_PAGES.length} صفحة هبوط من الكود — المعاينة متاحة، والتحرير من الأدمن غير متاح حالياً.`}
        tone="teal"
        icon={MapPin}
      >
        <div className="space-y-3">
          {SEO_LANDING_PAGES.map((p) => (
            <PageListCard
              key={p.slug}
              title={p.title}
              path={p.path}
              status="published"
              meta={p.metaTitle}
              accent="teal"
              actions={<AdminActionLink href={p.path} label="عرض" icon={ExternalLink} />}
            />
          ))}
        </div>
      </AdminCardSection>

      {extraPages.length > 0 && (
        <AdminCardSection
          title="صفحات CMS إضافية"
          description="صفحات ديناميكية غير مرتبطة بالمسارات الثابتة أعلاه."
          tone="violet"
          icon={Sparkles}
        >
          <AdminTableCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-end">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extraPages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell dir="ltr" className="text-xs text-[var(--admin-muted,#5b6b82)]">
                      {p.slug}
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={p.status} />
                    </TableCell>
                    <TableCell>
                      <AdminRowActions editTo="/admin/pages/$id" editParams={{ id: p.id }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminTableCard>
        </AdminCardSection>
      )}

      <div className="admin-card flex flex-wrap items-center justify-between gap-3 border-[color-mix(in_srgb,var(--admin-primary,#1149b0)_18%,var(--admin-border,#dde3ec))] bg-[color-mix(in_srgb,var(--admin-primary,#1149b0)_5%,white)] p-4">
        <p className="text-sm text-[var(--admin-muted,#5b6b82)]">
          تقرير SEO مفصّل للصفحات الأساسية متاح في قسم SEO.
        </p>
        <Link to="/admin/seo" className="admin-btn admin-btn-ghost admin-btn-sm">
          فتح قسم SEO
        </Link>
      </div>
    </div>
  );
}
