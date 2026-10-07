import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CaseStudyMetric, PortfolioItem, PublishStatus } from "@/types/cms";
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
import { arrayToComma, commaToArray, nowIso, slugify } from "@/lib/cms/admin-utils";
import {
  useAdminPortfolioItem,
  useSavePortfolioItem,
  useDeletePortfolioItem,
  useAdminPortfolio,
} from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminI18n } from "@/providers/LocaleProvider";

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
  const { a } = useAdminI18n();
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
        caseMetrics: form.caseMetrics?.filter((m) => m.label.trim() && m.after.trim()),
        updatedAt: nowIso(),
      },
    });
    navigate({ to: "/admin/portfolio" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? a.portfolioNew : a.projectEdit}
        description={isNew ? a.projectNewDesc : a.projectEditDesc}
        backTo="/admin/portfolio"
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection title={a.projectBasics} description={a.projectBasicsDesc}>
          <AdminField label={a.fieldAr.replace("{label}", a.title)} id="title" hint={a.projectTitleHint}>
            <textarea
              id="title"
              required
              rows={2}
              value={form.title}
              onChange={(e) =>
                patch({ title: e.target.value, slug: isNew ? slugify(e.target.value) : form.slug })
              }
              className={adminInputClass("min-h-[4.5rem] resize-y")}
              placeholder={a.projectTitlePh}
            />
          </AdminField>
          <AdminField label={a.titleEn} id="titleEn">
            <textarea
              id="titleEn"
              dir="ltr"
              rows={2}
              value={form.titleEn ?? ""}
              onChange={(e) => patch({ titleEn: e.target.value })}
              className={adminInputClass("min-h-[4.5rem] resize-y text-start")}
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
              placeholder="fashion-store"
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={a.category} id="category">
              <input
                id="category"
                value={form.category}
                onChange={(e) => patch({ category: e.target.value })}
                className={adminInputClass()}
                placeholder={a.projectCategoryPh}
              />
            </AdminField>
            <AdminField label={a.categoryEn} id="categoryEn">
              <input
                id="categoryEn"
                dir="ltr"
                value={form.categoryEn ?? ""}
                onChange={(e) => patch({ categoryEn: e.target.value })}
                className={adminInputClass("text-start")}
                placeholder="Web design"
              />
            </AdminField>
          </div>
          <AdminField label={a.fieldAr.replace("{label}", a.description)} id="description">
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => patch({ description: e.target.value })}
              className={adminInputClass()}
              placeholder={a.projectDescPh}
            />
          </AdminField>
          <AdminField label={a.descEn} id="descriptionEn">
            <textarea
              id="descriptionEn"
              dir="ltr"
              rows={4}
              value={form.descriptionEn ?? ""}
              onChange={(e) => patch({ descriptionEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English description"
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection title={a.projectDetails} description={a.projectDetailsDesc}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={a.projectClient} id="client">
              <input
                id="client"
                value={form.client ?? ""}
                onChange={(e) => patch({ client: e.target.value || undefined })}
                className={adminInputClass()}
                placeholder={a.projectClientPh}
              />
            </AdminField>
            <AdminField label={a.clientEn} id="clientEn">
              <input
                id="clientEn"
                dir="ltr"
                value={form.clientEn ?? ""}
                onChange={(e) => patch({ clientEn: e.target.value || undefined })}
                className={adminInputClass("text-start")}
                placeholder="English client name"
              />
            </AdminField>
          </div>
          <AdminField label={a.projectChallenge} id="challenge" hint={a.projectChallengeHint}>
            <textarea
              id="challenge"
              rows={3}
              value={form.challenge ?? ""}
              onChange={(e) => patch({ challenge: e.target.value || undefined })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.challengeEn} id="challengeEn">
            <textarea
              id="challengeEn"
              dir="ltr"
              rows={3}
              value={form.challengeEn ?? ""}
              onChange={(e) => patch({ challengeEn: e.target.value || undefined })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label={a.projectSolution} id="solution">
            <textarea
              id="solution"
              rows={3}
              value={form.solution ?? ""}
              onChange={(e) => patch({ solution: e.target.value || undefined })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.solutionEn} id="solutionEn">
            <textarea
              id="solutionEn"
              dir="ltr"
              rows={3}
              value={form.solutionEn ?? ""}
              onChange={(e) => patch({ solutionEn: e.target.value || undefined })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label={a.projectServicesProvided} id="servicesProvided">
            <input
              id="servicesProvided"
              value={(form.servicesProvided ?? []).join(", ")}
              onChange={(e) =>
                patch({
                  servicesProvided: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              className={adminInputClass()}
              placeholder="تصميم مواقع, SEO"
            />
          </AdminField>
          <AdminField label={a.projectTech} id="technologies">
            <input
              id="technologies"
              dir="ltr"
              value={(form.technologies ?? []).join(", ")}
              onChange={(e) =>
                patch({
                  technologies: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              className={adminInputClass("text-start")}
              placeholder="React, Vite, GA4"
            />
          </AdminField>
          <AdminField label={a.projectResults} id="resultsSummary">
            <textarea
              id="resultsSummary"
              rows={2}
              value={form.resultsSummary ?? ""}
              onChange={(e) => patch({ resultsSummary: e.target.value || undefined })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.resultsEn} id="resultsSummaryEn">
            <textarea
              id="resultsSummaryEn"
              dir="ltr"
              rows={2}
              value={form.resultsSummaryEn ?? ""}
              onChange={(e) => patch({ resultsSummaryEn: e.target.value || undefined })}
              className={adminInputClass("text-start")}
            />
          </AdminField>
          <AdminField label={a.projectUrl} id="url" hint={a.projectUrlHint}>
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
        </AdminCardSection>

        <AdminCardSection title={a.caseStudyTitle} description={a.caseStudyDesc}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label={a.caseDuration} id="caseDuration">
              <input
                id="caseDuration"
                value={form.caseDuration ?? ""}
                onChange={(e) => patch({ caseDuration: e.target.value || undefined })}
                className={adminInputClass()}
                placeholder="6 أشهر"
              />
            </AdminField>
            <AdminField label={a.caseDurationEn} id="caseDurationEn">
              <input
                id="caseDurationEn"
                dir="ltr"
                value={form.caseDurationEn ?? ""}
                onChange={(e) => patch({ caseDurationEn: e.target.value || undefined })}
                className={adminInputClass("text-start")}
                placeholder="6 months"
              />
            </AdminField>
          </div>

          {(form.caseMetrics ?? []).length === 0 && (
            <p className="text-sm text-[var(--admin-muted)]">{a.caseMetricEmpty}</p>
          )}

          {(form.caseMetrics ?? []).map((metric, index) => {
            const setMetric = (p: Partial<CaseStudyMetric>) =>
              patch({
                caseMetrics: (form.caseMetrics ?? []).map((m, i) => (i === index ? { ...m, ...p } : m)),
              });
            return (
              <div
                key={index}
                className="space-y-3 rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-3 sm:p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[var(--admin-muted)]">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      patch({ caseMetrics: (form.caseMetrics ?? []).filter((_, i) => i !== index) })
                    }
                    className="admin-btn admin-btn-ghost !min-h-8 !px-2.5 text-[var(--admin-danger)]"
                    aria-label={a.caseMetricRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AdminField label={a.caseMetricLabel} id={`metric-label-${index}`}>
                    <input
                      id={`metric-label-${index}`}
                      required
                      value={metric.label}
                      onChange={(e) => setMetric({ label: e.target.value })}
                      className={adminInputClass()}
                      placeholder="زيارات Google الشهرية"
                    />
                  </AdminField>
                  <AdminField label={a.caseMetricLabelEn} id={`metric-labelEn-${index}`}>
                    <input
                      id={`metric-labelEn-${index}`}
                      dir="ltr"
                      value={metric.labelEn ?? ""}
                      onChange={(e) => setMetric({ labelEn: e.target.value || undefined })}
                      className={adminInputClass("text-start")}
                      placeholder="Monthly Google visits"
                    />
                  </AdminField>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <AdminField label={a.caseMetricBefore} id={`metric-before-${index}`}>
                    <input
                      id={`metric-before-${index}`}
                      dir="ltr"
                      value={metric.before ?? ""}
                      onChange={(e) => setMetric({ before: e.target.value || undefined })}
                      className={adminInputClass("text-start")}
                      placeholder="320"
                    />
                  </AdminField>
                  <AdminField label={a.caseMetricAfter} id={`metric-after-${index}`}>
                    <input
                      id={`metric-after-${index}`}
                      dir="ltr"
                      required
                      value={metric.after}
                      onChange={(e) => setMetric({ after: e.target.value })}
                      className={adminInputClass("text-start")}
                      placeholder="4,800"
                    />
                  </AdminField>
                  <AdminField label={a.caseMetricChange} id={`metric-change-${index}`}>
                    <input
                      id={`metric-change-${index}`}
                      dir="ltr"
                      value={metric.change ?? ""}
                      onChange={(e) => setMetric({ change: e.target.value || undefined })}
                      className={adminInputClass("text-start")}
                      placeholder="+1,400%"
                    />
                  </AdminField>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => patch({ caseMetrics: [...(form.caseMetrics ?? []), { label: "", after: "" }] })}
            className="admin-btn admin-btn-ghost"
          >
            <Plus className="h-4 w-4" />
            {a.caseMetricAdd}
          </button>
        </AdminCardSection>

        <AdminCardSection title={a.projectImageSettings} description={a.projectImageSettingsDesc}>
          <ImageUploadField
            id="imageUrl"
            label={a.projectImageAr}
            folder="portfolio"
            value={form.imageUrl}
            onChange={(imageUrl) => patch({ imageUrl })}
            onUploaded={async (imageUrl) => {
              if (isNew) return;
              await save.mutateAsync({
                id,
                data: {
                  ...form,
                  imageUrl,
                  slug: form.slug || slugify(form.title),
                  tags: commaToArray(tagsText),
                  updatedAt: nowIso(),
                },
              });
            }}
            required
          />
          <ImageUploadField
            id="imageUrlEn"
            label={a.projectImageEn}
            folder="portfolio"
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
                  tags: commaToArray(tagsText),
                  updatedAt: nowIso(),
                },
              });
            }}
          />
          <AdminField label={a.projectTags} id="tags">
            <input
              id="tags"
              dir="ltr"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className={adminInputClass("text-start")}
              placeholder="ecommerce, redesign"
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
          onMetaTitle={(v) => patch({ metaTitle: v })}
          onMetaDescription={(v) => patch({ metaDescription: v })}
          showSlug={false}
        />
        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm(a.confirmDelete)) {
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
