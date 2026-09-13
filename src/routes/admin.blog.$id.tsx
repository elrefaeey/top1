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
import { useAdminI18n } from "@/providers/LocaleProvider";

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
  const { a } = useAdminI18n();
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
        title={isNew ? a.blogNew : a.blogEdit}
        description={isNew ? a.blogNewDesc : a.blogEditDesc}
        backTo="/admin/blog"
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection title={a.blogBasics} description={a.blogBasicsDesc}>
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
              placeholder={a.blogTitlePh}
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
          <AdminField label={a.slug} id="slug" hint={a.blogSlugHint}>
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
          <AdminField label={a.fieldAr.replace("{label}", a.blogExcerpt)} id="excerpt">
            <textarea
              id="excerpt"
              rows={3}
              value={form.excerpt}
              onChange={(e) => patch({ excerpt: e.target.value })}
              className={adminInputClass()}
              placeholder={a.blogExcerptPh}
            />
          </AdminField>
          <AdminField label={a.excerptEn} id="excerptEn">
            <textarea
              id="excerptEn"
              dir="ltr"
              rows={3}
              value={form.excerptEn ?? ""}
              onChange={(e) => patch({ excerptEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English excerpt"
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.blogContentSection} description={a.blogContentSectionDesc}>
          <BlogContentEditor value={form.content} onChange={(content) => patch({ content })} />
        </AdminCardSection>

        <AdminCardSection title={a.bilingualSection} description={a.bilingualSectionDesc}>
          <AdminField label={a.contentEn} id="contentEn">
            <BlogContentEditor
              value={form.contentEn || "<p></p>"}
              onChange={(contentEn) => patch({ contentEn })}
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.blogCatPublish} description={a.blogCatPublishDesc}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={a.category} id="category">
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
            <AdminField label={a.blogAuthor} id="author">
              <select
                id="author"
                value={form.authorSlug ?? ""}
                onChange={(e) => {
                  const selectedSlug = e.target.value;
                  const selectedAuthor = authors.find((author) => authorSlug(author) === selectedSlug);
                  patch({
                    authorSlug: selectedSlug || undefined,
                    author: selectedAuthor?.name || form.author,
                  });
                }}
                className={adminInputClass()}
              >
                <option value="">{a.blogNoAuthor}</option>
                {authors.map((author) => (
                  <option key={author.id} value={authorSlug(author)}>
                    {author.name}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>
          <AdminField label={a.blogTags} id="tags">
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
            <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-2 text-sm font-medium text-[var(--admin-text)]">
              <input
                type="checkbox"
                checked={form.trending}
                onChange={(e) => patch({ trending: e.target.checked })}
                className="h-4 w-4 accent-[var(--admin-primary)]"
              />
              {a.blogFeatured}
            </label>
          </div>
        </AdminCardSection>

        <AdminCardSection title={a.blogCover} description={a.blogCoverDesc}>
          <ImageUploadField
            id="featuredImage"
            label={a.blogCoverAr}
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
          <ImageUploadField
            id="featuredImageEn"
            label={a.blogCoverEn}
            folder="blog"
            value={form.featuredImageEn ?? ""}
            onChange={(featuredImageEn) => patch({ featuredImageEn })}
            onUploaded={async (featuredImageEn) => {
              if (isNew) return;
              await save.mutateAsync({
                id,
                data: {
                  ...form,
                  featuredImageEn,
                  slug: form.slug || slugify(form.title),
                  tags: commaToArray(tagsText),
                  updatedAt: nowIso(),
                },
              });
            }}
          />
          <AdminField label={a.blogCoverAlt} id="featuredImageAlt">
            <input
              id="featuredImageAlt"
              value={form.featuredImageAlt ?? ""}
              onChange={(e) => patch({ featuredImageAlt: e.target.value })}
              className={adminInputClass()}
              placeholder={a.blogCoverAltPh}
            />
          </AdminField>
          <AdminField label={a.coverAltEn} id="featuredImageAltEn">
            <input
              id="featuredImageAltEn"
              dir="ltr"
              value={form.featuredImageAltEn ?? ""}
              onChange={(e) => patch({ featuredImageAltEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English image description"
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

        <AdminCardSection title={a.bilingualSection} description={a.metaTitleEn}>
          <AdminField label={a.metaTitleEn} id="metaTitleEn">
            <input
              id="metaTitleEn"
              dir="ltr"
              value={form.metaTitleEn ?? ""}
              onChange={(e) => patch({ metaTitleEn: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label={a.metaDescEn} id="metaDescriptionEn">
            <textarea
              id="metaDescriptionEn"
              dir="ltr"
              rows={3}
              value={form.metaDescriptionEn ?? ""}
              onChange={(e) => patch({ metaDescriptionEn: e.target.value })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
        </AdminCardSection>

        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm(a.confirmDeletePost)) {
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
