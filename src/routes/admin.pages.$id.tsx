import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CmsPage, PublishStatus } from "@/types/cms";
import {
  AdminCard, AdminField, AdminFormActions, AdminFetchingBar, AdminPageHeader,
  AdminPublishSelect, AdminSeoSection, adminInputClass,
} from "@/components/admin/AdminUi";
import { nowIso } from "@/lib/cms/admin-utils";
import { useAdminPage, useSavePage } from "@/hooks/use-admin-cms";

export const Route = createFileRoute("/admin/pages/$id")({
  component: AdminPageEdit,
});

const PAGE_TITLES: Record<string, string> = {
  home: "الرئيسية", about: "من نحن", contact: "تواصل",
  services: "الخدمات", portfolio: "أعمالنا", blog: "المدونة",
};

const empty = (slug: string): Omit<CmsPage, "id"> => ({
  slug,
  title: PAGE_TITLES[slug] ?? "صفحة جديدة",
  status: "published",
  sections: [],
  metaTitle: "",
  metaDescription: "",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminPageEdit() {
  const { id } = useParams({ from: "/admin/pages/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminPage(id, !isNew);
  const save = useSavePage();
  const [form, setForm] = useState(empty(isNew ? "" : id));

  useEffect(() => {
    if (data) setForm({ ...data });
    else if (!isNew && PAGE_TITLES[id]) setForm(empty(id));
  }, [data, id, isNew]);

  const patch = (p: Partial<Omit<CmsPage, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? form.slug || "page" : id;
    await save.mutateAsync({ id: docId, data: { ...form, updatedAt: nowIso() } });
    navigate({ to: isNew ? "/admin/pages" : "/admin/pages/$id", ...(isNew ? {} : { params: { id: docId } }) });
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={`SEO — ${form.title}`} backTo="/admin/pages" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          {isNew && (
            <>
              <AdminField label="العنوان" id="title"><input id="title" required value={form.title} onChange={(e) => patch({ title: e.target.value })} className={adminInputClass()} /></AdminField>
              <AdminField label="Slug" id="slug"><input id="slug" dir="ltr" required value={form.slug} onChange={(e) => patch({ slug: e.target.value })} className={adminInputClass("text-start")} /></AdminField>
            </>
          )}
          {!isNew && PAGE_TITLES[id] && (
            <p className="text-sm text-muted-foreground">تحرير بيانات SEO لهذه الصفحة. المحتوى الأساسي في ملفات الموقع.</p>
          )}
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
        <AdminFormActions saving={save.isPending} />
      </form>
    </div>
  );
}
