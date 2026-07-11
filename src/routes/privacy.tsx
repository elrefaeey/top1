import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/SectionIntro";
import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildPageHead({
      title: `سياسة الخصوصية | ${SITE_NAME}`,
      description: `تعرّف على كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدام موقع ${SITE_NAME}.`,
      path: "/privacy",
      breadcrumbs: [
        { name: "الرئيسية", path: "/" },
        { name: "سياسة الخصوصية", path: "/privacy" },
      ],
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: "الرئيسية", path: "/" },
            { name: "سياسة الخصوصية", path: "/privacy" },
          ]),
        ),
      ],
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="قانوني"
        title="سياسة الخصوصية"
        desc={`آخر تحديث: يوليو 2026 — توضّح هذه السياسة كيف تتعامل ${SITE_NAME} مع بياناتك.`}
      />
      <section className="section">
        <div className="container-page max-w-3xl prose-legal space-y-8 text-[15px] leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">1. من نحن</h2>
            <p>
              {SITE_NAME} وكالة رقمية تقدّم خدمات تصميم المواقع، المتاجر الإلكترونية، SEO، والتسويق الرقمي
              للعملاء في السعودية ودول الخليج. للاستفسارات:{" "}
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} dir="ltr" className="text-primary">
                {SITE_CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">2. البيانات التي نجمعها</h2>
            <p>قد نجمع البيانات التالية عند تواصلك معنا عبر النموذج أو واتساب أو البريد:</p>
            <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
              <li>الاسم ورقم الجوال والبريد الإلكتروني (إن وُجد)</li>
              <li>محتوى الرسالة أو تفاصيل المشروع</li>
              <li>بيانات تقنية أساسية مثل عنوان IP ونوع المتصفح (عبر أدوات التحليل)</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">3. كيف نستخدم البيانات</h2>
            <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
              <li>الرد على استفساراتك وتقديم عروض مناسبة</li>
              <li>تحسين الموقع والأداء وتجربة الاستخدام</li>
              <li>قياس الزيارات عبر أدوات التحليل (مثل Google Analytics) عند تفعيلها</li>
              <li>الالتزام بالمتطلبات القانونية عند الاقتضاء</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">4. مشاركة البيانات</h2>
            <p>
              لا نبيع بياناتك الشخصية. قد تُعالج بعض البيانات عبر مزوّدي خدمات موثوقين (استضافة، بريد،
              تحليلات، تخزين سحابي) ضمن حدود الغرض التشغيلي فقط.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">5. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              قد يستخدم الموقع ملفات تعريف ارتباط ضرورية أو تحليلية. راجع{" "}
              <Link to="/cookies" className="text-primary font-medium">
                سياسة ملفات تعريف الارتباط
              </Link>{" "}
              للتفاصيل وخيارات التحكم.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">6. حقوقك</h2>
            <p>
              يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها عبر مراسلتنا على البريد أعلاه، مع مراعاة
              الالتزامات القانونية والاحتفاظ التشغيلي اللازم.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-bold">7. التحديثات</h2>
            <p>قد نحدّث هذه السياسة من وقت لآخر. يُنشر أحدث إصدار على هذه الصفحة مع تاريخ التحديث.</p>
          </section>
          <p>
            <Link to="/contact" className="btn-ghost inline-flex">
              تواصل معنا
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
