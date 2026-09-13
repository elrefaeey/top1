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
import { useAdminTestimonials, useDeleteTestimonial } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizeTestimonial } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/testimonials")({
  component: AdminTestimonialsList,
});

function AdminTestimonialsList() {
  const { a, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/testimonials/$id");
  const { data = [], isFetching } = useAdminTestimonials();
  const del = useDeleteTestimonial();
  const rows = useMemo(
    () => data.map((item) => localizeTestimonial(item, locale)),
    [data, locale],
  );

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.testimonialsTitle}
        description={a.testimonialsDesc}
        actionTo="/admin/testimonials/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.testimonialsNew}
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.testimonialsEmpty}
          actionTo="/admin/testimonials/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.testimonialsAdd}
        />
      )}
      {rows.length > 0 && (
        <AdminTableCard>
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">{a.name}</TableHead>
                <TableHead className="w-[22%]">{a.role}</TableHead>
                <TableHead className="w-[22%]">{a.company}</TableHead>
                <TableHead className="w-[14%]">{a.status}</TableHead>
                <TableHead className="w-[14%] text-end">{a.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate">{item.role}</TableCell>
                  <TableCell className="text-sm text-muted-foreground truncate">
                    {item.company}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/testimonials/$id"
                      editParams={{ id: item.id }}
                      onDelete={() => confirm(a.confirmDeleteTestimonial) && del.mutate(item.id)}
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
