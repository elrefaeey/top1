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
import { useAdminTestimonials, useDeleteTestimonial } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
      <AdminPageHeader
        title="آراء العملاء"
        description="شهادات العملاء المعروضة في الموقع."
        actionTo="/admin/testimonials/$id"
        actionParams={{ id: "new" }}
        actionLabel="رأي جديد"
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا توجد آراء."
          actionTo="/admin/testimonials/$id"
          actionParams={{ id: "new" }}
          actionLabel="إضافة رأي"
        />
      )}
      {data.length > 0 && (
        <AdminTableCard>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">الاسم</TableHead>
                <TableHead className="w-[22%]">الدور</TableHead>
                <TableHead className="w-[22%]">الشركة</TableHead>
                <TableHead className="w-[14%]">الحالة</TableHead>
                <TableHead className="w-[14%] text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate">{t.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate">
                    {t.company}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={t.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/testimonials/$id"
                      editParams={{ id: t.id }}
                      onDelete={() => confirm("حذف هذا الرأي؟") && del.mutate(t.id)}
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
