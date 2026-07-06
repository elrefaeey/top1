import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { AdminEmpty, AdminFetchingBar, AdminPageHeader, AdminStatusBadge, useAdminChildRoute } from "@/components/admin/AdminUi";
import { useAdminSiteStats, useDeleteSiteStat } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/stats")({
  component: AdminStatsList,
});

function AdminStatsList() {
  const isChild = useAdminChildRoute("/admin/stats/$id");
  const { data = [], isFetching } = useAdminSiteStats();
  const del = useDeleteSiteStat();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="الإحصائيات"
        description="أرقام قسم الإحصائيات في الصفحة الرئيسية."
        actionTo="/admin/stats/$id"
        actionParams={{ id: "new" }}
        actionLabel="إحصائية جديدة"
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا توجد إحصائيات."
          actionTo="/admin/stats/$id"
          actionParams={{ id: "new" }}
          actionLabel="إحصائية جديدة"
        />
      )}
      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold text-primary">{s.value}</TableCell>
                  <TableCell className="font-medium">{s.label}</TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell><AdminStatusBadge status={s.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link to="/admin/stats/$id" params={{ id: s.id }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent">
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => confirm("حذف؟") && del.mutate(s.id)}
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive"
                      >
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
