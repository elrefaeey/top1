import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { BlogPost, PublishStatus } from "@/types/cms";
import {
  AdminCard, AdminField, AdminFormActions, AdminFetchingBar, AdminPageHeader,
  AdminPublishSelect, AdminSeoSection, adminInputClass,
} from "@/components/admin/AdminUi";
import { arrayToComma, commaToArray, nowIso, slugify } from "@/lib/cms/admin-utils";
import { useAdminBlogPost, useSaveBlogPost, useDeleteBlogPost } from "@/hooks/use-admin-cms";
import { SITE_NAME } from "@/lib/site-config";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { BlogContentEditor } from "@/components/admin/BlogContentEditor";

export const Route = createFileRoute("/admin/blog/$id")({
  component: AdminBlogEdit,
});

const empty = (): Omit<BlogPost, "id"> => ({
  slug: "", title: "", excerpt: "", content: "<p></p>", category: "تصميم",
  tags: [], author: SITE_NAME, readTime: 5, views: 0, trending: false,
  status: "draft", metaTitle: "", metaDescription: "", createdAt: nowIso(), updatedAt: nowIso(),
});

function AdminBlogEdit() {
  const { id } = useParams({ from: "/admin/blog/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminBlogPost(id, !isNew);
  const save = useSaveBlogPost();
  const remove = useDeleteBlogPost();
  const [form, setForm] = useState(empty());
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (data) { setForm({ ...data }); setTagsText(arrayToComma(data.tags)); }
  }, [data]);

  function patch(p: Partial<Omit<BlogPost, "id">>) { setForm((f) => ({ ...f, ...p })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug?.trim() || slugify(form.title) || `post-${Date.now()}`;
    const docId = isNew ? slug : id;
    await save.mutateAsync({
      id: docId,
      data: {
        ...form,
        slug,
        tags: commaToArray(tagsText),
        updatedAt: nowIso(),
        publishedAt: form.status === "published" ? form.publishedAt ?? nowIso() : form.publishedAt,
      },
    });
    navigate({ to: "/admin/blog" });
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={isNew ? "مقال جديد" : "تعديل مقال"} backTo="/admin/blog" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="العنوان" id="title">
            <input id="title" required value={form.title} onChange={(e) => {
              const title = e.target.value;
              patch({ title, slug: isNew ? slugify(title) : form.slug });
            }} className={adminInputClass()} />
          </AdminField>
          <AdminField label="Slug" id="slug">
            <input id="slug" dir="ltr" required value={form.slug} onChange={(e) => patch({ slug: e.target.value })} className={adminInputClass("text-start")} />
          </AdminField>
          <AdminField label="المقتطف" id="excerpt">
            <textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => patch({ excerpt: e.target.value })} className={adminInputClass()} />
          </AdminField>
          <BlogContentEditor
            value={form.content}
            onChange={(content) => patch({ content })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="التصنيف" id="category">
              <input id="category" value={form.category} onChange={(e) => patch({ category: e.target.value })} className={adminInputClass()} />
            </AdminField>
            <AdminField label="الكاتب" id="author">
              <input id="author" value={form.author} onChange={(e) => patch({ author: e.target.value })} className={adminInputClass()} />
            </AdminField>
          </div>
          <AdminField label="الوسوم (مفصولة بفاصلة)" id="tags">
            <input id="tags" dir="ltr" value={tagsText} onChange={(e) => setTagsText(e.target.value)} className={adminInputClass("text-start")} />
          </AdminField>
          <ImageUploadField id="featuredImage" label="صورة الغلاف (أعلى المقال)" folder="blog" value={form.featuredImage ?? ""} onChange={(featuredImage) => patch({ featuredImage })} />
          <AdminField label="وصف صورة الغلاف (Alt)" id="featuredImageAlt">
            <input
              id="featuredImageAlt"
              value={form.featuredImageAlt ?? ""}
              onChange={(e) => patch({ featuredImageAlt: e.target.value })}
              className={adminInputClass()}
              placeholder="وصف صورة الغلاف"
            />
          </AdminField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.trending} onChange={(e) => patch({ trending: e.target.checked })} />
            مقال رائج
          </label>
          <AdminPublishSelect value={form.status as PublishStatus} onChange={(status) => patch({ status })} />
        </AdminCard>
        <AdminSeoSection slug={form.slug} metaTitle={form.metaTitle} metaDescription={form.metaDescription}
          onSlug={(slug) => patch({ slug })} onMetaTitle={(metaTitle) => patch({ metaTitle })} onMetaDescription={(metaDescription) => patch({ metaDescription })} />
        <AdminFormActions saving={save.isPending} onDelete={isNew ? undefined : async () => { if (confirm("حذف؟")) { await remove.mutateAsync(id); navigate({ to: "/admin/blog" }); } }} />
      </form>
    </div>
  );
}
