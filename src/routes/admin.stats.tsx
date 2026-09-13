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
import { useAdminSiteStats, useDeleteSiteStat } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizeStat } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/stats")({
  component: AdminStatsList,
});

function AdminStatsList() {
  const { a, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/stats/$id");
  const { data = [], isFetching } = useAdminSiteStats();
  const del = useDeleteSiteStat();
  const rows = useMemo(() => data.map((s) => localizeStat(s, locale)), [data, locale]);

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.statsTitle}
        description={a.statsDesc}
        actionTo="/admin/stats/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.statsNew}
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.statsEmpty}
          actionTo="/admin/stats/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.statsNew}
        />
      )}
      {rows.length > 0 && (
        <AdminTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{a.colValue}</TableHead>
                <TableHead>{a.colLabel}</TableHead>
                <TableHead>{a.order}</TableHead>
                <TableHead>{a.status}</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-bold text-[var(--admin-primary)]">{s.value}</TableCell>
                  <TableCell className="font-medium">{s.label}</TableCell>
                  <TableCell>{s.order}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={s.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/stats/$id"
                      editParams={{ id: s.id }}
                      onDelete={() => confirm(a.confirmDelete) && del.mutate(s.id)}
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
