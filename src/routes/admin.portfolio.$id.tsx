import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PortfolioItem, PublishStatus } from "@/types/cms";
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
import { arrayToComma, commaToArray, nowIso, slugify } from "@/lib/cms/admin-utils";
import {
  useAdminPortfolioItem,
  useSavePortfolioItem,
  useDeletePortfolioItem,
  useAdminPortfolio,
} from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/admin/portfolio/$id")({
  component: AdminPortfolioEdit,
});

const empty = (): Omit<PortfolioItem, "id"> => ({
  slug: "",
  title: "",
  category: "تصميم مواقع",
  description: "",
  imageUrl: "",
  url: "",
  tags: [],
  order: 1,
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminPortfolioEdit() {
  const { id } = useParams({ from: "/admin/portfolio/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminPortfolioItem(id, !isNew);
  const { data: allItems } = useAdminPortfolio();
  const save = useSavePortfolioItem();
  const remove = useDeletePortfolioItem();
  const [form, setForm] = useState(empty());
  const [tagsText, setTagsText] = useState("");
  useApplyNextOrder(isNew, allItems, setForm);

  useEffect(() => {
    if (data) {
      setForm({ ...data });
      setTagsText(arrayToComma(data.tags));
    }
  }, [data]);
  const patch = (p: Partial<Omit<PortfolioItem, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? form.slug || slugify(form.title) : id;
    await save.mutateAsync({
      id: docId,
      data: {
        ...form,
        slug: form.slug || slugify(form.title),
        tags: commaToArray(tagsText),
        updatedAt: nowIso(),
      },
    });
    navigate({ to: "/admin/portfolio" });
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={isNew ? "مشروع جديد" : "تعديل مشروع"} backTo="/admin/portfolio" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="العنوان" id="title">
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) =>
                patch({ title: e.target.value, slug: isNew ? slugify(e.target.value) : form.slug })
              }
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="Slug" id="slug">
            <input
              id="slug"
              dir="ltr"
              required
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label="التصنيف" id="category">
            <input
              id="category"
              value={form.category}
              onChange={(e) => patch({ category: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="الوصف" id="description">
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField
            label="رابط المشروع"
            id="url"
            hint="رابط الموقع الحقيقي — يظهر زر «الذهاب إلى الموقع» في صفحة التفاصيل"
          >
            <input
              id="url"
              dir="ltr"
              type="url"
              placeholder="https://example.com"
              value={form.url ?? ""}
              onChange={(e) => patch({ url: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <ImageUploadField
            id="imageUrl"
            folder="portfolio"
            value={form.imageUrl}
            onChange={(imageUrl) => patch({ imageUrl })}
            required
          />
          <AdminField label="الوسوم" id="tags">
            <input
              id="tags"
              dir="ltr"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className={adminInputClass("text-start")}
            />
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
          <AdminPublishSelect
            value={form.status as PublishStatus}
            onChange={(status) => patch({ status })}
          />
        </AdminCard>
        <AdminSeoSection
          slug={form.slug}
          metaTitle={form.metaTitle}
          metaDescription={form.metaDescription}
          onSlug={(slug) => patch({ slug })}
          onMetaTitle={(v) => patch({ metaTitle: v })}
          onMetaDescription={(v) => patch({ metaDescription: v })}
        />
        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm("حذف؟")) {
                    await remove.mutateAsync(id);
                    navigate({ to: "/admin/portfolio" });
                  }
                }
          }
        />
      </form>
    </div>
  );
}
