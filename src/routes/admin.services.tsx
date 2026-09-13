import { useMemo } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  AdminEmpty,
  AdminFetchingBar,
  AdminMetaPreview,
  AdminPageHeader,
  AdminRowActions,
  AdminStatusBadge,
  AdminTableCard,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { useAdminServices, useDeleteService } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizeService } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/services")({
  component: AdminServicesList,
});

function AdminServicesList() {
  const { a, t, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/services/$id");
  const { data = [], isFetching } = useAdminServices();
  const deleteService = useDeleteService();
  const rows = useMemo(
    () => data.map((s) => localizeService(s, locale)),
    [data, locale],
  );

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.servicesTitle}
        description={a.servicesDesc}
        actionTo="/admin/services/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.servicesNew}
      />

      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.servicesEmpty}
          actionTo="/admin/services/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.servicesAdd}
        />
      )}

      {rows.length > 0 && (
        <AdminTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[10rem]">{a.title}</TableHead>
                <TableHead className="min-w-[8rem]">{a.slug}</TableHead>
                <TableHead className="min-w-[12rem]">Meta Title</TableHead>
                <TableHead>{a.status}</TableHead>
                <TableHead>{a.order}</TableHead>
                <TableHead className="text-end">{a.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium align-top">{s.title}</TableCell>
                  <TableCell
                    dir="ltr"
                    className="align-top text-xs font-mono text-muted-foreground"
                  >
                    {s.slug}
                  </TableCell>
                  <TableCell className="align-top max-w-[14rem]">
                    <AdminMetaPreview text={s.metaTitle} fallback={s.title} />
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="align-top text-muted-foreground tabular-nums">
                    {s.order}
                  </TableCell>
                  <TableCell className="align-top">
                    <AdminRowActions
                      editTo="/admin/services/$id"
                      editParams={{ id: s.id }}
                      onDelete={() =>
                        confirm(t(a.confirmDeleteService, { name: s.title })) &&
                        deleteService.mutate(s.id)
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
