import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { PublishStatus, Testimonial } from "@/types/cms";
import {
  AdminCardSection,
  AdminField,
  AdminFormActions,
  AdminFetchingBar,
  AdminPageHeader,
  AdminPublishSelect,
  adminInputClass,
} from "@/components/admin/AdminUi";
import { nowIso } from "@/lib/cms/admin-utils";
import { TESTIMONIAL_ROLES, normalizeTestimonialRole } from "@/lib/cms/testimonial-roles";
import {
  useAdminTestimonial,
  useSaveTestimonial,
  useDeleteTestimonial,
  useAdminTestimonials,
} from "@/hooks/use-admin-cms";
import { useApplyNextOrder } from "@/hooks/use-auto-order";

export const Route = createFileRoute("/admin/testimonials/$id")({
  component: AdminTestimonialEdit,
});

const empty = (): Omit<Testimonial, "id"> => ({
  name: "",
  role: TESTIMONIAL_ROLES[0],
  company: "",
  quote: "",
  rating: 5,
  order: 1,
  status: "draft",
  createdAt: nowIso(),
  updatedAt: nowIso(),
});

function AdminTestimonialEdit() {
  const { id } = useParams({ from: "/admin/testimonials/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isFetching } = useAdminTestimonial(id, !isNew);
  const { data: allItems } = useAdminTestimonials();
  const save = useSaveTestimonial();
  const remove = useDeleteTestimonial();
  const [form, setForm] = useState(empty());
  useApplyNextOrder(isNew, allItems, setForm);
  useEffect(() => {
    if (data) setForm({ ...data, role: normalizeTestimonialRole(data.role) });
  }, [data]);
  const patch = (p: Partial<Omit<Testimonial, "id">>) => setForm((f) => ({ ...f, ...p }));

  const roleOptions =
    form.role && !(TESTIMONIAL_ROLES as readonly string[]).includes(form.role)
      ? [form.role, ...TESTIMONIAL_ROLES]
      : [...TESTIMONIAL_ROLES];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const docId = isNew ? form.name.toLowerCase().replace(/\s+/g, "-") || "testimonial" : id;
    await save.mutateAsync({
      id: docId,
      data: { ...form, role: normalizeTestimonialRole(form.role), updatedAt: nowIso() },
    });
    navigate({ to: "/admin/testimonials" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminFetchingBar show={!isNew && isFetching && !data} />
      <AdminPageHeader
        title={isNew ? "رأي جديد" : "تعديل رأي"}
        description={
          isNew
            ? "أضف اسم العميل والاقتباس والتقييم، ثم احفظ كمسودة أو انشر."
            : "عدّل رأي العميل ثم احفظ التغييرات."
        }
        backTo="/admin/testimonials"
      />
      <form onSubmit={handleSubmit} className="space-y-5">
        <AdminCardSection
          title="أساسيات الرأي"
          description="الاسم والاقتباس يظهران في قسم آراء العملاء."
        >
          <AdminField label="الاسم" id="name">
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              className={adminInputClass()}
              placeholder="مثال: محمد العتيبي"
            />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="المنصب" id="role">
              <select
                id="role"
                required
                value={form.role}
                onChange={(e) => patch({ role: e.target.value })}
                className={adminInputClass()}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="الشركة" id="company">
              <input
                id="company"
                value={form.company}
                onChange={(e) => patch({ company: e.target.value })}
                className={adminInputClass()}
                placeholder="اسم الشركة"
              />
            </AdminField>
          </div>
          <AdminField label="الاقتباس" id="quote">
            <textarea
              id="quote"
              rows={4}
              required
              value={form.quote}
              onChange={(e) => patch({ quote: e.target.value })}
              className={adminInputClass()}
              placeholder="نص شهادة العميل…"
            />
          </AdminField>
        </AdminCardSection>

        <AdminCardSection
          title="إعدادات ونشر"
          description="التقييم والترتيب والربط بخدمة وحالة النشر."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="التقييم (1-5)" id="rating">
              <input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => patch({ rating: Number(e.target.value) })}
                className={adminInputClass()}
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
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="المدينة (اختياري)" id="city">
              <input
                id="city"
                value={form.city ?? ""}
                onChange={(e) => patch({ city: e.target.value || undefined })}
                className={adminInputClass()}
                placeholder="الرياض"
              />
            </AdminField>
            <AdminField label="خدمة مرتبطة (slug)" id="serviceSlug">
              <input
                id="serviceSlug"
                dir="ltr"
                value={form.serviceSlug ?? ""}
                onChange={(e) => patch({ serviceSlug: e.target.value || undefined })}
                className={adminInputClass("text-start")}
                placeholder="web-design"
              />
            </AdminField>
          </div>
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
                  if (confirm("حذف؟")) {
                    await remove.mutateAsync(id);
                    navigate({ to: "/admin/testimonials" });
                  }
                }
          }
        />
      </form>
    </div>
  );
}
