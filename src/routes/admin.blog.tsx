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
import { useAdminBlogPosts, useDeleteBlogPost } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogList,
});

function AdminBlogList() {
  const isChild = useAdminChildRoute("/admin/blog/$id");
  const { data = [], isFetching } = useAdminBlogPosts();
  const deletePost = useDeleteBlogPost();

  if (isChild) return <Outlet />;

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="المدونة"
        description="إدارة المقالات والمحتوى."
        actionTo="/admin/blog/$id"
        actionParams={{ id: "new" }}
        actionLabel="مقال جديد"
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message="لا توجد مقالات."
          actionTo="/admin/blog/$id"
          actionParams={{ id: "new" }}
          actionLabel="مقال جديد"
        />
      )}
      {data.length > 0 && (
        <AdminTableCard>
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">العنوان</TableHead>
                <TableHead className="w-[20%]">التصنيف</TableHead>
                <TableHead className="w-[15%]">الحالة</TableHead>
                <TableHead className="w-[25%] text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <span className="line-clamp-2">{p.title}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/blog/$id"
                      editParams={{ id: p.id }}
                      onDelete={() => confirm(`حذف "${p.title}"؟`) && deletePost.mutate(p.id)}
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
