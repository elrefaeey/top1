import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target, Eye, Heart, Award, Users, Sparkles } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { siteImages } from "@/lib/site-images";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `من نحن — ${SITE_NAME}` },
      { name: "description", content: `${SITE_NAME} استوديو منتجات رقمية يبني تجارب رقمية لفرق طموحة. تعرّف على الفريق والرسالة والقيم.` },
      { property: "og:title", content: `من نحن — ${SITE_NAME}` },
      { property: "og:description", content: `تعرّف على فريق ${SITE_NAME} — رسالتنا ورؤيتنا وقيمنا.` },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const values = [
    { icon: Eye, t: "الرؤية", d: "عالم يكون فيه كل منتج رقمي مصنوعاً بإتقان، قابل للقياس، ويستحق الاستخدام." },
    { icon: Target, t: "الرسالة", d: "مساعدة الفرق الطموحة على إطلاق منتجات جميلة تحقق نمواً قابلاً للقياس." },
    { icon: Heart, t: "القيم", d: "الإتقان، الشفافية، الملكية، والميل الدائم للإطلاق." },
  ];
  const team = [
    { n: "عمر حديد", r: "المؤسس وقائد التصميم", photo: siteImages.team.omar },
    { n: "ليلى بناني", r: "قائدة الهندسة", photo: siteImages.team.layla },
    { n: "يوسف كرم", r: "مصمم منتجات أول", photo: siteImages.team.youssef },
    { n: "هناء صالح", r: "قائدة النمو وSEO", photo: siteImages.team.hana },
  ];
  const timeline = [
    { y: "2019", t: "التأسيس", d: `${SITE_NAME} تُطلق في دبي بثلاثة أعضاء مؤسسين.` },
    { y: "2021", t: "توسّع لـ 12", d: "توسّع الفريق في التصميم والهندسة والنمو." },
    { y: "2023", t: "أول جائزة دولية", d: "تكريم في CSS Design Awards كموقع اليوم." },
    { y: "2026", t: "+120 مشروع", d: "نخدم فرقاً طموحة في 14 دولة." },
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
              <span className="page-intro-eyebrow"><Sparkles className="h-3 w-3" /> عن {SITE_NAME}</span>
              <h1 className="page-intro-title">
                استوديو محترف ب<span className="text-gradient">عقلية الحرفي.</span>
              </h1>
              <p className="page-intro-desc lg:mx-0">
                أسّسنا {SITE_NAME} في 2019 بإيمان بسيط: العمل الرقمي يجب أن يكون جميلاً،
                سريعاً، ومبنياً ليتراكم. بعد 7 سنوات و120 مشروعاً، هذا الإيمان ما زال يوجّه كل قرار.
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
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="page-intro-block">
              <span className="page-intro-eyebrow"><Users className="h-3 w-3" /> الفريق</span>
              <h2 className="page-intro-title page-intro-title--section">محترفون من البداية للنهاية.</h2>
            </div>
          </div>
          <div className="section-body grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.n} className="surface-card p-6 text-center">
                <SiteImage
                  src={m.photo}
                  alt={m.n}
                  wrapperClassName="mx-auto h-24 w-24 rounded-full border-2 border-border"
                />
                <h3 className="mt-4 font-semibold">{m.n}</h3>
                <p className="text-xs text-muted-foreground mt-1">{m.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl page-intro-block">
          <span className="page-intro-eyebrow"><Award className="h-3 w-3" /> رحلتنا</span>
          <h2 className="page-intro-title page-intro-title--section">محطات مهمة.</h2>
          <ol className="section-body relative border-s border-border ps-6 space-y-8">
            {timeline.map((t) => (
              <li key={t.y} className="relative">
                <span className="absolute -start-[34px] grid h-6 w-6 place-items-center rounded-full bg-[var(--gradient-primary)] text-white text-[10px] font-bold">●</span>
                <div className="text-xs text-primary font-semibold tracking-wider">{t.y}</div>
                <h3 className="mt-1 font-semibold">{t.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <Link to="/contact" className="btn-primary">اعمل معنا <ArrowRight className="h-4 w-4 rtl-flip" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
