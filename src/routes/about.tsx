import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target, Eye, Heart, Award, Sparkles } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { siteImages } from "@/lib/site-images";

import { SITE_NAME } from "@/lib/site-config";

import { buildStaticPageHead } from "@/lib/seo";
import { loadPublishedPageSeoFn } from "@/lib/seo/cms-seo.functions";

export const Route = createFileRoute("/about")({
  loader: () => loadPublishedPageSeoFn({ data: { slug: "about" } }),
  head: ({ loaderData }) =>
    buildStaticPageHead("about", "/about", {
      cms: loaderData,
      breadcrumbs: [
        { name: "الرئيسية", path: "/" },
        { name: "من نحن", path: "/about" },
      ],
    }),
  component: About,
});

function About() {
  const values = [
    {
      icon: Eye,
      t: "الرؤية",
      d: "نبني حضوراً رقمياً واضحاً للشركات في السعودية — مواقع ومتاجر تساعد على تحويل الزوار إلى عملاء.",
    },
    {
      icon: Target,
      t: "الرسالة",
      d: "نقدّم تصميم مواقع، متاجر إلكترونية، SEO، وتسويق رقمي بخطوات بسيطة، تواصل واضح، وتنفيذ يركز على النتيجة.",
    },
    {
      icon: Heart,
      t: "القيم",
      d: "صدق في الوعود، جودة في التنفيذ، ومتابعة بعد الإطلاق — بدون مبالغة وبدون تعقيد.",
    },
  ];

  const timeline = [
    {
      y: "اليوم",
      t: "بدأنا للتو",
      d: `${SITE_NAME} وكالة رقمية جديدة تخدم السعودية. بدأنا مؤخراً ونبني مع كل عميل من الصفر حسب احتياجه.`,
    },
    {
      y: "نركز على",
      t: "خدمات واضحة",
      d: "تصميم مواقع، متاجر إلكترونية، SEO، وتسويق رقمي — بدون وعود مبالغ فيها وبدون تعقيد.",
    },
    {
      y: "معك",
      t: "خطوة بخطوة",
      d: "نستمع لاحتياجك، نصمّم وننفّذ، ثم نطلق ونحسّن معاً بعد الإطلاق.",
    },
  ];

  return (
    <>
      <section className="hero-bg relative overflow-hidden page-intro">
        <div aria-hidden className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="container-page relative page-intro-inner">
          <div className="grid items-center gap-5 lg:grid-cols-2 lg:gap-12">
            <SiteImage
              src={siteImages.about.studio}
              alt={siteImages.about.studioAlt}
              wrapperClassName="order-first lg:order-2 aspect-[16/10] lg:aspect-[4/3] w-full rounded-2xl shadow-[var(--shadow-card-hover)]"
            />
            <div className="order-last lg:order-1 text-center lg:text-start">
              <span className="page-intro-eyebrow">
                <Sparkles className="h-3 w-3" /> عن {SITE_NAME}
              </span>
              <h1 className="page-intro-title">
                وكالة رقمية <span className="text-gradient">للسوق السعودي.</span>
              </h1>
              <p className="page-intro-desc lg:mx-0">
                {SITE_NAME} وكالة رقمية ناشئة متخصصة في تصميم المواقع، المتاجر الإلكترونية، تحسين
                محركات البحث، والتسويق الرقمي. نساعد الشركات في السعودية على بناء حضور أونلاين
                احترافي — من الفكرة إلى الإطلاق — بتركيز على تجربة المستخدم ونتائج قابلة للقياس.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.t} className="surface-card p-7">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--gradient-primary)] text-white">
                <v.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{v.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-surface border-y border-border">
        <div className="container-page">
          <div className="page-intro-block me-auto w-full text-start">
            <span className="page-intro-eyebrow">ماذا نقدّم؟</span>
            <h2 className="page-intro-title page-intro-title--section">خدمات واضحة لنمو عملك.</h2>
            <p className="page-intro-desc !max-w-none mt-3">
              سواء كنت تبدأ حضورك الرقمي أو تريد تطوير موقعك الحالي: نصمّم، نبني، ونحسّن — بخطوات
              مرتبة وتحديثات مستمرة حتى الإطلاق وما بعده.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/services" className="btn-ghost">
                خدماتنا
              </Link>
              <Link to="/contact" className="btn-ghost">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="page-intro-block me-auto w-full text-start">
            <span className="page-intro-eyebrow">
              <Award className="h-3 w-3" /> بدايتنا
            </span>
            <h2 className="page-intro-title page-intro-title--section">
              بدأنا مؤخراً — ونبني معك من اليوم.
            </h2>
            <ol className="section-body relative border-s border-border ps-6 space-y-8">
              {timeline.map((t) => (
                <li key={t.y} className="relative">
                  <span className="absolute -start-[34px] grid h-6 w-6 place-items-center rounded-full bg-[var(--gradient-primary)] text-white text-[10px] font-bold">
                    ●
                  </span>
                  <div className="text-xs font-semibold tracking-wider text-primary">{t.y}</div>
                  <h3 className="mt-1 font-semibold">{t.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12">
              <Link to="/contact" className="btn-primary">
                ابدأ مشروعك معنا <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
