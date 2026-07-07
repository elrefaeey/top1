import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  AdminEmpty,
  AdminFetchingBar,
  AdminMetaPreview,
  AdminPageHeader,
  AdminRowActions,
  AdminStatusBadge,
  AdminTableCard,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { useAdminServices, useDeleteService } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/services")({
  component: AdminServicesList,
});

function AdminServicesList() {
  const isChild = useAdminChildRoute("/admin/services/$id");
  const { data = [], isFetching } = useAdminServices();
  const deleteService = useDeleteService();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="الخدمات"
        description="إدارة خدمات الموقع — العنوان، SEO، والترتيب."
        actionTo="/admin/services/$id"
        actionParams={{ id: "new" }}
        actionLabel="خدمة جديدة"
      />

      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا توجد خدمات بعد."
          actionTo="/admin/services/$id"
          actionParams={{ id: "new" }}
          actionLabel="إضافة خدمة"
        />
      )}

      {data.length > 0 && (
        <AdminTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[10rem]">العنوان</TableHead>
                <TableHead className="min-w-[8rem]">Slug</TableHead>
                <TableHead className="min-w-[12rem]">Meta Title</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>ترتيب</TableHead>
                <TableHead className="text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium align-top">{s.title}</TableCell>
                  <TableCell dir="ltr" className="align-top text-xs font-mono text-muted-foreground">
                    {s.slug}
                  </TableCell>
                  <TableCell className="align-top max-w-[14rem]">
                    <AdminMetaPreview
                      text={s.metaTitle}
                      fallback={s.title}
                    />
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground tabular-nums">{s.order}</TableCell>
                  <TableCell className="align-top">
                    <AdminRowActions
                      editTo="/admin/services/$id"
                      editParams={{ id: s.id }}
                      onDelete={() =>
                        confirm(`حذف الخدمة "${s.title}"؟`) && deleteService.mutate(s.id)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableCard>
      )}
    </div>
  );
}
