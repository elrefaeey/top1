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
import { useAdminAuthors, useDeleteAuthor } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizeAuthorProfile } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/authors")({
  component: AdminAuthorsList,
});

function AdminAuthorsList() {
  const { a, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/authors/$id");
  const { data = [], isFetching } = useAdminAuthors();
  const del = useDeleteAuthor();
  const rows = useMemo(
    () => data.map((author) => localizeAuthorProfile(author, locale)),
    [data, locale],
  );

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.authorsTitle}
        description={a.authorsDesc}
        actionTo="/admin/authors/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.authorsNew}
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.authorsEmpty}
          actionTo="/admin/authors/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.authorsAdd}
        />
      )}
      {rows.length > 0 && (
        <AdminTableCard>
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">{a.name}</TableHead>
                <TableHead className="w-[28%]">{a.role}</TableHead>
                <TableHead className="w-[16%]">{a.slug}</TableHead>
                <TableHead className="w-[14%]">{a.status}</TableHead>
                <TableHead className="w-[14%] text-end">{a.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">{author.name}</TableCell>
                  <TableCell className="truncate text-sm text-muted-foreground">
                    {author.role}
                  </TableCell>
                  <TableCell className="font-mono text-xs" dir="ltr">
                    {author.slug}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={author.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/authors/$id"
                      editParams={{ id: author.id }}
                      onDelete={() => confirm(a.confirmDeleteAuthor) && del.mutate(author.id)}
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
