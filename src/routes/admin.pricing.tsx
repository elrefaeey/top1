import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { AdminEmpty, AdminFetchingBar, AdminPageHeader, AdminStatusBadge, useAdminChildRoute } from "@/components/admin/AdminUi";
import { useAdminPricing, useDeletePricingPlan } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/pricing")({
  component: AdminPricingList,
});

function AdminPricingList() {
  const isChild = useAdminChildRoute("/admin/pricing/$id");
  const { data = [], isFetching } = useAdminPricing();
  const del = useDeletePricingPlan();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader title="الأسعار" description="باقات التسعير." actionTo="/admin/pricing/$id" actionParams={{ id: "new" }} actionLabel="باقة جديدة" />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && <AdminEmpty message="لا توجد باقات." actionTo="/admin/pricing/$id" actionParams={{ id: "new" }} actionLabel="باقة جديدة" />}
      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>السعر</TableHead><TableHead>الحالة</TableHead><TableHead className="w-28" /></TableRow></TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell dir="ltr">{p.price} {p.period}</TableCell>
                  <TableCell><AdminStatusBadge status={p.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link to="/admin/pricing/$id" params={{ id: p.id }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></Link>
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
