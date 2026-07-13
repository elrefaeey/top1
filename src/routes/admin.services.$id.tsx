import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublishStatus, Service } from "@/types/cms";
import {
  AdminCard,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminPublishSelect,
  AdminSeoSection,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { arrayToLines, linesToArray, nowIso, slugify } from "@/lib/cms/admin-utils";
import { useAdminService, useSaveService, useDeleteService, useAdminServices } from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/services/$id")({
  component: AdminServiceEdit,
});

const emptyService = (): Omit<Service, "id"> => ({
  slug: "",
  title: "",
  tagline: "",
  shortDescription: "",
  description: "",
  icon: "Globe",
  features: [],
  deliverables: [],
  order: 1,
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminServiceEdit() {
  const { id } = useParams({ from: "/admin/services/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminService(id, !isNew);
  const { data: allServices } = useAdminServices();
  const save = useSaveService();
  const remove = useDeleteService();

  const [form, setForm] = useState(emptyService());
  const [featuresText, setFeaturesText] = useState("");
  const [deliverablesText, setDeliverablesText] = useState("");
  useApplyNextOrder(isNew, allServices, setForm);

  useEffect(() => {
    if (data) {
      setForm({ ...data });
      setFeaturesText(arrayToLines(data.features ?? []));
      setDeliverablesText(arrayToLines(data.deliverables ?? []));
    }
  }, [data]);

  function patch(p: Partial<Omit<Service, "id">>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? form.slug || slugify(form.title) : id;
    if (!docId) return;
    const payload: Omit<Service, "id"> = {
      ...form,
      slug: form.slug || slugify(form.title),
      features: linesToArray(featuresText),
      deliverables: linesToArray(deliverablesText),
      updatedAt: nowIso(),
      publishedAt: form.status === "published" ? form.publishedAt ?? nowIso() : form.publishedAt,
    };
    await save.mutateAsync({ id: docId, data: payload });
    navigate({ to: "/admin/services" });
  }

  async function handleDelete() {
    if (isNew || !confirm("حذف هذه الخدمة؟")) return;
    await remove.mutateAsync(id);
    navigate({ to: "/admin/services" });
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? "خدمة جديدة" : "تعديل خدمة"}
        backTo="/admin/services"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="العنوان" id="title">
            <input id="title" required value={form.title} onChange={(e) => {
              const title = e.target.value;
              patch({ title, slug: isNew ? slugify(title) : form.slug });
            }} className={adminInputClass()} />
          </AdminField>
          <AdminField label="Slug" id="slug" hint="يُستخدم في الرابط">
            <input id="slug" dir="ltr" required value={form.slug} onChange={(e) => patch({ slug: e.target.value })} className={adminInputClass("text-start")} />
          </AdminField>
          <AdminField label="الوصف المختصر" id="shortDescription">
            <textarea id="shortDescription" rows={2} value={form.shortDescription} onChange={(e) => patch({ shortDescription: e.target.value })} className={adminInputClass()} />
          </AdminField>
          <AdminField label="الوصف الكامل" id="description">
            <textarea id="description" rows={5} value={form.description} onChange={(e) => patch({ description: e.target.value })} className={adminInputClass()} />
          </AdminField>
          <AdminField label="الميزات (سطر لكل ميزة)" id="features">
            <textarea id="features" rows={4} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} className={adminInputClass()} />
          </AdminField>
          <AdminField label="ماذا ستحصل عليه (سطر لكل بند)" id="deliverables" hint="يظهر في صفحة تفاصيل الخدمة تحت عنوان «ما ستحصل عليه»">
            <textarea id="deliverables" rows={5} value={deliverablesText} onChange={(e) => setDeliverablesText(e.target.value)} className={adminInputClass()} />
          </AdminField>
          <ImageUploadField id="imageUrl" label="صورة الخدمة" folder="services" value={form.imageUrl ?? ""} onChange={(imageUrl) => patch({ imageUrl })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="الأيقونة" id="icon">
              <input id="icon" dir="ltr" value={form.icon} onChange={(e) => patch({ icon: e.target.value })} className={adminInputClass("text-start")} placeholder="MonitorSmartphone, Search, Palette…" />
            </AdminField>
            <AdminField label="الترتيب" id="order">
              <input id="order" type="number" value={form.order} onChange={(e) => patch({ order: Number(e.target.value) })} className={adminInputClass()} />
            </AdminField>
          </div>
          <AdminPublishSelect value={form.status as PublishStatus} onChange={(status) => patch({ status })} />
        </AdminCard>

        <AdminSeoSection
          slug={form.slug}
          metaTitle={form.metaTitle}
          metaDescription={form.metaDescription}
          onSlug={(slug) => patch({ slug })}
          onMetaTitle={(metaTitle) => patch({ metaTitle })}
          onMetaDescription={(metaDescription) => patch({ metaDescription })}
        />

        <AdminFormActions saving={save.isPending} onDelete={isNew ? undefined : handleDelete} />
      </form>
    </div>
  );
}
