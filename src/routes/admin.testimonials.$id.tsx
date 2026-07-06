import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublishStatus, Testimonial } from "@/types/cms";
import {
  AdminCard, AdminField, AdminFormActions, AdminFetchingBar, AdminPageHeader,
  AdminPublishSelect, adminInputClass,
} from "@/components/admin/AdminUi";
import { nowIso } from "@/lib/cms/admin-utils";
import { useAdminTestimonial, useSaveTestimonial, useDeleteTestimonial } from "@/hooks/use-admin-cms";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/testimonials/$id")({
  component: AdminTestimonialEdit,
});

const empty = (): Omit<Testimonial, "id"> => ({
  name: "", role: "", company: "", quote: "", rating: 5, order: 1,
  status: "draft", createdAt: nowIso(), updatedAt: nowIso(),
});

function AdminTestimonialEdit() {
  const { id } = useParams({ from: "/admin/testimonials/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminTestimonial(id, !isNew);
  const save = useSaveTestimonial();
  const remove = useDeleteTestimonial();
  const [form, setForm] = useState(empty());
  useEffect(() => { if (data) setForm({ ...data }); }, [data]);
  const patch = (p: Partial<Omit<Testimonial, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? form.name.toLowerCase().replace(/\s+/g, "-") || "testimonial" : id;
    await save.mutateAsync({ id: docId, data: { ...form, updatedAt: nowIso() } });
    navigate({ to: isNew ? "/admin/testimonials" : "/admin/testimonials/$id", ...(isNew ? {} : { params: { id: docId } }) });
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={isNew ? "رأي جديد" : "تعديل رأي"} backTo="/admin/testimonials" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="الاسم" id="name"><input id="name" required value={form.name} onChange={(e) => patch({ name: e.target.value })} className={adminInputClass()} /></AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="المنصب" id="role"><input id="role" value={form.role} onChange={(e) => patch({ role: e.target.value })} className={adminInputClass()} /></AdminField>
            <AdminField label="الشركة" id="company"><input id="company" value={form.company} onChange={(e) => patch({ company: e.target.value })} className={adminInputClass()} /></AdminField>
          </div>
          <AdminField label="الاقتباس" id="quote"><textarea id="quote" rows={4} required value={form.quote} onChange={(e) => patch({ quote: e.target.value })} className={adminInputClass()} /></AdminField>
          <ImageUploadField id="avatarUrl" label="صورة العميل" folder="testimonials" value={form.avatarUrl ?? ""} onChange={(avatarUrl) => patch({ avatarUrl })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="التقييم (1-5)" id="rating"><input id="rating" type="number" min={1} max={5} value={form.rating} onChange={(e) => patch({ rating: Number(e.target.value) })} className={adminInputClass()} /></AdminField>
            <AdminField label="الترتيب" id="order"><input id="order" type="number" value={form.order} onChange={(e) => patch({ order: Number(e.target.value) })} className={adminInputClass()} /></AdminField>
          </div>
          <AdminPublishSelect value={form.status as PublishStatus} onChange={(status) => patch({ status })} />
        </AdminCard>
        <AdminFormActions saving={save.isPending} onDelete={isNew ? undefined : async () => { if (confirm("حذف؟")) { await remove.mutateAsync(id); navigate({ to: "/admin/testimonials" }); } }} />
      </form>
    </div>
  );
}
