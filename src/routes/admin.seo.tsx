import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AdminCard,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminMetaPreview,
  AdminPageHeader,
  AdminRowActions,
  AdminSection,
  AdminSeoScorePanel,
  AdminStatusBadge,
  AdminTableCard,
  adminInputClass,
} from "@/components/admin/AdminUi";
import {
  useAdminBlogPosts,
  useAdminPages,
  useAdminServices,
  useAdminSiteSettings,
  useSaveSiteSettings,
} from "@/hooks/use-admin-cms";
import { SITE_NAME, SITE_LOGO_URL } from "@/lib/site-config";
import type { StaticPageSeoId } from "@/lib/seo/admin-seo-score";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/seo")({
  component: AdminSeoPage,
});

const STATIC_PAGES: Array<{ id: StaticPageSeoId; title: string; path: string; editId: string }> = [
  { id: "home", title: "الرئيسية", path: "/", editId: "home" },
  { id: "about", title: "من نحن", path: "/about", editId: "about" },
  { id: "contact", title: "تواصل", path: "/contact", editId: "contact" },
  { id: "services", title: "الخدمات", path: "/services", editId: "services" },
  { id: "portfolio", title: "أعمالنا", path: "/portfolio", editId: "portfolio" },
  { id: "blog", title: "المدونة", path: "/blog", editId: "blog" },
];

function AdminSeoPage() {
  const { data: services = [], isFetching: loadingServices } = useAdminServices();
  const { data: blogPosts = [], isFetching: loadingBlog } = useAdminBlogPosts();
  const { data: cmsPages = [], isFetching: loadingPages } = useAdminPages();
  const { data: settings, isFetching: loadingSettings } = useAdminSiteSettings();
  const save = useSaveSiteSettings();
  const [robotsTxt, setRobotsTxt] = useState("");

  useEffect(() => {
    if (settings?.robotsTxt !== undefined) setRobotsTxt(settings.robotsTxt);
  }, [settings]);

  const isFetching = loadingServices || loadingBlog || loadingPages || loadingSettings;

  async function handleRobotsSubmit(e: React.FormEvent) {
    e.preventDefault();
    await save.mutateAsync({
      siteName: settings?.siteName ?? SITE_NAME,
      tagline: settings?.tagline ?? "",
      logoUrl: settings?.logoUrl ?? SITE_LOGO_URL,
      faviconUrl: settings?.faviconUrl ?? SITE_LOGO_URL,
      contactEmail: settings?.contactEmail ?? "",
      contactPhone: settings?.contactPhone ?? "",
      whatsappNumber: settings?.whatsappNumber ?? "",
      address: settings?.address ?? "",
      socialLinks: settings?.socialLinks ?? {},
      integrations: settings?.integrations ?? {},
      robotsTxt,
      headerNav: settings?.headerNav ?? [],
      footerNav: settings?.footerNav ?? [],
    });
  }

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="SEO"
        description="تقييم شامل لعناوين الصفحات، الوصف، Schema، والصور."
      />

      <AdminFetchingBar show={isFetching} />

      <AdminSection
        title="تقييم صفحات الموقع"
        description="كل بطاقة تعرض النتيجة من 100 مع أهم النقاط التي تحتاج تحسين."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {STATIC_PAGES.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.editId || c.slug === p.editId);
            return (
              <AdminSeoScorePanel
                key={p.id}
                pageId={p.id}
                cms={cms}
                settings={settings}
                title={p.title}
                subtitle={p.path}
                editTo="/admin/pages/$id"
                editParams={{ id: p.editId }}
              />
            );
          })}
        </div>
      </AdminSection>

      <AdminSection title="الخدمات" description="حالة النشر وعناوين SEO للخدمات.">
        <AdminTableCard>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">العنوان</TableHead>
                <TableHead className="w-[40%]">Meta Title</TableHead>
                <TableHead className="w-[15%]">الحالة</TableHead>
                <TableHead className="w-[10%] text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground py-8 text-center">
                    لا توجد خدمات.
                  </TableCell>
                </TableRow>
              )}
              {services.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell className="align-top max-w-[14rem]">
                    <AdminMetaPreview text={s.metaTitle} fallback={s.title} />
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions editTo="/admin/services/$id" editParams={{ id: s.id }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableCard>
      </AdminSection>

      <AdminSection title="المقالات" description="حالة النشر وعناوين SEO للمدونة.">
        <AdminTableCard>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">العنوان</TableHead>
                <TableHead className="w-[40%]">Meta Title</TableHead>
                <TableHead className="w-[15%]">الحالة</TableHead>
                <TableHead className="w-[10%] text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-sm text-muted-foreground py-8 text-center">
                    لا توجد مقالات.
                  </TableCell>
                </TableRow>
              )}
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="align-top max-w-[14rem]">
                    <AdminMetaPreview text={post.metaTitle} fallback={post.title} />
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={post.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions editTo="/admin/blog/$id" editParams={{ id: post.id }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableCard>
      </AdminSection>

      <AdminSection title="robots.txt">
        <AdminCard>
          <form onSubmit={handleRobotsSubmit} className="space-y-4">
            <AdminField label="robots.txt" id="robots" hint="يُستخدم عند تفعيل SEO الديناميكي.">
              <textarea
                id="robots"
                dir="ltr"
                rows={6}
                value={robotsTxt}
                onChange={(e) => setRobotsTxt(e.target.value)}
                className={adminInputClass("text-start font-mono text-xs")}
                placeholder={"User-agent: *\nAllow: /"}
              />
            </AdminField>
            <AdminFormActions saving={save.isPending} />
          </form>
        </AdminCard>
      </AdminSection>

      <p className="text-xs text-muted-foreground">
        لتحرير Meta لصفحة معيّنة:{" "}
        <Link to="/admin/pages" className="text-primary hover:underline">
          الصفحات
        </Link>
      </p>
    </div>
  );
}
