import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ExternalLink, Pencil } from "lucide-react";
import {
  AdminActionLink,
  AdminFetchingBar,
  AdminMetaPreview,
  AdminPageHeader,
  AdminRowActions,
  AdminSection,
  AdminSeoScoreBadge,
  AdminStatusBadge,
  AdminTableCard,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { STATIC_PAGE_SEO } from "@/lib/seo";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { useAdminPages } from "@/hooks/use-admin-cms";
import type { StaticPageSeoId } from "@/lib/seo/admin-seo-score";
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

/** صفحات عامة ثابتة بدون تقييم SEO في لوحة التحكم */
const OTHER_SITE_PAGES: Array<{ title: string; path: string; slug: string }> = [
  { title: "الأسعار", path: "/pricing", slug: "pricing" },
  { title: "الخصوصية", path: "/privacy", slug: "privacy" },
  { title: "الشروط", path: "/terms", slug: "terms" },
  { title: "ملفات تعريف الارتباط", path: "/cookies", slug: "cookies" },
];

const KNOWN_SLUGS = new Set([
  ...STATIC_PAGES.map((p) => p.slug),
  ...OTHER_SITE_PAGES.map((p) => p.slug),
  ...SEO_LANDING_PAGES.map((p) => p.slug),
]);

export const Route = createFileRoute("/admin/pages")({
  component: AdminPagesList,
});

function AdminPagesList() {
  const isChild = useAdminChildRoute("/admin/pages/$id");
  const { data: cmsPages = [], isFetching } = useAdminPages();

  if (isChild) return <Outlet />;

  const extraPages = cmsPages.filter((p) => !KNOWN_SLUGS.has(p.slug) && !KNOWN_SLUGS.has(p.id));

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <AdminPageHeader
        title="الصفحات"
        description="كل المسارات العامة على الموقع. تحرير SEO من الأدمن متاح للصفحات الأساسية الستة؛ صفحات المدن والخدمات تُدار من الكود حالياً."
        actionTo="/admin/pages/$id"
        actionParams={{ id: "new" }}
        actionLabel="صفحة CMS جديدة"
      />

      <AdminFetchingBar show={isFetching} />

      <AdminSection
        title="صفحات الموقع"
        description="الصفحات الأساسية — مرّر الماوس على التقييم لرؤية أهم ملاحظة SEO."
      >
        <div className="space-y-3">
          {STATIC_PAGES.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.slug || c.slug === p.slug);

            return (
              <div
                key={p.id}
                className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{p.title}</h3>
                    <code
                      className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                      dir="ltr"
                    >
                      {p.path}
                    </code>
                    <AdminStatusBadge status={cms?.status ?? "published"} />
                  </div>
                  <AdminMetaPreview text={cms?.metaTitle} fallback={STATIC_PAGE_SEO[p.id].title} />
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-4 sm:gap-6">
                  <AdminSeoScoreBadge pageId={p.id} cms={cms} />
                  <div className="flex items-center gap-2">
                    <AdminActionLink href={p.path} label="عرض" icon={ExternalLink} />
                    <Link
                      to="/admin/pages/$id"
                      params={{ id: p.slug }}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تحرير SEO
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AdminSection>

      <AdminSection
        title="صفحات أخرى"
        description="الأسعار والصفحات القانونية — عرض على الموقع، وتحرير CMS إن وُجد مستند مطابق."
      >
        <div className="space-y-3">
          {OTHER_SITE_PAGES.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.slug || c.slug === p.slug);

            return (
              <div
                key={p.slug}
                className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{p.title}</h3>
                    <code
                      className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                      dir="ltr"
                    >
                      {p.path}
                    </code>
                    <AdminStatusBadge status={cms?.status ?? "published"} />
                  </div>
                  {cms?.metaTitle ? <AdminMetaPreview text={cms.metaTitle} /> : null}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <AdminActionLink href={p.path} label="عرض" icon={ExternalLink} />
                  {cms ? (
                    <Link
                      to="/admin/pages/$id"
                      params={{ id: cms.id }}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      تحرير
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </AdminSection>

      <AdminSection
        title="صفحات SEO / المدن"
        description={`${SEO_LANDING_PAGES.length} صفحة هبوط — المعاينة من الكود (landing-pages). التحرير من الأدمن غير متاح حالياً.`}
      >
        <div className="space-y-3">
          {SEO_LANDING_PAGES.map((p) => (
            <div
              key={p.slug}
              className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{p.title}</h3>
                  <code
                    className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                    dir="ltr"
                  >
                    {p.path}
                  </code>
                  <AdminStatusBadge status="published" />
                </div>
                <AdminMetaPreview text={p.metaTitle} />
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <AdminActionLink href={p.path} label="عرض" icon={ExternalLink} />
              </div>
            </div>
          ))}
        </div>
      </AdminSection>

      {extraPages.length > 0 && (
        <AdminSection
          title="صفحات CMS إضافية"
          description="صفحات ديناميكية غير مرتبطة بالمسارات الثابتة أعلاه."
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
                    <TableCell dir="ltr" className="text-xs text-muted-foreground">
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
        </AdminSection>
      )}

      <p className="text-xs text-muted-foreground">
        تقرير SEO مفصّل للصفحات الأساسية:{" "}
        <Link to="/admin/seo" className="text-primary hover:underline">
          قسم SEO
        </Link>
      </p>
    </div>
  );
}
