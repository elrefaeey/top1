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
import { useAdminPortfolio, useDeletePortfolioItem } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizePortfolio } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/portfolio")({
  component: AdminPortfolioList,
});

function AdminPortfolioList() {
  const { a, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/portfolio/$id");
  const { data = [], isFetching } = useAdminPortfolio();
  const del = useDeletePortfolioItem();
  const rows = useMemo(
    () => data.map((p) => localizePortfolio(p, locale)),
    [data, locale],
  );

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.portfolioTitle}
        description={a.portfolioDesc}
        actionTo="/admin/portfolio/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.portfolioNew}
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.portfolioEmpty}
          actionTo="/admin/portfolio/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.portfolioAdd}
        />
      )}
      {rows.length > 0 && (
        <AdminTableCard>
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">{a.title}</TableHead>
                <TableHead className="w-[20%]">{a.category}</TableHead>
                <TableHead className="w-[15%]">{a.image}</TableHead>
                <TableHead className="w-[15%]">{a.status}</TableHead>
                <TableHead className="w-[15%] text-end">{a.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium whitespace-pre-line">{p.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell>
                    {p.imageUrl ? (
                      <span className="text-xs text-emerald-700">{a.imageLinked}</span>
                    ) : (
                      <span className="text-xs text-amber-700">{a.imageMissing}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={p.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/portfolio/$id"
                      editParams={{ id: p.id }}
                      onDelete={() => confirm(a.confirmDeleteProject) && del.mutate(p.id)}
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
