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

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsList,
});

function formatDate(iso?: string) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AdminLeadsList() {
  const { data = [], isFetching } = useAdminLeads();

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="الرسائل"
        description="استفسارات الزوار من نموذج التواصل — الاسم ورقم الجوال والرسالة."
      />

      <AdminFetchingBar show={isFetching} />
      {!isFetching && data.length === 0 && (
        <AdminEmpty message="لا توجد رسائل بعد. ستظهر هنا عند إرسال نموذج التواصل." />
      )}

      {data.length > 0 && (
        <div className="surface-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>رقم الجوال</TableHead>
                <TableHead>الاستفسار</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell dir="ltr" className="text-sm">
                    {lead.phone || "—"}
                  </TableCell>
                  <TableCell className="text-sm max-w-[320px] whitespace-pre-wrap">
                    {lead.message}
                  </TableCell>
                  <TableCell>
                    <AdminStatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(lead.createdAt)}
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
