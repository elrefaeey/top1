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
import { useAdminAuthors, useDeleteAuthor } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/authors")({
  component: AdminAuthorsList,
});

function AdminAuthorsList() {
  const isChild = useAdminChildRoute("/admin/authors/$id");
  const { data = [], isFetching } = useAdminAuthors();
  const del = useDeleteAuthor();

  if (isChild) return <Outlet />;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <AdminPageHeader
        title="الكتّاب والفريق"
        description="ملفات E-E-A-T للكتّاب والخبراء المعروضة في الموقع."
        actionTo="/admin/authors/$id"
        actionParams={{ id: "new" }}
        actionLabel="كاتب جديد"
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا يوجد كتّاب."
          actionTo="/admin/authors/$id"
          actionParams={{ id: "new" }}
          actionLabel="إضافة كاتب"
        />
      )}
      {data.length > 0 && (
        <AdminTableCard>
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">الاسم</TableHead>
                <TableHead className="w-[28%]">الدور</TableHead>
                <TableHead className="w-[16%]">Slug</TableHead>
                <TableHead className="w-[14%]">الحالة</TableHead>
                <TableHead className="w-[14%] text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="truncate text-sm text-muted-foreground">{a.role}</TableCell>
                  <TableCell className="font-mono text-xs" dir="ltr">
                    {a.slug}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={a.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/authors/$id"
                      editParams={{ id: a.id }}
                      onDelete={() => confirm("حذف هذا الكاتب؟") && del.mutate(a.id)}
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
