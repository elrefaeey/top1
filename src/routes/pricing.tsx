import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, MessageCircle } from "lucide-react";
import { PageIntro } from "@/components/site/SectionIntro";
import { SITE_NAME } from "@/lib/site-config";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () =>
    buildPageHead({
      title: `الأسعار | عرض سعر مخصص | ${SITE_NAME}`,
      description: `تعرّف على طريقة تسعير ${SITE_NAME} لتصميم المواقع والمتاجر وSEO والتسويق الرقمي — اطلب عرض سعر يناسب مشروعك.`,
      path: "/pricing",
      breadcrumbs: [
        { name: "الرئيسية", path: "/" },
        { name: "الأسعار", path: "/pricing" },
      ],
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: "الرئيسية", path: "/" },
            { name: "الأسعار", path: "/pricing" },
          ]),
        ),
        jsonLdScript({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "هل لديكم أسعار ثابتة؟",
              acceptedAnswer: {
                "@type": "Answer",
                text: "نحدد النطاق حسب حجم المشروع والمتطلبات. نرسل عرض سعر مخصص بعد فهم احتياجك.",
              },
            },
            {
              "@type": "Question",
              name: "ما الذي يؤثر على السعر؟",
              acceptedAnswer: {
                "@type": "Answer",
                text: "عدد الصفحات، التصميم المخصص، المتجر والدفع، محتوى SEO، التكاملات، ومدة الدعم بعد الإطلاق.",
              },
            },
          ],
        }),
      ],
    }),
  component: PricingPage,
});

const PACKAGES = [
  {
    name: "موقع تعريفي",
    blurb: " للشركات والعلامات التي تحتاج حضوراً واضحاً على الويب.",
    points: ["تصميم متجاوب", "صفحات أساسية", "SEO تأسيسي", "تسليم واضح بمراحل"],
  },
  {
    name: "متجر إلكتروني",
    blurb: "للبيع أونلاين مع تجربة شراء سلسة في السوق السعودي والخليج.",
    points: ["كتالوج منتجات", "تكامل دفع/شحن حسب الاتفاق", "تحسين سرعة وتحويل", "لوحة إدارة"],
  },
  {
    name: "نمو وSEO",
    blurb: "لتحسين الظهور في Google وجذب زيارات ذات نية شراء.",
    points: ["تدقيق تقني", "كلمات مفتاحية", "محتوى وتحسينات", "تقارير دورية"],
  },
];

function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="الأسعار"
        title={<>أسعار شفافة — <span className="text-gradient">عرض يناسب مشروعك.</span></>}
        desc="لا نضع أسعاراً ثابتة مبالغاً فيها أو غير دقيقة. بعد فهم نطاق العمل نرسل عرض سعر مخصص بالريال السعودي."
      />

      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 md:grid-cols-3">
            {PACKAGES.map((p) => (
              <article key={p.name} className="surface-card p-6 flex flex-col">
                <h2 className="text-lg font-bold">{p.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{p.blurb}</p>
                <p className="mt-4 text-sm font-semibold text-primary">تبدأ الأسعار حسب النطاق — اطلب عرضاً</p>
                <ul className="mt-4 space-y-2">
                  {p.points.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-ghost mt-6 w-full justify-center text-sm">
                  اطلب عرض سعر
                  <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 surface-card p-8 text-center max-w-2xl mx-auto">
            <MessageCircle className="h-8 w-8 text-primary mx-auto" />
            <h2 className="mt-4 text-xl font-bold">هل تحتاج باقة مخصصة؟</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              أخبرنا عن نشاطك والهدف من الموقع — نجهّز عرض سعر واضح خلال وقت قصير دون التزام.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary">
                تواصل معنا
                <ArrowLeft className="h-4 w-4 rtl-flip" />
              </Link>
              <Link to="/services" className="btn-ghost">
                استكشف الخدمات
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
