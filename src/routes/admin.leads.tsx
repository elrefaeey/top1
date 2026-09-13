import { createFileRoute } from "@tanstack/react-router";
import {
  AdminEmpty,
  AdminFetchingBar,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/AdminUi";
import { useAdminLeads } from "@/hooks/use-admin-cms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsList,
});

function formatDate(iso: string | undefined, locale: string, dash: string) {
  if (!iso) return dash;
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AdminLeadsList() {
  const { a, locale } = useAdminI18n();
  const { data = [], isFetching } = useAdminLeads();

  return (
    <div>
      <AdminPageHeader title={a.leadsTitle} description={a.leadsDesc} />

      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && <AdminEmpty message={a.leadsEmpty} />}

      {data.length > 0 && (
        <div className="admin-table-wrap">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{a.name}</TableHead>
                <TableHead>{a.colPhone}</TableHead>
                <TableHead>{a.colInquiry}</TableHead>
                <TableHead>{a.status}</TableHead>
                <TableHead>{a.colDate}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell dir="ltr" className="text-sm">
                    {lead.phone || a.emDash}
                  </TableCell>
                  <TableCell className="text-sm max-w-[320px] whitespace-pre-wrap">
                    {lead.message}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(lead.createdAt, locale, a.emDash)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
