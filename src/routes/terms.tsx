import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, Calendar, FileText, Globe, Mail, Phone, Scale } from "lucide-react";
import { PageIntro } from "@/components/site/SectionIntro";
import { LocaleLink } from "@/components/site/LocaleLink";
import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE_SA,
  SITE_NAME,
  SITE_PRODUCTION_URL,
} from "@/lib/site-config";
import { formatSaPhoneIntl, telHref } from "@/lib/phone";
import { buildPageHead, breadcrumbSchema, jsonLdScript } from "@/lib/seo";
import { useLocale } from "@/providers/LocaleProvider";
import { TermsBodyEn } from "@/components/site/TermsBodyEn";

export const Route = createFileRoute("/terms")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/terms", statusCode: 301 });
  },
});

const TERMS_NAV = [
  { n: 1, title: "نبذة عن الخدمات" },
  { n: 2, title: "الموافقة على الشروط" },
  { n: 3, title: "طلب الخدمات" },
  { n: 4, title: "عروض الأسعار ونطاق العمل" },
  { n: 5, title: "الأسعار والدفع" },
  { n: 6, title: "التعديلات على المشروع" },
  { n: 7, title: "مدة تنفيذ المشاريع" },
  { n: 8, title: "مسؤوليات العميل" },
  { n: 9, title: "الدومين والاستضافة والحسابات الخارجية" },
  { n: 10, title: "خدمات تحسين محركات البحث SEO" },
  { n: 11, title: "خدمات التسويق والإعلانات" },
  { n: 12, title: "المحتوى والمواد التي يقدمها العميل" },
  { n: 13, title: "الملكية الفكرية" },
  { n: 14, title: "عرض المشروع في معرض الأعمال" },
  { n: 15, title: "السرية" },
  { n: 16, title: "حسابات الدخول وكلمات المرور" },
  { n: 17, title: "الخدمات الخارجية" },
  { n: 18, title: "النسخ الاحتياطية" },
  { n: 19, title: "الصيانة والدعم" },
  { n: 20, title: "إيقاف أو إنهاء المشروع" },
  { n: 21, title: "سياسة الاسترداد" },
  { n: 22, title: "الاستخدام غير القانوني" },
  { n: 23, title: "حدود المسؤولية" },
  { n: 24, title: "القوة القاهرة" },
  { n: 25, title: "تعديل الشروط" },
  { n: 26, title: "روابط ومواقع الطرف الثالث" },
  { n: 27, title: "التواصل الإلكتروني" },
  { n: 28, title: "دقة المعلومات" },
  { n: 29, title: "القانون والاختصاص القضائي" },
  { n: 30, title: "أولوية العقد أو الاتفاق" },
  { n: 31, title: "التواصل معنا" },
  { n: 32, title: "الإقرار" },
] as const;

const TERMS_NAV_EN = [
  { n: 1, title: "About the services" },
  { n: 2, title: "Acceptance of terms" },
  { n: 3, title: "Requesting services" },
  { n: 4, title: "Quotes and scope of work" },
  { n: 5, title: "Pricing and payment" },
  { n: 6, title: "Project changes" },
  { n: 7, title: "Project timelines" },
  { n: 8, title: "Client responsibilities" },
  { n: 9, title: "Domain, hosting, and external accounts" },
  { n: 10, title: "SEO services" },
  { n: 11, title: "Marketing and advertising services" },
  { n: 12, title: "Client-provided content and materials" },
  { n: 13, title: "Intellectual property" },
  { n: 14, title: "Showing the project in our portfolio" },
  { n: 15, title: "Confidentiality" },
  { n: 16, title: "Login accounts and passwords" },
  { n: 17, title: "Third-party services" },
  { n: 18, title: "Backups" },
  { n: 19, title: "Maintenance and support" },
  { n: 20, title: "Suspending or ending a project" },
  { n: 21, title: "Refund policy" },
  { n: 22, title: "Unlawful use" },
  { n: 23, title: "Limitation of liability" },
  { n: 24, title: "Force majeure" },
  { n: 25, title: "Changes to these terms" },
  { n: 26, title: "Third-party links and sites" },
  { n: 27, title: "Electronic communication" },
  { n: 28, title: "Accuracy of information" },
  { n: 29, title: "Governing law and jurisdiction" },
  { n: 30, title: "Priority of contract or agreement" },
  { n: 31, title: "Contact us" },
  { n: 32, title: "Acknowledgement" },
] as const;

