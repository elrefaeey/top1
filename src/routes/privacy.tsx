import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/site/SectionIntro";
import { SITE_CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";
import { useLocale } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildPageHead({
      title: `سياسة الخصوصية | ${SITE_NAME}`,
      description: `تعرّف على كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدام موقع ${SITE_NAME}.`,
      path: "/privacy",
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
  const { m, locale } = useLocale();
  const en = locale === "en";

  return (
    <>
      <PageIntro
        eyebrow={m.legal.eyebrow}
        title={m.legal.privacy}
        desc={en ? m.legal.privacyDesc : m.legal.arabicNotice}
      />
      <section className="section">
        <div className="container-page max-w-3xl prose-legal space-y-8 text-[15px] leading-relaxed text-foreground/90">
          {en ? (
            <>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">1. Who we are</h2>
                <p>
                  {SITE_NAME} is a digital agency offering website design, ecommerce, SEO, and digital
                  marketing for clients in Saudi Arabia and the UAE. Enquiries:{" "}
                  <a href={`mailto:${SITE_CONTACT_EMAIL}`} dir="ltr" className="text-primary">
                    {SITE_CONTACT_EMAIL}
                  </a>
                  .
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">2. Data we collect</h2>
                <p>We may collect the following when you contact us via the form, WhatsApp, or email:</p>
                <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
                  <li>Name, mobile number, and email (if provided)</li>
                  <li>Message content or project details</li>
                  <li>Basic technical data such as IP address and browser type (via analytics tools)</li>
                </ul>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">3. How we use data</h2>
                <ul className="list-disc ps-6 space-y-1 text-muted-foreground">
                  <li>To reply to enquiries and send relevant proposals</li>
                  <li>To improve the site, performance, and user experience</li>
                  <li>To measure visits via analytics tools (e.g. Google Analytics) when enabled</li>
                  <li>To meet legal requirements when applicable</li>
                </ul>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">4. Sharing data</h2>
                <p>
                  We do not sell your personal data. Some data may be processed by trusted providers
                  (hosting, email, analytics, cloud storage) solely for operational purposes.
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">5. Cookies</h2>
                <p>
                  The site may use necessary or analytics cookies to run and improve the experience.
                  You can control or delete them in your browser settings.
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">6. Your rights</h2>
                <p>
                  You may request access to, correction of, or deletion of your data by emailing us
                  above, subject to legal and necessary operational retention.
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">7. Updates</h2>
                <p>
                  We may update this policy from time to time. The latest version is published on this
                  page with the update date.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">1. من نحن</h2>
                <p>
                  {SITE_NAME} وكالة رقمية تقدّم خدمات تصميم المواقع، المتاجر الإلكترونية، SEO، والتسويق
                  الرقمي للعملاء في المملكة العربية السعودية والإمارات العربية المتحدة. للاستفسارات:{" "}
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
                  لا نبيع بياناتك الشخصية. قد تُعالج بعض البيانات عبر مزوّدي خدمات موثوقين (استضافة،
                  بريد، تحليلات، تخزين سحابي) ضمن حدود الغرض التشغيلي فقط.
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">5. ملفات تعريف الارتباط (Cookies)</h2>
                <p>
                  قد يستخدم الموقع ملفات تعريف ارتباط ضرورية أو تحليلية لتشغيل الموقع وتحسين التجربة.
                  يمكنك التحكم فيها أو حذفها من إعدادات المتصفح.
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">6. حقوقك</h2>
                <p>
                  يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها عبر مراسلتنا على البريد أعلاه، مع
                  مراعاة الالتزامات القانونية والاحتفاظ التشغيلي اللازم.
                </p>
              </section>
              <section className="space-y-3">
                <h2 className="text-xl font-bold">7. التحديثات</h2>
                <p>
                  قد نحدّث هذه السياسة من وقت لآخر. يُنشر أحدث إصدار على هذه الصفحة مع تاريخ التحديث.
                </p>
              </section>
            </>
          )}
          <p>
            <Link to="/contact" className="btn-ghost inline-flex">
              {m.common.contactUs}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
