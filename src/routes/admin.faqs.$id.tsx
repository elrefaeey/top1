import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { FaqItem, PublishStatus } from "@/types/cms";
import {
  AdminCardSection,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminPublishSelect,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { CmsExternalLinkTool } from "@/components/admin/CmsExternalLinkTool";
import { nowIso } from "@/lib/cms/admin-utils";
import { useAdminFaq, useSaveFaq, useDeleteFaq, useAdminFaqs } from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/faqs/$id")({
  component: AdminFaqEdit,
});

const empty = (): Omit<FaqItem, "id"> => ({
  question: "",
  answer: "",
  order: 1,
  status: "draft",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminFaqEdit() {
  const { a } = useAdminI18n();
  const { id } = useParams({ from: "/admin/faqs/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminFaq(id, !isNew);
  const { data: allItems } = useAdminFaqs();
  const save = useSaveFaq();
  const remove = useDeleteFaq();
  const [form, setForm] = useState(empty());
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const [linkNotice, setLinkNotice] = useState("");
  const [linkError, setLinkError] = useState("");
  useApplyNextOrder(isNew, allItems, setForm);
  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);
  const patch = (p: Partial<Omit<FaqItem, "id">>) => setForm((f) => ({ ...f, ...p }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? `faq-${Date.now()}` : id;
    await save.mutateAsync({ id: docId, data: { ...form, updatedAt: nowIso() } });
    navigate({ to: "/admin/faqs" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? a.faqsNew : a.faqEdit}
        description={isNew ? a.faqNewDesc : a.faqEditDesc}
        backTo="/admin/faqs"
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection title={a.faqContent} description={a.faqContentDesc}>
          <AdminField label={a.fieldAr.replace("{label}", a.question)} id="question">
            <input
              id="question"
              required
              value={form.question}
              onChange={(e) => patch({ question: e.target.value })}
              className={adminInputClass()}
              placeholder={a.faqQuestionPh}
            />
          </AdminField>
          <AdminField label={a.questionEn} id="questionEn">
            <input
              id="questionEn"
              dir="ltr"
              value={form.questionEn ?? ""}
              onChange={(e) => patch({ questionEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English question"
            />
          </AdminField>
          <AdminField label={a.fieldAr.replace("{label}", a.faqAnswer)} id="answer" hint={a.faqAnswerHint}>
            <textarea
              ref={answerRef}
              id="answer"
              rows={5}
              required
              value={form.answer}
              onChange={(e) => patch({ answer: e.target.value })}
              className={adminInputClass()}
              placeholder={a.faqAnswerPh}
            />
          </AdminField>
          <AdminField label={a.answerEn} id="answerEn">
            <textarea
              id="answerEn"
              dir="ltr"
              rows={5}
              value={form.answerEn ?? ""}
              onChange={(e) => patch({ answerEn: e.target.value })}
              className={adminInputClass("text-start")}
              placeholder="English answer"
            />
          </AdminField>
          <CmsExternalLinkTool
            idPrefix="faq-answer"
            value={form.answer}
            onChange={(answer) => patch({ answer })}
            textareaRef={answerRef}
            onNotice={(message) => {
              setLinkError("");
              setLinkNotice(message);
            }}
            onError={(message) => {
              setLinkNotice("");
              setLinkError(message);
            }}
          />
          {linkNotice && (
            <p className="text-xs text-emerald-700 leading-relaxed rounded-lg bg-emerald-500/10 px-3 py-2">
              {linkNotice}
            </p>
          )}
          {linkError && (
            <p className="text-xs text-destructive leading-relaxed rounded-lg bg-destructive/10 px-3 py-2">
              {linkError}
            </p>
          )}
        </AdminCardSection>

        <AdminCardSection title={a.publish} description={a.publishDesc}>
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

        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm(a.confirmDelete)) {
                    await remove.mutateAsync(id);
                    navigate({ to: "/admin/faqs" });
                  }
                }
          }
        />
      </form>
    </div>
  );
}
