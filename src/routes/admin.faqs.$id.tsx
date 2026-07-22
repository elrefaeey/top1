import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { FaqItem, PublishStatus } from "@/types/cms";
import {
  AdminCard,
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
    <div className="p-6 md:p-8 max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader title={isNew ? "سؤال جديد" : "تعديل سؤال"} backTo="/admin/faqs" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="space-y-4">
          <AdminField label="السؤال" id="question">
            <input
              id="question"
              required
              value={form.question}
              onChange={(e) => patch({ question: e.target.value })}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="الإجابة" id="answer" hint="يدعم HTML — يمكنك ربط كلمات بروابط خارجية.">
            <textarea
              ref={answerRef}
              id="answer"
              rows={5}
              required
              value={form.answer}
              onChange={(e) => patch({ answer: e.target.value })}
              className={adminInputClass()}
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
        <AdminFormActions
          saving={save.isPending}
          onDelete={
            isNew
              ? undefined
              : async () => {
                  if (confirm("حذف؟")) {
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