function termsNavFor(locale: "ar" | "en") {
  return locale === "en" ? TERMS_NAV_EN : TERMS_NAV;
}

function TermsToc({ activeId }: { activeId: string }) {
  const activeN = Number(activeId.replace("term-", "")) || 1;
  const { m, t, locale } = useLocale();
  const nav = termsNavFor(locale);

  return (
    <div className="min-w-0">
      <nav className="legal-toc-mobile" aria-label={m.legal.toc}>
        {nav.map((item) => (
          <a
            key={item.n}
            href={`#term-${item.n}`}
            className={activeId === `term-${item.n}` ? "is-active" : undefined}
          >
            {item.n}. {item.title}
          </a>
        ))}
      </nav>
      <aside className="legal-toc">
        <div className="legal-toc-panel">
          <div className="legal-toc-head">
            <p className="legal-toc-title">{m.legal.toc}</p>
            <p className="legal-toc-progress">
              {t(m.legal.progress, {
                n: String(activeN).padStart(2, "0"),
                total: nav.length,
              })}
            </p>
          </div>
          <nav className="legal-toc-list" aria-label={m.legal.toc}>
            {nav.map((item) => (
              <a
                key={item.n}
                href={`#term-${item.n}`}
                className={activeId === `term-${item.n}` ? "is-active" : undefined}
              >
                <span className="legal-toc-num">{String(item.n).padStart(2, "0")}</span>
                <span className="legal-toc-label">{item.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}

function TermsSection({ n, children }: { n: number; children: ReactNode }) {
  const { locale } = useLocale();
  const title = termsNavFor(locale).find((item) => item.n === n)?.title ?? "";
  return (
    <section id={`term-${n}`} className="legal-card">
      <div className="legal-card-head">
        <span className="legal-card-num">{String(n).padStart(2, "0")}</span>
        <h2>{title}</h2>
      </div>
      <div className="legal-card-body">{children}</div>
    </section>
  );
}

function TermsList({ items }: { items: string[] }) {
  return (
    <ul className="legal-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TermsPage() {
  const phoneDisplay = formatSaPhoneIntl(SITE_CONTACT_PHONE_SA);
  const [activeId, setActiveId] = useState("term-1");
  const { m, t, locale } = useLocale();

  useEffect(() => {
    const nodes = TERMS_NAV.map((item) => document.getElementById(`term-${item.n}`)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [locale]);

  // Keep the active TOC item visible inside the TOC scroller only —
  // never call scrollIntoView (it also scrolls the page and fights the user).
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
      const panel = document.querySelector<HTMLElement>(".legal-toc-panel");
      const el = panel?.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
      if (!panel || !el) return;

      const panelRect = panel.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const pad = 12;
      if (elRect.top >= panelRect.top + pad && elRect.bottom <= panelRect.bottom - pad) return;

      const delta = elRect.top - panelRect.top - panel.clientHeight / 2 + elRect.height / 2;
      panel.scrollTo({ top: panel.scrollTop + delta, behavior: "smooth" });
      return;
    }

    const strip = document.querySelector<HTMLElement>(".legal-toc-mobile");
    const el = strip?.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (!strip || !el) return;

    const stripRect = strip.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.left >= stripRect.left && elRect.right <= stripRect.right) return;

    const delta = elRect.left - stripRect.left - strip.clientWidth / 2 + elRect.width / 2;
    strip.scrollTo({ left: strip.scrollLeft + delta, behavior: "smooth" });
  }, [activeId]);

  return (
    <>
      <PageIntro
        eyebrow={m.legal.eyebrow}
        title={m.legal.termsTitle}
        desc={t(m.legal.termsDesc, { name: SITE_NAME })}
      />

      <section className="section tone-tinted">
        <div className="container-page">
          <div className="legal-meta -mt-2 mb-8">
            <span className="legal-meta-chip legal-meta-chip--date">
              <Calendar className="h-3.5 w-3.5" />
              {m.legal.lastUpdate}
            </span>
            <span className="legal-meta-chip legal-meta-chip--count">
              <Scale className="h-3.5 w-3.5" />
              {m.legal.articlesCount}
            </span>
            <LocaleLink to="/privacy" className="legal-meta-chip legal-meta-chip--privacy">
              <FileText className="h-3.5 w-3.5" />
              {m.legal.privacy}
            </LocaleLink>
          </div>

          <div className="legal-layout">
            <TermsToc activeId={activeId} />

            <div className="legal-stack">
              {locale === "en" ? (
                <TermsBodyEn phoneDisplay={phoneDisplay} />
              ) : (
                <>
              <div className="legal-intro">
                <p className="font-semibold text-foreground">{t(m.legal.welcome, { name: SITE_NAME })}</p>
                <p>
                  باستخدامك هذا الموقع أو طلبك لأي من خدماتنا، فإنك توافق على الالتزام بالشروط
                  والأحكام الموضحة في هذه الصفحة. يرجى قراءتها بعناية قبل استخدام الموقع أو التعاقد
                  معنا.
                </p>
                <p>
                  في هذه الشروط، يُشار إلى {SITE_NAME} بعبارات مثل «الشركة» أو «نحن» أو «لنا»،
                  ويُشار إلى مستخدم الموقع أو العميل بعبارات مثل «العميل» أو «أنت» أو «المستخدم».
                </p>
              </div>


          <TermsSection n={1}>
            <p>
              تقدم {SITE_NAME} خدمات رقمية وتسويقية تشمل، على سبيل المثال لا الحصر:
            </p>
            <TermsList
              items={[
                "تصميم وتطوير المواقع الإلكترونية.",
                "تصميم وتطوير المتاجر الإلكترونية.",
                "تصميم واجهات وتجربة المستخدم UI/UX.",
                "تحسين محركات البحث SEO.",
                "إدارة وتحسين المواقع الإلكترونية.",
                "إدارة المحتوى.",
                "التسويق الرقمي.",
                "إدارة حسابات التواصل الاجتماعي.",
                "إعداد وتطوير المحتوى الرقمي.",
                "خدمات الدعم والصيانة والتحديثات.",
                "الاستشارات الرقمية والتسويقية.",
                "وأي خدمات رقمية أخرى يتم الاتفاق عليها بين الشركة والعميل.",
              ]}
            />
            <p>
              ويتم تحديد نطاق كل مشروع أو خدمة وفقًا للعرض أو الاتفاق أو الفاتورة أو العقد المقدم
              للعميل.
            </p>
          </TermsSection>

          <TermsSection n={2}>
            <p>باستخدام الموقع أو طلب أي خدمة من {SITE_NAME}، فإنك تقر بأنك:</p>
            <TermsList
              items={[
                "قرأت هذه الشروط وفهمتها.",
                "توافق على الالتزام بها.",
                "لديك الأهلية القانونية اللازمة لإبرام الاتفاقات المتعلقة بالخدمات.",
                "ستقدم معلومات صحيحة ودقيقة عند طلب الخدمات.",
                "تتحمل مسؤولية التأكد من أن المعلومات والمواد التي تقدمها للشركة لا تنتهك حقوق أي طرف آخر.",
              ]}
            />
            <p>إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع أو طلب الخدمات.</p>
          </TermsSection>

          <TermsSection n={3}>
            <p>
              يمكن للعميل طلب الخدمات من خلال الموقع أو وسائل التواصل أو البريد الإلكتروني أو أي
              وسيلة اتصال أخرى تعتمدها الشركة.
            </p>
            <p>
              لا يُعتبر إرسال طلب الخدمة أو التواصل مع الشركة بمثابة قبول نهائي للمشروع ما لم يتم
              تأكيد الطلب والاتفاق على نطاق العمل والتكلفة والمدة وشروط الدفع.
            </p>
            <p>يجوز للشركة رفض أي طلب خدمة أو عدم قبول أي مشروع وفقًا لتقديرها.</p>
          </TermsSection>

          <TermsSection n={4}>
            <p>يتم تحديد سعر كل مشروع بناءً على المتطلبات التي يقدمها العميل.</p>
            <p>قد يتضمن عرض السعر:</p>
            <TermsList
              items={[
                "نطاق العمل.",
                "الخدمات المشمولة.",
                "مدة التنفيذ المتوقعة.",
                "عدد التعديلات.",
                "قيمة المشروع.",
                "جدول الدفعات.",
                "الخدمات أو المزايا غير المشمولة.",
              ]}
            />
            <p>
              أي طلبات إضافية خارج نطاق العمل المتفق عليه قد تخضع لتكلفة إضافية ومدة تنفيذ إضافية.
            </p>
            <p>
              ويُعتبر أي تغيير جوهري في متطلبات المشروع أو إضافة وظائف جديدة أو صفحات أو أنظمة أو
              تكاملات خارج النطاق الأصلي طلبًا إضافيًا.
            </p>
          </TermsSection>

          <TermsSection n={5}>
            <p>يتم تحديد قيمة الخدمات وفقًا لعرض السعر أو الاتفاق المقدم للعميل.</p>
            <p>قد تتطلب بعض المشاريع دفع مقدم قبل بدء العمل.</p>
            <p>لا تبدأ الشركة تنفيذ بعض المشاريع إلا بعد استلام الدفعة المتفق عليها.</p>
            <p>في حالة وجود دفعات مرحلية، يلتزم العميل بسداد كل دفعة في موعدها.</p>
            <p>
              في حال تأخر العميل عن سداد دفعة مستحقة، يحق للشركة تعليق العمل مؤقتًا حتى استلام الدفعة
              المطلوبة.
            </p>
            <p>ولا تُعتبر فترة توقف المشروع بسبب تأخر الدفعات جزءًا من مدة التنفيذ الأصلية.</p>
          </TermsSection>

          <TermsSection n={6}>
            <p>
              تشمل المشاريع عددًا محددًا من التعديلات إذا كان ذلك موضحًا في عرض السعر أو الاتفاق.
            </p>
            <p>التعديل المقصود هو التعديل على العمل المتفق عليه ضمن نطاق المشروع.</p>
            <p>
              أما إعادة تصميم المشروع بالكامل أو تغيير الفكرة الأساسية أو إضافة وظائف جديدة أو تغيير
              المتطلبات الرئيسية بعد بدء التنفيذ، فقد تُعامل كطلب إضافي.
            </p>
            <p>ويحق للشركة تحديد التكلفة والمدة الإضافية المطلوبة لأي أعمال خارج النطاق.</p>
          </TermsSection>

          <TermsSection n={7}>
            <p>يتم تحديد مدة التنفيذ بشكل تقديري بناءً على حجم المشروع ومتطلباته.</p>
            <p>قد تتأثر مدة التنفيذ بسبب:</p>
            <TermsList
              items={[
                "تأخر العميل في إرسال المحتوى أو البيانات.",
                "تأخر العميل في اعتماد التصميمات.",
                "طلب تعديلات إضافية.",
                "تأخر الدفع.",
                "مشاكل أو أعطال في خدمات الطرف الثالث.",
                "تغييرات في نطاق المشروع.",
                "ظروف تقنية أو تشغيلية خارجة عن سيطرة الشركة.",
              ]}
            />
            <p>ولا تتحمل الشركة مسؤولية التأخير الناتج بشكل مباشر عن العميل أو عن أطراف خارجية.</p>
          </TermsSection>

          <TermsSection n={8}>
            <p>
              يلتزم العميل بتوفير جميع المعلومات والمواد اللازمة لتنفيذ المشروع، بما في ذلك عند
              الحاجة:
            </p>
            <TermsList
              items={[
                "النصوص.",
                "الصور.",
                "الشعارات.",
                "بيانات التواصل.",
                "بيانات المنتجات والخدمات.",
                "معلومات الحسابات.",
                "المحتوى التسويقي.",
                "أي متطلبات تقنية ضرورية.",
              ]}
            />
            <p>
              ويتحمل العميل مسؤولية التأكد من امتلاكه الحقوق القانونية لاستخدام المواد التي يرسلها
              إلى الشركة.
            </p>
            <p>كما يتحمل العميل مسؤولية مراجعة واعتماد المحتوى والمعلومات النهائية قبل نشرها.</p>
          </TermsSection>

          <TermsSection n={9}>
            <p>قد تعتمد بعض الخدمات على منصات أو خدمات خارجية مثل:</p>
            <TermsList
              items={[
                "خدمات تسجيل النطاقات.",
                "الاستضافة.",
                "خدمات البريد الإلكتروني.",
                "Google.",
                "Meta.",
                "Firebase.",
                "Vercel.",
                "خدمات الدفع.",
                "أدوات التحليلات.",
                "خدمات التسويق والإعلانات.",
                "أي خدمات أو منصات أخرى يتم استخدامها في المشروع.",
              ]}
            />
            <p>تخضع هذه الخدمات لشروط وأحكام وسياسات مزوديها.</p>
            <p>
              لا تتحمل {SITE_NAME} مسؤولية أي تغيير أو إيقاف أو عطل أو فقدان خدمة ناتج عن مزود خدمة
              خارجي، ما لم يكن ذلك نتيجة مباشرة لإهمال أو خطأ من الشركة.
            </p>
            <p>
              وفي حالة تسجيل الدومين أو إنشاء الحسابات باسم العميل، تظل ملكية الحسابات والبيانات
              للعميل وفقًا لشروط مزود الخدمة.
            </p>
          </TermsSection>

          <TermsSection n={10}>
            <p>
              تهدف خدمات SEO إلى تحسين ظهور الموقع وأدائه في محركات البحث باستخدام ممارسات
              واستراتيجيات مناسبة.
            </p>
            <p>ومع ذلك، لا تضمن {SITE_NAME}:</p>
            <TermsList
              items={[
                "الوصول إلى المركز الأول في Google.",
                "تحقيق عدد محدد من الزيارات.",
                "تحقيق عدد محدد من العملاء أو المبيعات.",
                "ظهور جميع الكلمات المفتاحية في نتائج البحث.",
                "تحقيق نتائج محددة خلال فترة زمنية معينة.",
              ]}
            />
            <p>
              تتأثر نتائج SEO بعوامل كثيرة، منها المنافسة، تحديثات محركات البحث، جودة المحتوى، عمر
              الموقع، المجال، سلوك المستخدمين وعوامل خارجية أخرى.
            </p>
            <p>
              لذلك فإن أي نتائج أو مؤشرات أداء يتم تقديمها تعتبر أهدافًا أو تقديرات وليست ضمانًا
              لنتيجة محددة.
            </p>
          </TermsSection>

          <TermsSection n={11}>
            <p>
              في حالة تقديم خدمات التسويق الرقمي أو إدارة الحملات الإعلانية، فإن رسوم إدارة الخدمة
              منفصلة عن الميزانية الإعلانية ما لم يتم الاتفاق على خلاف ذلك.
            </p>
            <p>وتُدفع ميزانية الإعلانات للمنصة الإعلانية المعنية أو وفق آلية الدفع المتفق عليها.</p>
            <p>لا تضمن {SITE_NAME} عددًا محددًا من:</p>
            <TermsList
              items={[
                "العملاء.",
                "الرسائل.",
                "المكالمات.",
                "المبيعات.",
                "الزيارات.",
                "المشاهدات.",
                "المتابعين.",
              ]}
            />
            <p>
              حيث تعتمد النتائج على عوامل متعددة، منها السوق والجمهور والميزانية والمنافسة والمنصة
              والمحتوى وسلوك المستخدمين.
            </p>
          </TermsSection>

          <TermsSection n={12}>
            <p>يقر العميل بأنه يمتلك أو لديه التصاريح اللازمة لاستخدام أي محتوى يقدمه للشركة.</p>
            <p>ويشمل ذلك:</p>
            <TermsList
              items={[
                "الصور.",
                "الفيديوهات.",
                "النصوص.",
                "الشعارات.",
                "العلامات التجارية.",
                "التصاميم.",
                "المستندات.",
                "البيانات.",
              ]}
            />
            <p>
              ولا تتحمل {SITE_NAME} مسؤولية أي مطالبة قانونية ناتجة عن استخدام محتوى قدمه العميل دون
              امتلاك الحقوق اللازمة لاستخدامه.
            </p>
          </TermsSection>

          <TermsSection n={13}>
            <p>
              بعد سداد كامل المبالغ المستحقة عن المشروع، تنتقل للعميل الحقوق المتفق عليها في الأعمال
              النهائية التي تم تسليمها، وذلك وفقًا لما تم الاتفاق عليه في عرض السعر أو العقد.
            </p>
            <p>ولا يشمل ذلك بالضرورة:</p>
            <TermsList
              items={[
                "الأدوات البرمجية العامة.",
                "المكتبات مفتوحة المصدر.",
                "الأكواد أو الأنظمة السابقة التي تملكها الشركة.",
                "القوالب أو المكونات القابلة لإعادة الاستخدام.",
                "الأدوات والخدمات الخارجية.",
                "التراخيص الخاصة بأطراف ثالثة.",
              ]}
            />
            <p>
              ويحتفظ كل طرف بحقوق الملكية الفكرية الخاصة بالمواد التي كان يمتلكها قبل بدء المشروع.
            </p>
          </TermsSection>

          <TermsSection n={14}>
            <p>
              يجوز لـ {SITE_NAME}، ما لم يتم الاتفاق كتابيًا على خلاف ذلك، عرض اسم المشروع أو صور من
              التصميم أو رابط الموقع النهائي ضمن معرض أعمال الشركة أو المواد التسويقية الخاصة بها.
            </p>
            <p>
              إذا كان المشروع سريًا أو يتطلب عدم نشره، يجب على العميل إبلاغ الشركة بذلك قبل أو أثناء
              التعاقد.
            </p>
          </TermsSection>

          <TermsSection n={15}>
            <p>
              تلتزم {SITE_NAME} بالحفاظ على سرية المعلومات غير العامة التي يحصل عليها فريق العمل من
              العميل في إطار تنفيذ المشروع.
            </p>
            <p>
              ولا يجوز استخدام المعلومات السرية إلا بالقدر اللازم لتنفيذ الخدمات المتفق عليها،
              باستثناء الحالات التي يفرض فيها القانون الإفصاح عنها.
            </p>
          </TermsSection>

          <TermsSection n={16}>
            <p>قد يحتاج فريق العمل إلى الوصول إلى بعض الحسابات والخدمات لتنفيذ المشروع.</p>
            <p>يلتزم العميل بتوفير الصلاحيات اللازمة بطريقة آمنة.</p>
            <p>
              ولا يجوز للعميل مشاركة كلمات المرور أو مفاتيح API أو بيانات الدخول الحساسة عبر قنوات
              غير آمنة متى توفرت طريقة أكثر أمانًا لمشاركة الصلاحيات.
            </p>
            <p>وتلتزم الشركة باستخدام صلاحيات الوصول فقط في حدود تنفيذ الخدمات المتفق عليها.</p>
          </TermsSection>

          <TermsSection n={17}>
            <p>قد تعتمد بعض أجزاء المشروع على خدمات أو منصات خارجية.</p>
            <p>
              وفي حال حدوث تغيير في سياسة أو أسعار أو وظائف أو API أو شروط أي خدمة خارجية، فقد يتطلب
              ذلك تعديلًا تقنيًا أو ماليًا على المشروع.
            </p>
            <p>لا تتحمل الشركة مسؤولية القرارات أو التغييرات التي تقوم بها الجهات الخارجية.</p>
          </TermsSection>

          <TermsSection n={18}>
            <p>يُنصح العميل دائمًا بالاحتفاظ بنسخ احتياطية مستقلة من بياناته وملفاته المهمة.</p>
            <p>
              وفي حالة عدم وجود اتفاق منفصل على خدمة النسخ الاحتياطي، لا تعتبر النسخ الاحتياطية
              الشاملة لجميع بيانات العميل جزءًا تلقائيًا من خدمات الشركة.
            </p>
          </TermsSection>

          <TermsSection n={19}>
            <p>الدعم والصيانة بعد تسليم المشروع يخضعان لنطاق الخدمة أو الباقة المتفق عليها.</p>
            <p>وقد تشمل الصيانة:</p>
            <TermsList
              items={[
                "إصلاح الأخطاء البرمجية المتعلقة بالمشروع.",
                "تحديثات بسيطة.",
                "تعديلات محتوى.",
                "تحديثات تقنية محددة.",
              ]}
            />
            <p>
              ولا تشمل بالضرورة إعادة بناء الموقع أو إضافة وظائف جديدة أو تطوير أنظمة جديدة، إلا إذا
              تم الاتفاق على ذلك.
            </p>
          </TermsSection>

          <TermsSection n={20}>
            <p>يجوز لأي طرف طلب إنهاء المشروع وفقًا لشروط الاتفاق المبرم بين الطرفين.</p>
            <p>
              في حالة إلغاء المشروع بعد بدء العمل، يتم تحديد المستحقات المالية بناءً على الأعمال التي
              تم تنفيذها حتى تاريخ الإلغاء، وأي شروط أخرى منصوص عليها في العقد أو عرض السعر.
            </p>
            <p>ويحق للشركة تعليق أو إنهاء الخدمة في حالة:</p>
            <TermsList
              items={[
                "عدم سداد المستحقات.",
                "إساءة استخدام خدمات الشركة.",
                "تقديم معلومات مضللة.",
                "استخدام الخدمات في أنشطة غير قانونية.",
                "انتهاك حقوق الشركة أو الغير.",
                "مخالفة هذه الشروط.",
              ]}
            />
          </TermsSection>

          <TermsSection n={21}>
            <p>تخضع عمليات الاسترداد لشروط الاتفاق أو عرض السعر الخاص بالخدمة.</p>
            <p>
              نظرًا لأن بعض الخدمات الرقمية تتضمن وقتًا وجهدًا وأعمالًا مخصصة للعميل، فقد لا يكون من
              الممكن استرداد المبالغ الخاصة بالأعمال التي تم تنفيذها بالفعل.
            </p>
            <p>
              ويتم تقييم أي طلب استرداد وفقًا لحالة المشروع والخدمة والمدفوعات والأعمال المنفذة.
            </p>
          </TermsSection>

          <TermsSection n={22}>
            <p>يحظر استخدام الموقع أو خدمات {SITE_NAME} في:</p>
            <TermsList
              items={[
                "أي نشاط يخالف القوانين المعمول بها.",
                "الاحتيال أو الخداع.",
                "انتهاك حقوق الملكية الفكرية.",
                "نشر محتوى غير قانوني.",
                "اختراق أو محاولة اختراق الأنظمة.",
                "نشر برمجيات ضارة.",
                "إرسال رسائل مزعجة أو غير مرغوب فيها.",
                "انتحال شخصية أشخاص أو جهات أخرى.",
                "أي نشاط قد يضر بالشركة أو عملائها أو أطراف أخرى.",
              ]}
            />
            <p>ويحق للشركة اتخاذ الإجراءات المناسبة في حالة اكتشاف أي استخدام مخالف.</p>
          </TermsSection>

          <TermsSection n={23}>
            <p>
              نبذل في {SITE_NAME} قصارى جهدنا لتقديم خدمات احترافية وموثوقة، إلا أن بعض النتائج تعتمد
              على عوامل خارجة عن سيطرتنا.
            </p>
            <p>لا تتحمل الشركة المسؤولية عن الأضرار الناتجة عن:</p>
            <TermsList
              items={[
                "أعطال خدمات الطرف الثالث.",
                "مشاكل الاستضافة أو الدومين الخارجة عن سيطرة الشركة.",
                "تغييرات محركات البحث.",
                "إيقاف أو حظر حسابات العميل من منصات خارجية.",
                "المحتوى الذي قدمه العميل.",
                "استخدام العميل للخدمات بطريقة غير صحيحة.",
                "فقدان البيانات بسبب عدم وجود نسخ احتياطية عند عدم الاتفاق على توفيرها.",
                "أحداث أو ظروف خارجة عن السيطرة المعقولة للشركة.",
              ]}
            />
          </TermsSection>

          <TermsSection n={24}>
            <p>
              لا تتحمل الشركة مسؤولية التأخير أو عدم القدرة على تنفيذ الخدمة نتيجة ظروف خارجة عن
              السيطرة المعقولة، مثل:
            </p>
            <TermsList
              items={[
                "الكوارث الطبيعية.",
                "انقطاع واسع للخدمات.",
                "أعطال البنية التحتية.",
                "الحروب أو الاضطرابات.",
                "القرارات الحكومية.",
                "الهجمات الإلكترونية واسعة النطاق.",
                "الأعطال الكبرى لدى مزودي الخدمات.",
                "أي ظروف استثنائية أخرى خارجة عن السيطرة المعقولة.",
              ]}
            />
          </TermsSection>

          <TermsSection n={25}>
            <p>يجوز لـ {SITE_NAME} تحديث أو تعديل هذه الشروط من وقت لآخر.</p>
            <p>سيتم نشر النسخة المحدثة على هذه الصفحة مع تحديث تاريخ «آخر تحديث».</p>
            <p>ويُنصح المستخدمون بمراجعة هذه الصفحة بشكل دوري.</p>
          </TermsSection>

          <TermsSection n={26}>
            <p>قد يحتوي الموقع على روابط لمواقع أو خدمات تابعة لأطراف أخرى.</p>
            <p>
              هذه الروابط يتم توفيرها لراحة المستخدم فقط، ولا يعني وجودها أن {SITE_NAME} تتحمل
              مسؤولية محتوى أو سياسات أو خدمات تلك المواقع.
            </p>
            <p>
              ويُنصح المستخدم بمراجعة شروط وأحكام وسياسات الخصوصية الخاصة بأي موقع خارجي قبل
              استخدامه.
            </p>
          </TermsSection>

          <TermsSection n={27}>
            <p>
              عند التواصل مع {SITE_NAME} عبر البريد الإلكتروني أو وسائل التواصل أو النماذج الموجودة
              في الموقع، فإنك توافق على استخدام وسائل الاتصال الإلكترونية للتواصل معك بشأن الخدمات
              والطلبات والمشاريع.
            </p>
          </TermsSection>

          <TermsSection n={28}>
            <p>
              تسعى {SITE_NAME} إلى تقديم معلومات دقيقة ومحدثة على الموقع، إلا أننا لا نضمن أن جميع
              المعلومات الموجودة على الموقع ستكون خالية من الأخطاء أو محدثة في جميع الأوقات.
            </p>
            <p>قد يتم تعديل الخدمات والأسعار والمحتوى دون إشعار مسبق.</p>
            <p>
              ولا يؤثر ذلك على المشاريع التي تم الاتفاق عليها بعقد أو عرض سعر مستقل، والتي تخضع
              للشروط المتفق عليها بين الطرفين.
            </p>
          </TermsSection>

          <TermsSection n={29}>
            <p>
              تخضع هذه الشروط للقوانين والأنظمة المعمول بها في الدولة أو الولاية القضائية المحددة في
              العقد المبرم مع العميل.
            </p>
            <p>
              وفي حالة عدم وجود عقد مستقل يحدد القانون المختص، يتم التعامل مع أي نزاع وفقًا للقوانين
              والاختصاص القضائي الذي تحدده الشركة والعميل في الاتفاق التجاري المبرم بينهما.
            </p>
          </TermsSection>

          <TermsSection n={30}>
            <p>
              في حالة وجود تعارض بين هذه الشروط وبين عقد أو عرض سعر أو اتفاق مكتوب وموقع بين{" "}
              {SITE_NAME} والعميل، تكون الأولوية لما تم الاتفاق عليه صراحة في العقد أو الاتفاق الخاص
              بالمشروع، في حدود ذلك التعارض.
            </p>
          </TermsSection>

          <TermsSection n={31}>
            <p>
              إذا كان لديك أي سؤال يتعلق بهذه الشروط أو خدمات {SITE_NAME}، يمكنك التواصل معنا من
              خلال:
            </p>
            <div className="legal-contacts">
              <a href={SITE_PRODUCTION_URL} className="legal-contact legal-contact--web">
                <span className="legal-contact-icon">
                  <Globe className="h-4 w-4" />
                </span>
                <span className="legal-contact-copy">
                  <span>الموقع الإلكتروني</span>
                  <strong dir="ltr">{SITE_PRODUCTION_URL.replace("https://", "")}</strong>
                </span>
              </a>
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="legal-contact legal-contact--mail">
                <span className="legal-contact-icon">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="legal-contact-copy">
                  <span>البريد الإلكتروني</span>
                  <strong dir="ltr">{SITE_CONTACT_EMAIL}</strong>
                </span>
              </a>
              <a
                href={telHref(SITE_CONTACT_PHONE_SA, SITE_CONTACT_PHONE_SA)}
                className="legal-contact legal-contact--phone"
              >
                <span className="legal-contact-icon">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="legal-contact-copy">
                  <span>الهاتف / واتساب</span>
                  <strong dir="ltr">{phoneDisplay}</strong>
                </span>
              </a>
            </div>
          </TermsSection>

          <TermsSection n={32}>
            <p>
              باستخدامك موقع {SITE_NAME} أو طلبك لأي من خدماتنا، فإنك تقر بأنك قرأت هذه الشروط
              والأحكام وفهمتها ووافقت على الالتزام بها، بالإضافة إلى أي شروط أو اتفاقيات خاصة يتم
              الاتفاق عليها بينك وبين {SITE_NAME}.
            </p>
            <div className="legal-signoff">
              <p className="font-semibold text-foreground">{SITE_NAME}</p>
              <p className="text-sm text-muted-foreground" dir="ltr">
                Saudi Identity. Global Digital Ambition.
              </p>
            </div>
          </TermsSection>

              <div className="legal-cta">
                <h2 className="page-intro-title page-intro-title--section">{m.legal.question}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {m.legal.questionDesc}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <LocaleLink to="/contact" className="btn-primary">
                    {m.common.contactUs} <ArrowRight className="h-4 w-4 rtl-flip" />
                  </LocaleLink>
                  <LocaleLink to="/privacy" className="btn-ghost">
                    {m.legal.privacy}
                  </LocaleLink>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
