import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Author, PublishStatus } from "@/types/cms";
import {
  AdminCardSection,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminPublishSelect,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { nowIso } from "@/lib/cms/admin-utils";
import {
  useAdminAuthor,
  useSaveAuthor,
  useDeleteAuthor,
  useAdminAuthors,
} from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/authors/$id")({
  component: AdminAuthorEdit,
});

const empty = (): Omit<Author, "id"> => ({
  name: "",
  role: "",
  bio: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  expertise: [],
  order: 1,
  status: "draft",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminAuthorEdit() {
  const { a } = useAdminI18n();
  const { id } = useParams({ from: "/admin/authors/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminAuthor(id, !isNew);
  const { data: allItems } = useAdminAuthors();
  const save = useSaveAuthor();
  const remove = useDeleteAuthor();
  const [form, setForm] = useState(empty());
  useApplyNextOrder(isNew, allItems, setForm);
  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);
  const patch = (p: Partial<Omit<Author, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const slug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") ||
      "author";
    const docId = isNew ? slug : id;
    await save.mutateAsync({
      id: docId,
      data: { ...form, slug, updatedAt: nowIso() },
    });
    navigate({ to: "/admin/authors" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? a.authorsNew : a.authorEdit}
        description={isNew ? a.authorNewDesc : a.authorEditDesc}
        backTo="/admin/authors"
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection title={a.authorBasics} description={a.authorBasicsDesc}>
          <AdminField label={a.fieldAr.replace("{label}", a.name)} id="name">
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              className={adminInputClass()}
              placeholder={a.authorNamePh}
            />
          </AdminField>
          <AdminField label={a.nameEn} id="nameEn">
            <input
              id="nameEn"
              dir="ltr"
              value={form.nameEn ?? ""}
              onChange={(e) => patch({ nameEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English name"
            />
          </AdminField>
          <AdminField label={a.fieldAr.replace("{label}", a.role)} id="role">
            <input
              id="role"
              required
              value={form.role}
              onChange={(e) => patch({ role: e.target.value })}
              className={adminInputClass()}
              placeholder={a.authorRolePh}
            />
          </AdminField>
          <AdminField label={a.roleEn} id="roleEn">
            <input
              id="roleEn"
              dir="ltr"
              value={form.roleEn ?? ""}
              onChange={(e) => patch({ roleEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English role"
            />
          </AdminField>
          <AdminField label={a.fieldAr.replace("{label}", a.authorBio)} id="bio">
            <textarea
              id="bio"
              rows={5}
              required
              value={form.bio}
              onChange={(e) => patch({ bio: e.target.value })}
              className={adminInputClass()}
              placeholder={a.authorBioPh}
            />
          </AdminField>
          <AdminField label={a.bioEn} id="bioEn">
            <textarea
              id="bioEn"
              dir="ltr"
              rows={5}
              value={form.bioEn ?? ""}
              onChange={(e) => patch({ bioEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English bio"
            />
          </AdminField>
          <AdminField label={a.slug} id="slug" hint={a.authorSlugHint}>
            <input
              id="slug"
              dir="ltr"
              value={form.slug}
              onChange={(e) => patch({ slug: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="ahmed-refaei"
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.authorExtra} description={a.authorExtraDesc}>
          <AdminField label={a.authorExpertise} id="expertise">
            <input
              id="expertise"
              value={form.expertise.join(", ")}
              onChange={(e) =>
                patch({
                  expertise: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              className={adminInputClass()}
              placeholder="SEO, Content, Analytics"
            />
          </AdminField>
          <AdminField label={a.expertiseEn} id="expertiseEn">
            <input
              id="expertiseEn"
              dir="ltr"
              value={(form.expertiseEn ?? []).join(", ")}
              onChange={(e) =>
                patch({
                  expertiseEn: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              className={adminInputClass("text-start")}
              placeholder="SEO, Content, Analytics"
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={a.authorYears} id="years">
              <input
                id="years"
                type="number"
                min={0}
                value={form.yearsExperience ?? ""}
                onChange={(e) =>
                  patch({
                    yearsExperience: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className={adminInputClass()}
              />
            </AdminField>
            <AdminField label="LinkedIn" id="linkedin">
              <input
                id="linkedin"
                dir="ltr"
                value={form.linkedinUrl ?? ""}
                onChange={(e) => patch({ linkedinUrl: e.target.value || undefined })}
                className={adminInputClass("text-start")}
                placeholder="https://linkedin.com/in/…"
              />
            </AdminField>
          </div>
        </AdminCardSection>

        <AdminCardSection title={a.authorImageSettings} description={a.authorImageSettingsDesc}>
          <ImageUploadField
            id="avatarUrl"
            label={a.authorAvatar}
            folder="authors"
            value={form.avatarUrl ?? ""}
            onChange={(avatarUrl) => patch({ avatarUrl: avatarUrl || undefined })}
            onUploaded={async (avatarUrl) => {
              if (isNew) return;
              await save.mutateAsync({
                id,
                data: {
                  ...form,
                  avatarUrl,
                  slug: form.slug || id,
                  updatedAt: nowIso(),
                },
              });
            }}
            hint={a.authorAvatarHint}
          />
          <AdminField label="Meta Title" id="metaTitle">
            <input
              id="metaTitle"
              value={form.metaTitle}
              onChange={(e) => patch({ metaTitle: e.target.value })}
              className={adminInputClass()}
              placeholder={a.authorMetaTitlePh}
            />
          </AdminField>
          <AdminField label="Meta Description" id="metaDescription">
            <textarea
              id="metaDescription"
              rows={2}
              value={form.metaDescription}
              onChange={(e) => patch({ metaDescription: e.target.value })}
              className={adminInputClass()}
              placeholder={a.authorMetaDescPh}
            />
          </AdminField>
          <AdminPublishSelect
            value={form.status}
            onChange={(status: PublishStatus) => patch({ status })}
          />
        </AdminCardSection>

        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (!confirm(a.confirmDelete)) return;
                  await remove.mutateAsync(id);
                  navigate({ to: "/admin/authors" });
                }
          }
        />
      </form>
    </div>
  );
}
