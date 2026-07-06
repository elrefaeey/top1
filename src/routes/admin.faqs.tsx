import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { AdminEmpty, AdminFetchingBar, AdminPageHeader, AdminStatusBadge, useAdminChildRoute } from "@/components/admin/AdminUi";
import { useAdminFaqs, useDeleteFaq } from "@/hooks/use-admin-cms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqsList,
});

function AdminFaqsList() {
  const isChild = useAdminChildRoute("/admin/faqs/$id");
  const { data = [], isFetching } = useAdminFaqs();
  const del = useDeleteFaq();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader title="الأسئلة الشائعة" description="FAQ في الصفحة الرئيسية." actionTo="/admin/faqs/$id" actionParams={{ id: "new" }} actionLabel="سؤال جديد" />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && <AdminEmpty message="لا توجد أسئلة." actionTo="/admin/faqs/$id" actionParams={{ id: "new" }} actionLabel="سؤال جديد" />}
      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader><TableRow><TableHead>السؤال</TableHead><TableHead>الحالة</TableHead><TableHead className="w-28" /></TableRow></TableHeader>
            <TableBody>
              {data.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium max-w-md truncate">{f.question}</TableCell>
                  <TableCell><AdminStatusBadge status={f.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Link to="/admin/faqs/$id" params={{ id: f.id }} className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent"><Pencil className="h-3.5 w-3.5" /></Link>
                      <button type="button" onClick={() => confirm("حذف؟") && del.mutate(f.id)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
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
