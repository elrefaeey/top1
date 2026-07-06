import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublishStatus, SiteStat } from "@/types/cms";
import {
  AdminCard, AdminField, AdminFormActions, AdminFetchingBar, AdminPageHeader,
  AdminPublishSelect, adminInputClass,
} from "@/components/admin/AdminUi";
import { nowIso } from "@/lib/cms/admin-utils";
import { STAT_ICON_OPTIONS } from "@/lib/stat-icons";
import { formatAdminFirestoreError } from "@/lib/cms/admin-service";
import { useAdminSiteStat, useSaveSiteStat, useDeleteSiteStat } from "@/hooks/use-admin-cms";

export const Route = createFileRoute("/admin/stats/$id")({
  component: AdminStatEdit,
});

const empty = (): Omit<SiteStat, "id"> => ({
  value: "",
  label: "",
  icon: "BarChart3",
  order: 1,
  status: "draft",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminStatEdit() {
  const { id } = useParams({ from: "/admin/stats/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminSiteStat(id, !isNew);
  const save = useSaveSiteStat();
  const remove = useDeleteSiteStat();
  const [form, setForm] = useState(empty());
  const [saveError, setSaveError] = useState("");

  useEffect(() => { if (data) setForm({ ...data }); }, [data]);
  const patch = (p: Partial<Omit<SiteStat, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    const docId = isNew ? `stat-${Date.now()}` : id;
    try {
      await save.mutateAsync({ id: docId, data: { ...form, updatedAt: nowIso() } });
      navigate({ to: isNew ? "/admin/stats" : "/admin/stats/$id", ...(isNew ? {} : { params: { id: docId } }) });
    } catch (err) {
      setSaveError(formatAdminFirestoreError(err));
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={isNew ? "إحصائية جديدة" : "تعديل إحصائية"} backTo="/admin/stats" />
      {saveError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="الرقم / القيمة" id="value">
            <input
              id="value"
              required
              dir="ltr"
              value={form.value}
              onChange={(e) => patch({ value: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="120+ أو 98% أو 4.2×"
            />
          </AdminField>
          <AdminField label="الوصف" id="label">
            <input
              id="label"
              required
              value={form.label}
              onChange={(e) => patch({ label: e.target.value })}
              className={adminInputClass()}
              placeholder="مشروع منجز"
            />
          </AdminField>
          <AdminField label="الأيقونة" id="icon">
            <select
              id="icon"
              value={form.icon}
              onChange={(e) => patch({ icon: e.target.value })}
              className={adminInputClass()}
            >
              {STAT_ICON_OPTIONS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="الترتيب" id="order">
            <input
              id="order"
              type="number"
              value={form.order}
              onChange={(e) => patch({ order: Number(e.target.value) })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminPublishSelect value={form.status as PublishStatus} onChange={(status) => patch({ status })} />
        </AdminCard>
        <AdminFormActions
          saving={save.isPending}
          onDelete={isNew ? undefined : async () => {
            if (confirm("حذف؟")) {
              await remove.mutateAsync(id);
              navigate({ to: "/admin/stats" });
            }
          }}
        />
      </form>
    </div>
  );
}
