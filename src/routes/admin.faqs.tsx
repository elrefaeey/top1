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
import { useAdminFaqs, useDeleteFaq } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { localizeFaq } from "@/lib/i18n/localize-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/faqs")({
  component: AdminFaqsList,
});

function AdminFaqsList() {
  const { a, locale } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/faqs/$id");
  const { data = [], isFetching } = useAdminFaqs();
  const del = useDeleteFaq();
  const rows = useMemo(() => data.map((f) => localizeFaq(f, locale)), [data, locale]);

  if (isChild) return <Outlet />;

  return (
    <div>
      <AdminPageHeader
        title={a.faqsTitle}
        description={a.faqsDesc}
        actionTo="/admin/faqs/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.faqsNew}
      />
      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty
          message={a.faqsEmpty}
          actionTo="/admin/faqs/$id"
          actionParams={{ id: "new" }}
          actionLabel={a.faqsNew}
        />
      )}
      {rows.length > 0 && (
        <AdminTableCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{a.question}</TableHead>
                <TableHead>{a.status}</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium max-w-md truncate">{f.question}</TableCell>
                  <TableCell>
                    <AdminStatusBadge status={f.status} />
                  </TableCell>
                  <TableCell>
                    <AdminRowActions
                      editTo="/admin/faqs/$id"
                      editParams={{ id: f.id }}
                      onDelete={() => confirm(a.confirmDelete) && del.mutate(f.id)}
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
