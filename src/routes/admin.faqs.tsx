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
import { useAdminFaqs, useDeleteFaq } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqsList,
});

function AdminFaqsList() {
  const isChild = useAdminChildRoute("/admin/faqs/$id");
  const { data = [], isFetching } = useAdminFaqs();
  const del = useDeleteFaq();

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title="الأسئلة الشائعة"
        description="FAQ في الصفحة الرئيسية."
        actionTo="/admin/faqs/$id"
        actionParams={{ id: "new" }}
        actionLabel="سؤال جديد"
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا توجد أسئلة."
          actionTo="/admin/faqs/$id"
          actionParams={{ id: "new" }}
          actionLabel="سؤال جديد"
        />
      )}
      {data.length > 0 && (
        <AdminTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>السؤال</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium max-w-md truncate">{f.question}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={f.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/faqs/$id"
                      editParams={{ id: f.id }}
                      onDelete={() => confirm("حذف؟") && del.mutate(f.id)}
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
