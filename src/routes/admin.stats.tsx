import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  AdminEmpty,
  AdminFetchingBar,
  AdminPageHeader,
  AdminRowActions,
  AdminStatusBadge,
  AdminTableCard,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { useAdminSiteStats, useDeleteSiteStat } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/stats")({
  component: AdminStatsList,
});

function AdminStatsList() {
  const isChild = useAdminChildRoute("/admin/stats/$id");
  const { data = [], isFetching } = useAdminSiteStats();
  const del = useDeleteSiteStat();

  if (isChild) return <Outlet />;

  return (
    <div>
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
        <AdminTableCard>
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
                  <TableCell className="font-bold text-[var(--admin-primary)]">{s.value}</TableCell>
                  <TableCell className="font-medium">{s.label}</TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/stats/$id"
                      editParams={{ id: s.id }}
                      onDelete={() => confirm("حذف؟") && del.mutate(s.id)}
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
