import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PricingPlan, PublishStatus } from "@/types/cms";
import {
  AdminCard, AdminField, AdminFormActions, AdminFetchingBar, AdminPageHeader,
  AdminPublishSelect, adminInputClass,
} from "@/components/admin/AdminUi";
import { arrayToLines, linesToArray, nowIso } from "@/lib/cms/admin-utils";
import { useAdminPricingPlan, useSavePricingPlan, useDeletePricingPlan } from "@/hooks/use-admin-cms";

export const Route = createFileRoute("/admin/pricing/$id")({
  component: AdminPricingEdit,
});

const empty = (): Omit<PricingPlan, "id"> => ({
  name: "", price: "", period: "/ مشروع", description: "", features: [],
  highlighted: false, ctaLabel: "ابدأ", ctaHref: "/contact", order: 1,
  status: "draft", createdAt: nowIso(), updatedAt: nowIso(),
});

function AdminPricingEdit() {
  const { id } = useParams({ from: "/admin/pricing/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminPricingPlan(id, !isNew);
  const save = useSavePricingPlan();
  const remove = useDeletePricingPlan();
  const [form, setForm] = useState(empty());
  const [featuresText, setFeaturesText] = useState("");

  useEffect(() => { if (data) { setForm({ ...data }); setFeaturesText(arrayToLines(data.features)); } }, [data]);
  const patch = (p: Partial<Omit<PricingPlan, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? form.name.toLowerCase().replace(/\s+/g, "-") || "plan" : id;
    await save.mutateAsync({ id: docId, data: { ...form, features: linesToArray(featuresText), updatedAt: nowIso() } });
    navigate({ to: isNew ? "/admin/pricing" : "/admin/pricing/$id", ...(isNew ? {} : { params: { id: docId } }) });
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={isNew ? "باقة جديدة" : "تعديل باقة"} backTo="/admin/pricing" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="الاسم" id="name"><input id="name" required value={form.name} onChange={(e) => patch({ name: e.target.value })} className={adminInputClass()} /></AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="السعر" id="price"><input id="price" value={form.price} onChange={(e) => patch({ price: e.target.value })} className={adminInputClass()} /></AdminField>
            <AdminField label="الفترة" id="period"><input id="period" value={form.period} onChange={(e) => patch({ period: e.target.value })} className={adminInputClass()} /></AdminField>
          </div>
          <AdminField label="الوصف" id="description"><textarea id="description" rows={2} value={form.description} onChange={(e) => patch({ description: e.target.value })} className={adminInputClass()} /></AdminField>
          <AdminField label="الميزات (سطر لكل ميزة)" id="features"><textarea id="features" rows={5} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className={adminInputClass()} /></AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="نص الزر" id="ctaLabel"><input id="ctaLabel" value={form.ctaLabel} onChange={(e) => patch({ ctaLabel: e.target.value })} className={adminInputClass()} /></AdminField>
            <AdminField label="رابط الزر" id="ctaHref"><input id="ctaHref" dir="ltr" value={form.ctaHref} onChange={(e) => patch({ ctaHref: e.target.value })} className={adminInputClass("text-start")} /></AdminField>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.highlighted} onChange={(e) => patch({ highlighted: e.target.checked })} /> الأكثر شيوعاً</label>
          <AdminPublishSelect value={form.status as PublishStatus} onChange={(status) => patch({ status })} />
        </AdminCard>
        <AdminFormActions saving={save.isPending} onDelete={isNew ? undefined : async () => { if (confirm("حذف؟")) { await remove.mutateAsync(id); navigate({ to: "/admin/pricing" }); } }} />
      </form>
    </div>
  );
}
