/** Roles available when editing testimonials in admin. */
export const TESTIMONIAL_ROLES = [
  "مالك",
  "مالكة المتجر",
  "مالك الشركة",
  "صاحبة العلامة",
  "مؤسس",
  "مديرة المتجر",
  "مدير عام",
  "مدير العمليات",
  "مدير تسويق",
  "مديرة تسويق",
  "مدير النادي",
  "مدير تقني",
  "رئيس تنفيذي",
  "صاحب نشاط",
  "عميل",
] as const;

export type TestimonialRole = (typeof TESTIMONIAL_ROLES)[number];

export function normalizeTestimonialRole(value: string | undefined | null): string {
  const v = (value ?? "").trim();
  if (!v) return TESTIMONIAL_ROLES[0];
  const match = TESTIMONIAL_ROLES.find((r) => r === v);
  return match ?? v;
}
