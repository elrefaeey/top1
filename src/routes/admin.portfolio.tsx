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
import { useAdminPortfolio, useDeletePortfolioItem } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/portfolio")({
  component: AdminPortfolioList,
});

function AdminPortfolioList() {
  const isChild = useAdminChildRoute("/admin/portfolio/$id");
  const { data = [], isFetching } = useAdminPortfolio();
  const del = useDeletePortfolioItem();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="أعمالنا"
        description="إدارة مشاريع Portfolio."
        actionTo="/admin/portfolio/$id"
        actionParams={{ id: "new" }}
        actionLabel="مشروع جديد"
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا توجد مشاريع."
          actionTo="/admin/portfolio/$id"
          actionParams={{ id: "new" }}
          actionLabel="إضافة مشروع"
        />
      )}
      {data.length > 0 && (
        <AdminTableCard>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">العنوان</TableHead>
                <TableHead className="w-[25%]">التصنيف</TableHead>
                <TableHead className="w-[15%]">الحالة</TableHead>
                <TableHead className="w-[20%] text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/portfolio/$id"
                      editParams={{ id: p.id }}
                      onDelete={() => confirm("حذف هذا المشروع؟") && del.mutate(p.id)}
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
