import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import {
  AdminEmpty,
  AdminFetchingBar,
  AdminPageHeader,
  AdminStatusBadge,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { useAdminServices, useDeleteService } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/services")({
  component: AdminServicesList,
});

function AdminServicesList() {
  const isChild = useAdminChildRoute("/admin/services/$id");
  const { data = [], isFetching } = useAdminServices();
  const deleteService = useDeleteService();

  if (isChild) return <Outlet />;

  async function handleDelete(id: string, title: string) {
    if (!confirm(`حذف الخدمة "${title}"؟`)) return;
    await deleteService.mutateAsync(id);
  }

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="الخدمات"
        description="إدارة خدمات الموقع وترتيبها."
        actionTo="/admin/services/$id"
        actionParams={{ id: "new" }}
        actionLabel="خدمة جديدة"
      />

      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty message="لا توجد خدمات بعد." actionTo="/admin/services/$id" actionParams={{ id: "new" }} actionLabel="إضافة خدمة" />
      )}

      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="w-24">ترتيب</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.title}</TableCell>
                  <TableCell dir="ltr" className="text-muted-foreground text-xs">{s.slug}</TableCell>
                  <TableCell><AdminStatusBadge status={s.status} /></TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Link to="/admin/services/$id" params={{ id: s.id }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent">
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button type="button" onClick={() => handleDelete(s.id, s.title)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
