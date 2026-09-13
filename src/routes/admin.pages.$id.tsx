import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { CmsPage, PublishStatus } from "@/types/cms";
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
import { formatAdminFirestoreError } from "@/lib/cms/admin-service";
import { nowIso } from "@/lib/cms/admin-utils";
import { useAdminPage, useSavePage } from "@/hooks/use-admin-cms";
import { useAdminI18n } from "@/providers/LocaleProvider";
import type { AdminMessages } from "@/lib/i18n/admin-messages";

export const Route = createFileRoute("/admin/pages/$id")({
  component: AdminPageEdit,
});

const PAGE_TITLE_KEYS: Record<string, keyof AdminMessages> = {
  home: "pageHome",
  about: "pageAbout",
  contact: "pageContact",
  services: "services",
  portfolio: "portfolio",
  blog: "blog",
};

function AdminPageEdit() {
  const { a, t, locale } = useAdminI18n();
  const { id } = useParams({ from: "/admin/pages/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminPage(id, !isNew);
  const save = useSavePage();
  const pageTitle = (slug: string) =>
    PAGE_TITLE_KEYS[slug] ? a[PAGE_TITLE_KEYS[slug]] : a.pageNewTitle;

  const empty = (slug: string): Omit<CmsPage, "id"> => ({
    slug,
    title: pageTitle(slug),
    status: "published",
    sections: [],
    metaTitle: "",
    metaDescription: "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  const [form, setForm] = useState(empty(isNew ? "" : id));
  const [saveError, setSaveError] = useState("");
  const hydratedKey = useRef<string | null>(null);

  useEffect(() => {
    if (isFetching) return;
    const key = `${id}:${data?.updatedAt ?? "new"}`;
    if (hydratedKey.current === key) return;
    if (data) {
      setForm({ ...data });
    } else if (!isNew && PAGE_TITLE_KEYS[id]) {
      setForm(empty(id));
    }
    hydratedKey.current = key;
  }, [data, id, isNew, isFetching, a]);

  const patch = (p: Partial<Omit<CmsPage, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    const docId = isNew ? form.slug || "page" : id;
    const payload: Omit<CmsPage, "id"> = {
      ...form,
      slug: form.slug?.trim() || docId,
      title: form.title || pageTitle(docId) || form.slug || a.pageFallbackTitle,
      updatedAt: nowIso(),
    };
    try {
      await save.mutateAsync({ id: docId, data: payload });
      navigate({ to: "/admin/pages" });
    } catch (err) {
      setSaveError(formatAdminFirestoreError(err, locale));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? a.pageNewTitle : t(a.pageEditSeoTitle, { title: form.title })}
        description={isNew ? a.pageNewDesc : a.pageEditDesc}
        backTo="/admin/pages"
      />
      {saveError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {saveError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection
          title={a.pageBasics}
          description={isNew ? a.pageBasicsNewDesc : a.pageBasicsEditDesc}
        >
          {isNew && (
            <>
              <AdminField label={a.title} id="title">
                <input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  className={adminInputClass()}
                  placeholder={a.pageTitlePh}
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
                  placeholder="about"
                />
              </AdminField>
            </>
          )}
          {!isNew && PAGE_TITLE_KEYS[id] && (
            <p className="text-sm text-[var(--admin-muted,#5b6b82)]">{a.pageSeoOnlyHint}</p>
          )}
          <AdminPublishSelect
            value={form.status as PublishStatus}
            onChange={(status) => patch({ status })}
          />
        </AdminCardSection>

        <AdminSeoSection
          slug={form.slug || id}
          metaTitle={form.metaTitle}
          metaDescription={form.metaDescription}
          onSlug={(slug) => patch({ slug })}
          onMetaTitle={(metaTitle) => patch({ metaTitle })}
          onMetaDescription={(metaDescription) => patch({ metaDescription })}
          showSlug={!isNew}
        />
        <AdminFormActions saving={save.isPending} />
      </form>
    </div>
  );
}
