import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import {
  AdminCard,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminStatusBadge,
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

const STATIC_PAGES = [
  { id: "home", title: "الرئيسية", editId: "home" },
  { id: "about", title: "من نحن", editId: "about" },
  { id: "contact", title: "تواصل", editId: "contact" },
  { id: "services", title: "الخدمات", editId: "services" },
  { id: "portfolio", title: "أعمالنا", editId: "portfolio" },
  { id: "blog", title: "المدونة", editId: "blog" },
];

function seoScore(title?: string, desc?: string) {
  if (!title && !desc) return { label: "ناقص", className: "text-destructive" };
  if (title && desc && title.length <= 60 && desc.length <= 160) {
    return { label: "جيد", className: "text-emerald-600" };
  }
  return { label: "يحتاج تحسين", className: "text-amber-600" };
}

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
        description="نظرة عامة على عناوين ووصف الصفحات والمحتوى."
      />

      <AdminFetchingBar show={isFetching} />

      <>
          <h2 className="text-sm font-semibold mb-3">صفحات الموقع</h2>
          <div className="surface-card overflow-hidden mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الصفحة</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>Meta Description</TableHead>
                  <TableHead className="w-24">الحالة</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {STATIC_PAGES.map((p) => {
                  const cms = cmsPages.find((c) => c.id === p.editId || c.slug === p.editId);
                  const score = seoScore(cms?.metaTitle, cms?.metaDescription);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate" dir="ltr">
                        {cms?.metaTitle || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">
                        {cms?.metaDescription || "—"}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${score.className}`}>{score.label}</span>
                      </TableCell>
                      <TableCell>
                        <Link
                          to="/admin/pages/$id"
                          params={{ id: p.editId }}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Pencil className="h-3 w-3" /> تحرير
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <h2 className="text-sm font-semibold mb-3">الخدمات</h2>
          <div className="surface-card overflow-hidden mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-muted-foreground">
                      لا توجد خدمات. استورد المحتوى من لوحة التحكم.
                    </TableCell>
                  </TableRow>
                )}
                {services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]" dir="ltr">
                      {s.metaTitle || "—"}
                    </TableCell>
                    <TableCell><AdminStatusBadge status={s.status} /></TableCell>
                    <TableCell>
                      <Link to="/admin/services/$id" params={{ id: s.id }} className="text-xs text-primary hover:underline">
                        تحرير
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="text-sm font-semibold mb-3">المقالات</h2>
          <div className="surface-card overflow-hidden mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>Meta Title</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-muted-foreground">
                      لا توجد مقالات.
                    </TableCell>
                  </TableRow>
                )}
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]" dir="ltr">
                      {post.metaTitle || "—"}
                    </TableCell>
                    <TableCell><AdminStatusBadge status={post.status} /></TableCell>
                    <TableCell>
                      <Link to="/admin/blog/$id" params={{ id: post.id }} className="text-xs text-primary hover:underline">
                        تحرير
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
        </>
    </div>
  );
}
