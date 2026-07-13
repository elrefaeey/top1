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
      d: "أن نكون الشريك الرقمي الموثوق للشركات في السعودية والخليج لبناء حضور إلكتروني يحوّل الزوار إلى عملاء.",
    },
    {
      icon: Target,
      t: "الرسالة",
      d: "نصمّم مواقع ومتاجر وحملات رقمية تركّز على السرعة، الوضوح، والنتائج القابلة للقياس.",
    },
    {
      icon: Heart,
      t: "القيم",
      d: "الوضوح في التواصل، الجودة في التنفيذ، والالتزام بمواعيد التسليم والدعم بعد الإطلاق.",
    },
  ];

  const timeline = [
    {
      y: "البداية",
      t: "تأسيس التوجه",
      d: `انطلقت ${SITE_NAME} لتقديم خدمات تصميم مواقع وتسويق رقمي تناسب احتياجات السوق السعودي والخليجي.`,
    },
    {
      y: "التوسع",
      t: "خدمات متكاملة",
      d: "أضفنا تطوير المتاجر الإلكترونية، SEO، وتجربة المستخدم ضمن فريق واحد مسؤول عن النتيجة.",
    },
    {
      y: "اليوم",
      t: "شراكة للنمو",
      d: "نعمل مع علامات وشركات تريد حضوراً رقمياً واضحاً: مواقع أسرع، ظهور أفضل في Google، وتحويل أعلى.",
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
                وكالة رقمية ل<span className="text-gradient">السوق السعودي والخليج.</span>
              </h1>
              <p className="page-intro-desc lg:mx-0">
                {SITE_NAME} متخصصة في تصميم المواقع، المتاجر الإلكترونية، تحسين محركات البحث، والتسويق
                الرقمي. نساعد الشركات على بناء حضور أونلاين احترافي يركز على تجربة المستخدم ونتائج
                واضحة في الرياض وجدة والدمام ودول الخليج.
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
        <div className="container-page max-w-3xl">
          <span className="page-intro-eyebrow">ماذا نقدّم؟</span>
          <h2 className="page-intro-title page-intro-title--section">خدمات عملية لنمو أعمالك.</h2>
          <p className="page-intro-desc !max-w-none mt-3">
            من الهوية الرقمية وتصميم الواجهات إلى إطلاق الموقع وتحسين ظهوره في Google — نعمل بخطوات
            واضحة وتحديثات مستمرة حتى الإطلاق وما بعده.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/services" className="btn-ghost">
              خدماتنا
            </Link>
            <Link to="/portfolio" className="btn-ghost">
              أعمالنا
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl page-intro-block">
          <span className="page-intro-eyebrow">
            <Award className="h-3 w-3" /> مسيرتنا
          </span>
          <h2 className="page-intro-title page-intro-title--section">محطات واضحة.</h2>
          <ol className="section-body relative border-s border-border ps-6 space-y-8">
            {timeline.map((t) => (
              <li key={t.y} className="relative">
                <span className="absolute -start-[34px] grid h-6 w-6 place-items-center rounded-full bg-[var(--gradient-primary)] text-white text-[10px] font-bold">
                  ●
                </span>
                <div className="text-xs text-primary font-semibold tracking-wider">{t.y}</div>
                <h3 className="mt-1 font-semibold">{t.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <Link to="/contact" className="btn-primary">
              ابدأ مشروعك معنا <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
