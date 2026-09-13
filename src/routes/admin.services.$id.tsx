import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublishStatus, Service } from "@/types/cms";
import {
  AdminCardSection,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminPublishSelect,
  AdminSeoSection,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { arrayToLines, linesToArray, nowIso, slugify } from "@/lib/cms/admin-utils";
import {
  useAdminService,
  useSaveService,
  useDeleteService,
  useAdminServices,
} from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminI18n } from "@/providers/LocaleProvider";

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
  const { a } = useAdminI18n();
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
      publishedAt: form.status === "published" ? (form.publishedAt ?? nowIso()) : form.publishedAt,
    };
    await save.mutateAsync({ id: docId, data: payload });
    navigate({ to: "/admin/services" });
  }

  async function handleDelete() {
    if (isNew || !confirm(a.confirmDeleteServiceShort)) return;
    await remove.mutateAsync(id);
    navigate({ to: "/admin/services" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? a.servicesNew : a.serviceEdit}
        description={isNew ? a.serviceNewDesc : a.serviceEditDesc}
        backTo="/admin/services"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection title={a.serviceBasics} description={a.serviceBasicsDesc}>
          <AdminField label={a.fieldAr.replace("{label}", a.title)} id="title">
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                patch({ title, slug: isNew ? slugify(title) : form.slug });
              }}
              className={adminInputClass()}
              placeholder={a.serviceTitlePh}
            />
          </AdminField>
          <AdminField label={a.titleEn} id="titleEn">
            <input
              id="titleEn"
              dir="ltr"
              value={form.titleEn ?? ""}
              onChange={(e) => patch({ titleEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English title"
            />
          </AdminField>
          <AdminField label={a.slug} id="slug" hint={a.pageSlugHint}>
            <input
              id="slug"
              dir="ltr"
              required
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="web-design"
            />
          </AdminField>
          <AdminField label={a.fieldAr.replace("{label}", a.serviceShortDesc)} id="shortDescription">
            <textarea
              id="shortDescription"
              rows={2}
              value={form.shortDescription}
              onChange={(e) => patch({ shortDescription: e.target.value })}
              className={adminInputClass()}
              placeholder={a.serviceShortDescPh}
            />
          </AdminField>
          <AdminField label={a.shortDescEn} id="shortDescriptionEn">
            <textarea
              id="shortDescriptionEn"
              dir="ltr"
              rows={2}
              value={form.shortDescriptionEn ?? ""}
              onChange={(e) => patch({ shortDescriptionEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English short description"
            />
          </AdminField>
          <AdminField label={a.fieldAr.replace("{label}", a.serviceFullDesc)} id="description">
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.descEn} id="descriptionEn">
            <textarea
              id="descriptionEn"
              dir="ltr"
              rows={5}
              value={form.descriptionEn ?? ""}
              onChange={(e) => patch({ descriptionEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English description"
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.serviceFeatures} description={a.serviceFeaturesDesc}>
          <AdminField label={a.serviceFeaturesLabel} id="features">
            <textarea
              id="features"
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.featuresEn} id="featuresEn">
            <textarea
              id="featuresEn"
              dir="ltr"
              rows={4}
              value={arrayToLines(form.featuresEn ?? [])}
              onChange={(e) => patch({ featuresEn: linesToArray(e.target.value) })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField
            label={a.serviceDeliverables}
            id="deliverables"
            hint={a.serviceDeliverablesHint}
          >
            <textarea
              id="deliverables"
              rows={5}
              value={deliverablesText}
              onChange={(e) => setDeliverablesText(e.target.value)}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.deliverablesEn} id="deliverablesEn">
            <textarea
              id="deliverablesEn"
              dir="ltr"
              rows={5}
              value={arrayToLines(form.deliverablesEn ?? [])}
              onChange={(e) => patch({ deliverablesEn: linesToArray(e.target.value) })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.serviceImageSettings}>
          <ImageUploadField
            id="imageUrl"
            label={a.serviceImageAr}
            folder="services"
            value={form.imageUrl ?? ""}
            onChange={(imageUrl) => patch({ imageUrl })}
            onUploaded={async (imageUrl) => {
              if (isNew) return;
              await save.mutateAsync({
                id,
                data: {
                  ...form,
                  imageUrl,
                  slug: form.slug || slugify(form.title),
                  features: linesToArray(featuresText),
                  deliverables: linesToArray(deliverablesText),
                  updatedAt: nowIso(),
                },
              });
            }}
          />
          <ImageUploadField
            id="imageUrlEn"
            label={a.serviceImageEn}
            folder="services"
            value={form.imageUrlEn ?? ""}
            onChange={(imageUrlEn) => patch({ imageUrlEn })}
            onUploaded={async (imageUrlEn) => {
              if (isNew) return;
              await save.mutateAsync({
                id,
                data: {
                  ...form,
                  imageUrlEn,
                  slug: form.slug || slugify(form.title),
                  features: linesToArray(featuresText),
                  deliverables: linesToArray(deliverablesText),
                  updatedAt: nowIso(),
                },
              });
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={a.serviceIcon} id="icon">
              <input
                id="icon"
                dir="ltr"
                value={form.icon}
                onChange={(e) => patch({ icon: e.target.value })}
                className={adminInputClass("text-start")}
                placeholder="MonitorSmartphone, Search, Palette…"
              />
            </AdminField>
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
          </div>
          <AdminPublishSelect
            value={form.status as PublishStatus}
            onChange={(status) => patch({ status })}
          />
        </AdminCardSection>

        <AdminSeoSection
          slug={form.slug}
          metaTitle={form.metaTitle}
          metaDescription={form.metaDescription}
          onSlug={(slug) => patch({ slug })}
          onMetaTitle={(metaTitle) => patch({ metaTitle })}
          onMetaDescription={(metaDescription) => patch({ metaDescription })}
          showSlug={false}
        />

        <AdminFormActions saving={save.isPending} onDelete={isNew ? undefined : handleDelete} />
      </form>
    </div>
  );
}
