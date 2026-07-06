import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { AdminEmpty, AdminFetchingBar, AdminPageHeader, AdminStatusBadge, useAdminChildRoute } from "@/components/admin/AdminUi";
import { useAdminPortfolio, useDeletePortfolioItem } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <AdminPageHeader title="أعمالنا" description="إدارة مشاريع Portfolio." actionTo="/admin/portfolio/$id" actionParams={{ id: "new" }} actionLabel="مشروع جديد" />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && <AdminEmpty message="لا توجد مشاريع." actionTo="/admin/portfolio/$id" actionParams={{ id: "new" }} actionLabel="إضافة مشروع" />}
      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>التصنيف</TableHead><TableHead>الحالة</TableHead><TableHead className="w-28" /></TableRow></TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell><AdminStatusBadge status={p.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link to="/admin/portfolio/$id" params={{ id: p.id }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></Link>
                      <button type="button" onClick={() => confirm("حذف؟") && del.mutate(p.id)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
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
