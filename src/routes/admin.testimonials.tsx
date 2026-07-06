import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { AdminEmpty, AdminFetchingBar, AdminPageHeader, AdminStatusBadge, useAdminChildRoute } from "@/components/admin/AdminUi";
import { useAdminTestimonials, useDeleteTestimonial } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsList,
});

function AdminTestimonialsList() {
  const isChild = useAdminChildRoute("/admin/testimonials/$id");
  const { data = [], isFetching } = useAdminTestimonials();
  const del = useDeleteTestimonial();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader title="آراء العملاء" description="شهادات العملاء." actionTo="/admin/testimonials/$id" actionParams={{ id: "new" }} actionLabel="رأي جديد" />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && <AdminEmpty message="لا توجد آراء." actionTo="/admin/testimonials/$id" actionParams={{ id: "new" }} actionLabel="إضافة رأي" />}
      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>الاسم</TableHead><TableHead>الشركة</TableHead><TableHead>الحالة</TableHead><TableHead className="w-28" /></TableRow></TableHeader>
            <TableBody>
              {data.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{t.company}</TableCell>
                  <TableCell><AdminStatusBadge status={t.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link to="/admin/testimonials/$id" params={{ id: t.id }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></Link>
                      <button type="button" onClick={() => confirm("حذف؟") && del.mutate(t.id)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
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
