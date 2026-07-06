import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ExternalLink, Pencil } from "lucide-react";
import { AdminFetchingBar, AdminPageHeader, AdminStatusBadge, useAdminChildRoute } from "@/components/admin/AdminUi";
import { useAdminPages } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATIC_PAGES = [
  { id: "home", title: "الرئيسية", path: "/", slug: "home" },
  { id: "about", title: "من نحن", path: "/about", slug: "about" },
  { id: "contact", title: "تواصل", path: "/contact", slug: "contact" },
  { id: "services", title: "الخدمات", path: "/services", slug: "services" },
  { id: "portfolio", title: "أعمالنا", path: "/portfolio", slug: "portfolio" },
  { id: "blog", title: "المدونة", path: "/blog", slug: "blog" },
];

export const Route = createFileRoute("/admin/pages")({
  component: AdminPagesList,
});

function AdminPagesList() {
  const isChild = useAdminChildRoute("/admin/pages/$id");
  const { data: cmsPages = [], isFetching } = useAdminPages();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="الصفحات"
        description="صفحات الموقع وإعدادات SEO لكل صفحة."
        actionTo="/admin/pages/$id"
        actionParams={{ id: "new" }}
        actionLabel="صفحة CMS جديدة"
      />

      <h2 className="text-sm font-semibold mb-3">صفحات الموقع</h2>
      <div className="surface-card overflow-hidden mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصفحة</TableHead>
              <TableHead>المسار</TableHead>
              <TableHead className="w-28">عرض</TableHead>
              <TableHead className="w-28">SEO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {STATIC_PAGES.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell dir="ltr" className="text-muted-foreground text-xs">{p.path}</TableCell>
                <TableCell>
                  <a href={p.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> فتح
                  </a>
                </TableCell>
                <TableCell>
                  <Link to="/admin/pages/$id" params={{ id: p.slug }} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    <Pencil className="h-3 w-3" /> تحرير
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <h2 className="text-sm font-semibold mb-3">صفحات CMS (Firestore)</h2>
      <AdminFetchingBar show={isFetching} />
      {!isFetching && cmsPages.length === 0 && (
        <p className="text-sm text-muted-foreground surface-card p-5">لا توجد صفحات CMS إضافية. أنشئ صفحة لمحتوى ديناميكي.</p>
      )}
      {cmsPages.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>Slug</TableHead><TableHead>الحالة</TableHead><TableHead className="w-20" /></TableRow></TableHeader>
            <TableBody>
              {cmsPages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell dir="ltr" className="text-xs text-muted-foreground">{p.slug}</TableCell>
                  <TableCell><AdminStatusBadge status={p.status} /></TableCell>
                  <TableCell><Link to="/admin/pages/$id" params={{ id: p.id }} className="text-primary text-xs hover:underline">تحرير</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
