import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { BlogPost, PublishStatus } from "@/types/cms";
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
import { arrayToComma, commaToArray, nowIso, slugify, authorSlug } from "@/lib/cms/admin-utils";
import { useAdminBlogPost, useSaveBlogPost, useDeleteBlogPost } from "@/hooks/use-admin-cms";
import { useAuthors } from "@/hooks/use-cms";
import { SITE_NAME } from "@/lib/site-config";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { BlogContentEditor } from "@/components/admin/BlogContentEditor";
import {
  BLOG_CATEGORIES,
  DEFAULT_BLOG_CATEGORY,
  normalizeBlogCategory,
} from "@/lib/cms/blog-categories";

export const Route = createFileRoute("/admin/blog/$id")({
  component: AdminBlogEdit,
});

const empty = (): Omit<BlogPost, "id"> => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "<p></p>",
  category: DEFAULT_BLOG_CATEGORY,
  tags: [],
  author: SITE_NAME,
  readTime: 5,
  views: 0,
  trending: false,
  status: "draft",
  metaTitle: "",
  metaDescription: "",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminBlogEdit() {
  const { id } = useParams({ from: "/admin/blog/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminBlogPost(id, !isNew);
  const { data: authors = [] } = useAuthors();
  const save = useSaveBlogPost();
  const remove = useDeleteBlogPost();
  const [form, setForm] = useState(empty());
  const [tagsText, setTagsText] = useState("");

  useEffect(() => {
    if (data) {
      setForm({ ...data, category: normalizeBlogCategory(data.category) });
      setTagsText(arrayToComma(data.tags));
    }
  }, [data]);

  function patch(p: Partial<Omit<BlogPost, "id">>) {
    setForm((f) => ({ ...f, ...p }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug = form.slug?.trim() || slugify(form.title) || `post-${Date.now()}`;
    const docId = isNew ? slug : id;
    await save.mutateAsync({
      id: docId,
      data: {
        ...form,
        slug,
        category: normalizeBlogCategory(form.category),
        tags: commaToArray(tagsText),
        updatedAt: nowIso(),
        publishedAt:
          form.status === "published" ? (form.publishedAt ?? nowIso()) : form.publishedAt,
      },
    });
    navigate({ to: "/admin/blog" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? "مقال جديد" : "تعديل مقال"}
        description={
          isNew
            ? "أضف عنواناً واضحاً، محتوى المقال، غلاف، وتصنيف — ثم احفظ كمسودة أو انشر."
            : "عدّل المحتوى والإعدادات ثم احفظ التغييرات."
        }
        backTo="/admin/blog"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection
          title="أساسيات المقال"
          description="العنوان والرابط والمقتطف يظهرون في قائمة المدونة ونتائج البحث."
        >
          <AdminField label="العنوان" id="title">
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                patch({ title, slug: isNew ? slugify(title) : form.slug });
              }}
              className={adminInputClass()}
              placeholder="مثال: دليل تحسين محركات البحث للمتاجر"
            />
          </AdminField>
          <AdminField label="Slug" id="slug" hint="بالإنجليزية — جزء من رابط المقال.">
            <input
              id="slug"
              dir="ltr"
              required
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="seo-guide-ecommerce"
            />
          </AdminField>
          <AdminField label="المقتطف" id="excerpt">
            <textarea
              id="excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              className={adminInputClass()}
              placeholder="ملخص قصير يظهر تحت العنوان في قائمة المدونة"
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection
          title="المحتوى"
          description="اكتب المحتوى بصيغة HTML، ويمكنك إدراج صور وروابط داخل النص."
        >
          <BlogContentEditor value={form.content} onChange={(content) => patch({ content })} />
        </AdminCardSection>

        <AdminCardSection
          title="التصنيف والنشر"
          description="التصنيف متاح بقيمتين فقط: تصميم مواقع أو SEO."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="التصنيف" id="category">
              <select
                id="category"
                value={normalizeBlogCategory(form.category)}
                onChange={(e) => patch({ category: normalizeBlogCategory(e.target.value) })}
                className={adminInputClass()}
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="الكاتب" id="author">
              <select
                id="author"
                value={form.authorSlug ?? ""}
                onChange={(e) => {
                  const selectedSlug = e.target.value;
                  const selectedAuthor = authors.find((a) => authorSlug(a) === selectedSlug);
                  patch({
                    authorSlug: selectedSlug || undefined,
                    author: selectedAuthor?.name || form.author,
                  });
                }}
                className={adminInputClass()}
              >
                <option value="">بدون كاتب محدد</option>
                {authors.map((a) => (
                  <option key={a.id} value={authorSlug(a)}>
                    {a.name}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>
          <AdminField label="الوسوم (مفصولة بفاصلة)" id="tags">
            <input
              id="tags"
              dir="ltr"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className={adminInputClass("text-start")}
              placeholder="seo, web-design, saudi"
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
            <AdminPublishSelect
              value={form.status as PublishStatus}
              onChange={(status) => patch({ status })}
            />
            <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-[var(--admin-radius,0.625rem)] border border-[var(--admin-border,#dde3ec)] bg-[#fbfcfe] px-3 py-2 text-sm font-medium text-[var(--admin-text,#152238)]">
              <input
                type="checkbox"
                checked={form.trending}
                onChange={(e) => patch({ trending: e.target.checked })}
                className="h-4 w-4 accent-[var(--admin-primary,#1149b0)]"
              />
              مقال رائج (يظهر في الأعلى)
            </label>
          </div>
        </AdminCardSection>

        <AdminCardSection
          title="صورة الغلاف"
          description="تظهر أعلى المقال وفي بطاقات المدونة ومشاركة الروابط."
        >
          <ImageUploadField
            id="featuredImage"
            label="رفع أو لصق رابط الصورة"
            folder="blog"
            value={form.featuredImage ?? ""}
            onChange={(featuredImage) => patch({ featuredImage })}
            onUploaded={async (featuredImage) => {
              if (isNew) return;
              await save.mutateAsync({
                id,
                data: {
                  ...form,
                  featuredImage,
                  slug: form.slug || slugify(form.title),
                  tags: commaToArray(tagsText),
                  updatedAt: nowIso(),
                },
              });
            }}
          />
          <AdminField label="وصف صورة الغلاف (Alt)" id="featuredImageAlt">
            <input
              id="featuredImageAlt"
              value={form.featuredImageAlt ?? ""}
              onChange={(e) => patch({ featuredImageAlt: e.target.value })}
              className={adminInputClass()}
              placeholder="وصف مختصر للصورة بالعربية"
            />
          </AdminField>
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

        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm("حذف المقال؟")) {
                    await remove.mutateAsync(id);
                    navigate({ to: "/admin/blog" });
                  }
                }
          }
        />
      </form>
    </div>
  );
}
