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
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { MarketsServeStrip } from "@/components/site/MarketsContact";
import { TrustAuthoritySections } from "@/components/site/TrustAuthoritySections";
import { PageIntro } from "@/components/site/SectionIntro";
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
      d: "نبني حضوراً رقمياً واضحاً للشركات في السعودية والإمارات — مواقع ومتاجر تساعد على تحويل الزوار إلى عملاء.",
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
      href: "/web-design-saudi-arabia",
    },
    {
      icon: ShoppingBag,
      t: "متاجر إلكترونية",
      d: "تجربة شراء سلسة جاهزة للبيع أونلاين.",
      href: "/ecommerce-development",
    },
    {
      icon: Search,
      t: "SEO",
      d: "تحسين ظهورك في Google بجهد عملي مستمر.",
      href: "/seo-services",
    },
    {
      icon: Megaphone,
      t: "تسويق رقمي",
      d: "حملات ورسائل تساعد على جذب عملاء حقيقيين.",
      href: "/digital-marketing",
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

  const whyUs = [
    "تواصل مباشر بدون وسيط",
    "تسليم في المواعيد المحددة",
    "دعم ما بعد الإطلاق",
    "شفافية كاملة في التسعير",
  ];

  return (
    <>
      {/* ─── Hero — نفس باقي الصفحات ─── */}
      <PageIntro
        eyebrow={`عن ${SITE_NAME}`}
        title={
          <>
            وكالة رقمية{" "}
            <span className="text-gradient">للسعودية والإمارات.</span>
          </>
        }
        desc={`${SITE_NAME} وكالة رقمية متخصصة في تصميم المواقع، المتاجر الإلكترونية، تحسين محركات البحث، والتسويق الرقمي.`}
      />

      {/* ─── Intro — صورة + checklist ─── */}
      <section className="section">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            {/* copy + checklist + CTAs — يمين */}
            <Reveal delay={80} className="order-1">
              <div className="flex flex-col gap-5">
                <MarketsServeStrip />
                <h2 className="text-2xl font-bold tracking-tight leading-snug">
                  نبني حضورك الرقمي — من الفكرة إلى الإطلاق.
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  نساعد الشركات في السعودية والإمارات على بناء حضور أونلاين احترافي بخطوات
                  مرتبة، تواصل واضح، وتنفيذ يركز على النتيجة.
                </p>
                <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-foreground/80">
                  {whyUs.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link to="/contact" className="btn-primary">
                    ابدأ مشروعك
                    <ArrowRight className="h-4 w-4 rtl-flip" />
                  </Link>
                  <Link to="/services" className="btn-ghost">
                    استكشف الخدمات
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* صورة — شمال */}
            <Reveal className="order-2">
              <figure className="m-0 w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card-hover)]">
                <img
                  src={siteImages.about.studio}
                  alt={siteImages.about.studioAlt}
                  width={1200}
                  height={800}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="block w-full h-auto aspect-[16/9] object-cover object-center"
                />
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Values ─── */}
      <section className="section" aria-labelledby="about-values-heading">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="page-intro-eyebrow mx-auto">ما نؤمن به</span>
            <h2 id="about-values-heading" className="page-intro-title page-intro-title--section mt-3">
              وضوح، جودة، والتزام.
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              ثلاث مبادئ بسيطة نشتغل عليها في كل مشروع — من أول اجتماع حتى بعد الإطلاق.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 90}>
                <div className="relative rounded-2xl border border-border bg-surface p-7 flex flex-col gap-4 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                  <span aria-hidden className="absolute -top-3 -end-2 text-[7rem] font-black leading-none text-primary/5 select-none pointer-events-none">
                    {v.n}
                  </span>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold tracking-tight relative">{v.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed relative">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Offers ─── */}
      <section className="section tone-tinted" aria-labelledby="about-offers-heading">
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="page-intro-eyebrow">ماذا نقدّم؟</span>
              <h2 id="about-offers-heading" className="page-intro-title page-intro-title--section mt-3">
                خدمات واضحة لنمو عملك.
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-lg">
                سواء كنت تبدأ حضورك الرقمي أو تريد تطوير موقعك — نعمل بخطوات مرتبة حتى الإطلاق وما بعده.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link to="/services" className="btn-ghost text-sm">
                كل الخدمات <ArrowRight className="h-3.5 w-3.5 rtl-flip" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {offers.map((o, i) => (
              <Reveal key={o.t} delay={i * 60}>
                <Link
                  to={o.href}
                  className="group flex h-full gap-4 rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 duration-300"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    <o.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-bold tracking-tight group-hover:text-primary transition-colors">{o.t}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary opacity-0 transition-all group-hover:opacity-100 rtl-flip" />
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                      {o.d}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/portfolio" className="btn-ghost">أعمالنا</Link>
            <Link to="/contact" className="btn-ghost">تواصل معنا</Link>
          </div>
        </div>
      </section>

      {/* ─── Trust / Team / Stats / Testimonials ─── */}
      <TrustAuthoritySections />

      {/* ─── How we work ─── */}
      <section className="section tone-tinted" aria-labelledby="about-steps-heading">
        <div className="container-page">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="page-intro-eyebrow mx-auto">
              <Award className="h-3 w-3" /> كيف نعمل
            </span>
            <h2 id="about-steps-heading" className="page-intro-title page-intro-title--section mt-3">
              بدأنا مؤخراً — ونبني معك من اليوم.
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {SITE_NAME} وكالة جديدة تخدم السعودية والإمارات. نبدأ مع كل عميل من احتياجه الحقيقي — خطوة بخطوة.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3 relative">
            {/* connector line */}
            <div aria-hidden className="hidden md:block absolute top-11 start-[20%] end-[20%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="relative rounded-2xl border border-border bg-surface p-7 h-full flex flex-col gap-3 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 text-center md:text-start">
                  {/* step circle */}
                  <div className="flex justify-center md:justify-start">
                    <span className="h-11 w-11 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-black shadow-md">
                      {s.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-base tracking-tight mt-1">{s.t}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section pb-20">
        <div className="container-page">
          <div className="home-cta-block relative text-center">
            <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white mx-auto">
              <Sparkles className="h-3 w-3" /> ابدأ الآن
            </span>
            <h2 className="relative mx-auto mt-4 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
              جاهز تبني حضورك الرقمي معنا؟
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/80">
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
