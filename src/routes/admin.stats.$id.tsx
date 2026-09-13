import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublishStatus, SiteStat } from "@/types/cms";
import {
  AdminCardSection,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminPublishSelect,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { nowIso } from "@/lib/cms/admin-utils";
import { STAT_ICON_OPTIONS } from "@/lib/stat-icons";
import { formatAdminFirestoreError } from "@/lib/cms/admin-service";
import {
  useAdminSiteStat,
  useSaveSiteStat,
  useDeleteSiteStat,
  useAdminSiteStats,
} from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { useAdminI18n } from "@/providers/LocaleProvider";

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
  const { a, locale } = useAdminI18n();
  const { id } = useParams({ from: "/admin/stats/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminSiteStat(id, !isNew);
  const { data: allItems } = useAdminSiteStats();
  const save = useSaveSiteStat();
  const remove = useDeleteSiteStat();
  const [form, setForm] = useState(empty());
  const [saveError, setSaveError] = useState("");
  useApplyNextOrder(isNew, allItems, setForm);

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);
  const patch = (p: Partial<Omit<SiteStat, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    const docId = isNew ? `stat-${Date.now()}` : id;
    try {
      await save.mutateAsync({ id: docId, data: { ...form, updatedAt: nowIso() } });
      navigate({ to: "/admin/stats" });
    } catch (err) {
      setSaveError(formatAdminFirestoreError(err, locale));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? a.statsNew : a.statEdit}
        description={isNew ? a.statNewDesc : a.statEditDesc}
        backTo="/admin/stats"
      />
      {saveError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection title={a.statBasics} description={a.statBasicsDesc}>
          <AdminField label={a.statValue} id="value">
            <input
              id="value"
              required
              dir="ltr"
              value={form.value}
              onChange={(e) => patch({ value: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder={a.statValuePh}
            />
          </AdminField>
          <AdminField label={a.fieldAr.replace("{label}", a.description)} id="label">
            <input
              id="label"
              required
              value={form.label}
              onChange={(e) => patch({ label: e.target.value })}
              className={adminInputClass()}
              placeholder={a.statLabelPh}
            />
          </AdminField>
          <AdminField label={a.labelEn} id="labelEn">
            <input
              id="labelEn"
              dir="ltr"
              value={form.labelEn ?? ""}
              onChange={(e) => patch({ labelEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English label"
            />
          </AdminField>
          <AdminField label={a.statIcon} id="icon">
            <select
              id="icon"
              value={form.icon}
              onChange={(e) => patch({ icon: e.target.value })}
              className={adminInputClass()}
            >
              {STAT_ICON_OPTIONS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.publish} description={a.publishDesc}>
          <AdminField label={a.order} id="order" hint={a.orderHint}>
            <input
              id="order"
              type="number"
              min={1}
              value={form.order}
              onChange={(e) => patch({ order: Number(e.target.value) })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminPublishSelect
            value={form.status as PublishStatus}
            onChange={(status) => patch({ status })}
          />
        </AdminCardSection>

        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm(a.confirmDelete)) {
                    await remove.mutateAsync(id);
                    navigate({ to: "/admin/stats" });
                  }
                }
          }
        />
      </form>
    </div>
  );
}
