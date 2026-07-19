import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Eye,
  Heart,
  Layout,
  Search,
  ShoppingBag,
  Sparkles,
  Target,
  Megaphone,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
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
      n: "01",
      icon: Eye,
      t: "الرؤية",
      d: "نبني حضوراً رقمياً واضحاً للشركات في السعودية — مواقع ومتاجر تساعد على تحويل الزوار إلى عملاء.",
    },
    {
      n: "02",
      icon: Target,
      t: "الرسالة",
      d: "نقدّم تصميم مواقع، متاجر، SEO، وتسويق رقمي بخطوات بسيطة، تواصل واضح، وتنفيذ يركز على النتيجة.",
    },
    {
      n: "03",
      icon: Heart,
      t: "القيم",
      d: "صدق في الوعود، جودة في التنفيذ، ومتابعة بعد الإطلاق — بدون مبالغة وبدون تعقيد.",
    },
  ];

  const offers = [
    {
      icon: Layout,
      t: "تصميم مواقع",
      d: "مواقع سريعة وواضحة تعكس هوية نشاطك.",
      to: "/services/$slug" as const,
      slug: "web-design",
    },
    {
      icon: ShoppingBag,
      t: "متاجر إلكترونية",
      d: "تجربة شراء سلسة جاهزة للبيع أونلاين.",
      to: "/services/$slug" as const,
      slug: "web-apps",
    },
    {
      icon: Search,
      t: "SEO",
      d: "تحسين ظهورك في Google بجهد عملي مستمر.",
      to: "/services/$slug" as const,
      slug: "seo",
    },
    {
      icon: Megaphone,
      t: "تسويق رقمي",
      d: "حملات ورسائل تساعد على جذب عملاء حقيقيين.",
      to: "/services/$slug" as const,
      slug: "digital-solutions",
    },
  ];

  const steps = [
    {
      n: "01",
      t: "نفهم احتياجك",
      d: "نستمع لهدفك وميزانيتك والجمهور — بدون تعقيد.",
    },
    {
      n: "02",
      t: "نصمّم ونبني",
      d: "واجهة واضحة، أداء سريع، ومحتوى يخدم التحويل.",
    },
    {
      n: "03",
      t: "نطلق ونحسّن",
      d: "إطلاق مرتب، ثم تحسينات بناءً على الاستخدام والنتائج.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden page-intro">
        <div aria-hidden className="absolute inset-0 grid-fade pointer-events-none" />
        <div className="container-page relative page-intro-inner">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="order-last text-center lg:order-1 lg:text-start">
              <span className="page-intro-eyebrow">
                <Sparkles className="h-3 w-3" /> عن {SITE_NAME}
              </span>
              <h1 className="page-intro-title">
                وكالة رقمية <span className="text-gradient">للسوق السعودي.</span>
              </h1>
              <p className="page-intro-desc lg:mx-0">
                {SITE_NAME} وكالة رقمية ناشئة متخصصة في تصميم المواقع، المتاجر الإلكترونية، تحسين
                محركات البحث، والتسويق الرقمي. نساعد الشركات في السعودية على بناء حضور أونلاين
                احترافي — من الفكرة إلى الإطلاق.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link to="/contact" className="btn-primary">
                  ابدأ مشروعك
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
                <Link to="/services" className="btn-ghost">
                  استكشف الخدمات
                </Link>
              </div>
            </div>
            <SiteImage
              src={siteImages.about.studio}
              alt={siteImages.about.studioAlt}
              loading="eager"
              fetchPriority="high"
              width={960}
              height={720}
              sizes="(max-width: 1024px) 100vw, 560px"
              wrapperClassName="order-first aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-[var(--shadow-card-hover)] lg:order-2 lg:aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* Values — editorial beliefs layout */}
      <section className="about-beliefs section" aria-labelledby="about-values-heading">
        <div className="container-page about-beliefs-inner">
          <header className="about-beliefs-head">
            <span className="page-intro-eyebrow">ما نؤمن به</span>
            <h2 id="about-values-heading" className="page-intro-title page-intro-title--section">
              وضوح، جودة، والتزام.
            </h2>
            <p className="about-beliefs-lead">
              ثلاث مبادئ بسيطة نشتغل عليها في كل مشروع — من أول اجتماع حتى بعد الإطلاق.
            </p>
          </header>

          <ul className="about-beliefs-list">
            {values.map((v, i) => (
              <li key={v.t} className="about-belief-item">
                <Reveal delay={i * 90} className="about-belief-reveal">
                  <div className="about-belief-meta">
                    <span className="about-belief-num" aria-hidden>
                      {v.n}
                    </span>
                    <span className="about-belief-icon" aria-hidden>
                      <v.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="about-belief-copy">
                    <h3 className="about-belief-title">{v.t}</h3>
                    <p className="about-belief-desc">{v.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Offers */}
      <section className="section border-y border-border bg-surface" aria-labelledby="about-offers-heading">
        <div className="container-page">
          <div className="page-intro-block me-auto w-full text-start">
            <span className="page-intro-eyebrow">ماذا نقدّم؟</span>
            <h2 id="about-offers-heading" className="page-intro-title page-intro-title--section">
              خدمات واضحة لنمو عملك.
            </h2>
            <p className="page-intro-desc mt-3 !max-w-none">
              سواء كنت تبدأ حضورك الرقمي أو تريد تطوير موقعك الحالي — نعمل بخطوات مرتبة وتحديثات
              مستمرة حتى الإطلاق وما بعده.
            </p>
          </div>
          <div className="section-body grid gap-4 sm:grid-cols-2">
            {offers.map((o, i) => (
              <Reveal key={o.t} delay={i * 60}>
                <Link
                  to={o.to}
                  params={{ slug: o.slug }}
                  className="about-offer-card group flex h-full gap-4 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <o.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold tracking-tight">{o.t}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 rtl-flip" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {o.d}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/services" className="btn-ghost">
              كل الخدمات
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
            <Link to="/contact" className="btn-ghost">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* How we work — right aligned intro + process */}
      <section className="section" aria-labelledby="about-steps-heading">
        <div className="container-page">
          <div className="page-intro-block me-auto w-full text-start">
            <span className="page-intro-eyebrow">
              <Award className="h-3 w-3" /> بدايتنا
            </span>
            <h2 id="about-steps-heading" className="page-intro-title page-intro-title--section">
              بدأنا مؤخراً — ونبني معك من اليوم.
            </h2>
            <p className="page-intro-desc mt-3 !max-w-none">
              {SITE_NAME} وكالة جديدة تخدم السعودية. نبدأ مع كل عميل من احتياجه الحقيقي — خطوة بخطوة.
            </p>
          </div>
          <ol className="section-body grid list-none gap-5 p-0 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <li className="process-step h-full text-start">
                  <span className="process-num" aria-hidden>
                    {s.n}
                  </span>
                  <h3 className="font-semibold tracking-tight">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-compact-top pb-16">
        <div className="container-page">
          <div className="home-cta-block relative">
            <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white">
              <Sparkles className="h-3 w-3" /> ابدأ الآن
            </span>
            <h2 className="relative mx-auto mt-3 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
              جاهز تبني حضورك الرقمي معنا؟
            </h2>
            <p className="relative mx-auto mt-2.5 max-w-lg text-sm text-white/80">
              تواصل عبر واتساب أو النموذج — نرد خلال 24 ساعة، بدون التزام.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary">
                تواصل معنا <ArrowRight className="h-4 w-4 rtl-flip" />
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
