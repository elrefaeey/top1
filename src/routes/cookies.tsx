import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/SectionIntro";
import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";

export const Route = createFileRoute("/cookies")({
  head: () =>
    buildPageHead({
      title: `سياسة ملفات تعريف الارتباط | ${SITE_NAME}`,
      description: `كيف يستخدم موقع ${SITE_NAME} ملفات تعريف الارتباط وأدوات التحليل، وكيف يمكنك التحكم بها.`,
      path: "/cookies",
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: "الرئيسية", path: "/" },
            { name: "ملفات تعريف الارتباط", path: "/cookies" },
          ]),
        ),
      ],
    }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="قانوني"
        title="سياسة ملفات تعريف الارتباط"
        desc={`آخر تحديث: يوليو 2026 — يوضّح هذا البيان استخدام ${SITE_NAME} لملفات تعريف الارتباط وأدوات مشابهة.`}
      />
      <section className="section">
        <div className="container-page max-w-3xl space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. ما هي ملفات تعريف الارتباط؟</h2>
            <p>
              ملفات تعريف الارتباط (Cookies) ملفات صغيرة تُخزَّن على جهازك لتسهيل عمل الموقع، تذكّر
              التفضيلات، أو قياس الأداء والزيارات.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. ما نستخدمه</h2>
            <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
              <li>
                <strong className="text-foreground">ضرورية:</strong> لتشغيل الصفحات والأمان الأساسي
              </li>
              <li>
                <strong className="text-foreground">تحليلية (عند التفعيل):</strong> مثل Google
                Analytics / Firebase Analytics لفهم الصفحات الأكثر زيارة وتحسين التجربة
              </li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. التحكم</h2>
            <p>
              يمكنك حذف أو حظر ملفات تعريف الارتباط من إعدادات المتصفح. قد يؤثر تعطيل بعض الملفات
              على عمل أجزاء من الموقع. راجع أيضاً إعدادات التتبع في متصفحك وخيارات Google إن وُجدت.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. المزيد</h2>
            <p>
              لمزيد عن حماية البيانات راجع{" "}
              <Link to="/privacy" className="text-primary font-medium">
                سياسة الخصوصية
              </Link>
              . للاستفسار:{" "}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} dir="ltr" className="text-primary">
                {SITE_CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
