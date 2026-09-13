import { useMemo } from "react";
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
import { localizeBlogPost } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogList,
});

function AdminBlogList() {
  const { a, t, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/blog/$id");
  const { data = [], isFetching } = useAdminBlogPosts();
  const deletePost = useDeleteBlogPost();
  const rows = useMemo(
    () => data.map((p) => localizeBlogPost(p, locale)),
    [data, locale],
  );

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.blogTitle}
        description={a.blogDesc}
        actionTo="/admin/blog/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.blogNew}
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.blogEmpty}
          actionTo="/admin/blog/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.blogNew}
        />
      )}
      {rows.length > 0 && (
        <AdminTableCard>
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">{a.title}</TableHead>
                <TableHead className="w-[20%]">{a.category}</TableHead>
                <TableHead className="w-[15%]">{a.status}</TableHead>
                <TableHead className="w-[25%] text-end">{a.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
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
                      onDelete={() =>
                        confirm(t(a.confirmDeleteNamed, { name: p.title })) &&
                        deletePost.mutate(p.id)
                      }
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
