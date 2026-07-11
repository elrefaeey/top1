import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/SectionIntro";
import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildPageHead({
      title: `الشروط والأحكام | ${SITE_NAME}`,
      description: `الشروط والأحكام المنظمة لاستخدام موقع وخدمات ${SITE_NAME}.`,
      path: "/terms",
      breadcrumbs: [
        { name: "الرئيسية", path: "/" },
        { name: "الشروط والأحكام", path: "/terms" },
      ],
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: "الرئيسية", path: "/" },
            { name: "الشروط والأحكام", path: "/terms" },
          ]),
        ),
      ],
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="قانوني"
        title="الشروط والأحكام"
        desc={`آخر تحديث: يوليو 2026 — باستخدامك موقع ${SITE_NAME} فإنك توافق على هذه الشروط.`}
      />
      <section className="section">
        <div className="container-page max-w-3xl space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. قبول الشروط</h2>
            <p>
              يوفّر موقع {SITE_NAME} معلومات عن خدماتنا الرقمية. استمرارك في التصفح يعني موافقتك على هذه
              الشروط وعلى{" "}
              <Link to="/privacy" className="text-primary font-medium">
                سياسة الخصوصية
              </Link>
              .
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. طبيعة المحتوى</h2>
            <p>
              المحتوى المنشور للتعريف بخدماتنا ولا يُعد عرضاً ملزماً أو عقداً إلا بعد اتفاق كتابي منفصل
              (عرض سعر / عقد خدمة). الأسعار والنطاقات تُحدَّد حسب كل مشروع.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. استخدام الموقع</h2>
            <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
              <li>يُحظر إساءة استخدام النماذج أو محاولة اختراق الموقع أو تعطيله</li>
              <li>يُحظر نسخ محتوى الموقع لأغراض تجارية دون إذن مسبق</li>
              <li>المعلومات الواردة قد تُحدَّث دون إشعار مسبق</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. الخدمات والنتائج</h2>
            <p>
              نسعى لتقديم عمل احترافي وفق أفضل الممارسات. نتائج SEO والإعلانات والمبيعات تعتمد على عوامل
              متعددة خارج سيطرتنا الكاملة (خوارزميات محركات البحث، ميزانية الإعلان، جودة المنتج، إلخ)،
              ولا نضمن ترتيباً أو عائداً محدداً ما لم يُنص على ذلك صراحة في العقد.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">5. الملكية الفكرية</h2>
            <p>
              تصاميم وعلامات ومواد {SITE_NAME} محمية. تسليم حقوق العمل للعميل يتم وفق بنود العقد المتفق
              عليه لكل مشروع.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">6. إخلاء المسؤولية</h2>
            <p>
              نقدّم الموقع «كما هو». لا نتحمل مسؤولية عن أضرار غير مباشرة ناتجة عن الاعتماد على محتوى
              عام في الموقع دون تعاقد.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">7. التواصل</h2>
            <p>
              للاستفسارات القانونية أو التعاقدية:{" "}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} dir="ltr" className="text-primary">
                {SITE_CONTACT_EMAIL}
              </a>{" "}
              أو عبر{" "}
              <Link to="/contact" className="text-primary font-medium">
                صفحة التواصل
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
