import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowUpRight, Sparkles, Star,
  ShieldCheck, Zap,
  MessageSquareQuote, Plus, Minus, TrendingUp, Target,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SiteImage } from "@/components/site/SiteImage";
import { useBlogPosts, useFaqs, usePortfolio, useServices, useSiteSettings, useSiteStats, useTestimonials } from "@/hooks/use-cms";
import { statIcon } from "@/lib/stat-icons";
import { blogPostSlug, portfolioItemSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";
import { serviceIcon } from "@/lib/service-icons";
import { siteImages } from "@/lib/site-images";
import { SITE_NAME } from "@/lib/site-config";
import { absoluteImageUrl, buildStaticPageHead, resolveStaticPageOgImage } from "@/lib/seo";
import { loadPublishedPageSeo } from "@/lib/seo/cms-page-seo";
import { SectionIntro } from "@/components/site/SectionIntro";

export const Route = createFileRoute("/")({
  loader: () => loadPublishedPageSeo("home"),
  head: ({ loaderData }) => {
    const image = resolveStaticPageOgImage("home", loaderData);
    return buildStaticPageHead("home", "/", {
      cms: loaderData,
      image,
      extraLinks: [
        {
          rel: "preload",
          as: "image",
          href: absoluteImageUrl(image),
          fetchPriority: "high",
        },
      ],
    });
  },
  component: Home,
});

const MARQUEE_ITEMS = [
  "تصميم مواقع", "SEO السعودية", "إعلانات Google", "تسويق سوشيال",
  "UI/UX", "تحليلات", "Core Web Vitals", "تحويل الزوار",
];

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Services />
      <WhyUs />
      <Portfolio />
      <Stats />
      <Process />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <CTA />
    </>
  );
}

function Hero() {
  const { data: settings } = useSiteSettings();
  const heroSrc = settings?.heroImageUrl?.trim() || siteImages.hero.main;
  const heroAlt = settings?.heroImageAlt?.trim() || siteImages.hero.mainAlt;

  return (
    <section className="hero-studio hero-bg" aria-labelledby="hero-heading">
      <div className="container-page hero-studio-grid">
        <div className="hero-studio-copy">
          <p className="hero-studio-brand animate-hero animate-hero-delay-1">
            {SITE_NAME}
          </p>

          <h1 id="hero-heading" className="hero-studio-title animate-hero animate-hero-delay-2">
            نصمّم حضوراً رقمياً
            <span className="hero-studio-title-line">يحوّل الزوار إلى عملاء.</span>
          </h1>

          <p className="hero-studio-desc animate-hero animate-hero-delay-3">
            مواقع، SEO، وتسويق — لعلامات تريد نتائج واضحة في السعودية والإمارات.
          </p>

          <div className="hero-studio-actions animate-hero animate-hero-delay-4">
            <Link to="/contact" className="btn-primary">
              تواصل معنا
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
            <Link to="/portfolio" className="btn-ghost">
              شاهد أعمالنا
            </Link>
          </div>
        </div>

        <div className="hero-studio-visual animate-hero animate-hero-delay-3">
          <SiteImage
            src={heroSrc}
            alt={heroAlt}
            loading="eager"
            fetchPriority="high"
            width={960}
            height={720}
            wrapperClassName="hero-studio-photo"
            className="hero-studio-photo-img"
          />
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="home-marquee-wrap" aria-hidden>
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={`${t}-${i}`} className="home-marquee-item">{t}</span>
        ))}
      </div>
    </div>
  );
}

function Services() {
  const { data: services = [] } = useServices();
  if (services.length === 0) return null;

  return (
    <section id="services" className="section">
      <div className="container-page">
        <Reveal>
          <SectionIntro
            eyebrow="خدماتنا"
            title="كل ما تحتاجه للنمو الرقمي."
            desc="تصميم، تطوير، SEO، وإعلانات — فريق واحد مسؤول عن النتيجة."
          />
        </Reveal>
        <div className="section-body bento-grid">
          {services.map((s, i) => {
            const Icon = serviceIcon(s.icon);
            const featured = i === 0 && services.length >= 3;
            return (
              <Reveal key={s.id} delay={i * 70} className={featured ? "bento-featured" : undefined}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="bento-card group">
                  {s.imageUrl && (
                    <SiteImage
                      src={s.imageUrl}
                      alt={s.title}
                      wrapperClassName="aspect-[16/9] w-full"
                      className="transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="bento-card-body">
                    <span className="bento-icon">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                      {s.shortDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      التفاصيل <ArrowRight className="h-3.5 w-3.5 rtl-flip group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    { icon: Target, t: "تركيز على النتائج", d: "كل قرار مبني على تحويل وزيارات وعائد — مش vanity metrics." },
    { icon: ShieldCheck, t: "خبراء فقط", d: "فريق senior بدون outsourcing — جودة ثابتة من أول يوم." },
    { icon: Zap, t: "سرعة وتسليم واضح", d: "سبرنتات أسبوعين، تحديثات مستمرة، بدون مفاجآت." },
    { icon: TrendingUp, t: "SEO من البداية", d: "Core Web Vitals، schema، ومحتوى يُرتّب في Google." },
  ];

  return (
    <section className="section bg-surface/50">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
          <Reveal>
            <div className="why-panel relative">
              <span className="relative page-intro-eyebrow !bg-white/10 !text-white !border-white/20">
                لماذا {SITE_NAME}
              </span>
              <h2 className="relative mt-3 text-xl md:text-2xl font-bold text-white leading-snug">
                شريك تسويق يفهم السوق السعودي
              </h2>
              <p className="relative mt-2.5 text-sm text-white/70 leading-relaxed max-w-md">
                RTL، WhatsApp، google.sa، وسلوك المستخدم المحلي — نبني منتجات
                digital تناسب جمهورك وتحقق leads حقيقية.
              </p>
              <Link to="/about" className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors">
                تعرّف علينا <ArrowRight className="h-4 w-4 rtl-flip" />
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal key={p.t} delay={i * 80}>
                <div className="surface-card p-5 h-full hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                  <span className="bento-icon mb-3">
                    <p.icon />
                  </span>
                  <h3 className="font-semibold text-[0.9375rem]">{p.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const { data: projects = [] } = usePortfolio();
  const preview = projects.slice(0, 3);
  if (preview.length === 0) return null;

  return (
    <section className="section">
      <div className="container-page">
        <SectionIntro
          eyebrow="أعمالنا"
          title="مشاريع حققت نتائج."
          desc="عيّنة من أعمالنا — مواقع، حملات، وSEO."
          action={<Link to="/portfolio" className="btn-ghost">كل المشاريع <ArrowRight className="h-4 w-4 rtl-flip" /></Link>}
        />
        <div className="section-body portfolio-home-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((p, i) => (
            <Reveal key={p.id} delay={i * 100} className="h-full min-w-0 w-full">
              <Link to="/portfolio/$slug" params={{ slug: portfolioItemSlug(p) }} className="group bento-card portfolio-home-card block h-full w-full min-w-0 max-w-full overflow-hidden">
                {p.imageUrl ? (
                  <SiteImage
                    src={p.imageUrl}
                    alt={p.title}
                    overlay
                    wrapperClassName="portfolio-home-media aspect-[4/3] w-full max-w-full"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="portfolio-home-media aspect-[4/3] w-full max-w-full bg-accent" />
                )}
                <div className="portfolio-home-card-body p-5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[0.9375rem] group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">{p.category}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 rtl-flip text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { data: items = [] } = useSiteStats();
  if (items.length === 0) return null;

  return (
    <section className="section section-compact-top">
      <div className="container-page">
        <div className="stats-band">
          <div className="stats-band-grid">
            {items.map((s) => {
              const Icon = statIcon(s.icon);
              return (
                <div key={s.id} className="stats-band-item">
                  <span className="stats-band-icon">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="stats-band-value">{s.value}</div>
                  <div className="stats-band-label">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "استكشاف", d: "نفهم نشاطك، جمهورك، ومنافسيك." },
    { n: "02", t: "استراتيجية", d: "خطة SEO، محتوى، وتصميم واضحة." },
    { n: "03", t: "تنفيذ", d: "بناء، إطلاق، وتحسين مستمر." },
    { n: "04", t: "نمو", d: "تحليلات، A/B tests، وتوسع." },
  ];
  return (
    <section className="section">
      <div className="container-page">
        <SectionIntro
          eyebrow="كيف نعمل"
          title="من الفكرة للنتائج — 4 خطوات."
          desc="عملية شفافة بدون غموض."
          centered
        />
        <div className="section-body process-rail">
          {steps.map((s) => (
            <div key={s.n} className="process-step">
              <span className="process-num">{s.n}</span>
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { data: items = [] } = useTestimonials();
  if (items.length === 0) return null;
  return (
    <section className="section">
      <div className="container-page">
        <SectionIntro eyebrow="آراء العملاء" title="يثق بنا شركاء النجاح." centered />
        <div className="section-body grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="testimonial-card-new">
              <MessageSquareQuote className="h-6 w-6 text-primary" />
              <blockquote className="mt-4 text-[15px] leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center font-semibold text-primary">{t.name[0]}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.role}, {t.company}</div>
                </div>
                <div className="ms-auto flex text-primary shrink-0">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogPreview() {
  const { data: posts = [] } = useBlogPosts(3);
  if (posts.length === 0) return null;
  return (
    <section className="section bg-surface/50">
      <div className="container-page">
        <SectionIntro
          eyebrow="المدونة"
          title="نصائح تسويق وSEO."
          action={<Link to="/blog" className="btn-ghost">كل المقالات <ArrowRight className="h-4 w-4 rtl-flip" /></Link>}
        />
        <div className="section-body grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: blogPostSlug(p) }} className="group bento-card block">
              {p.featuredImage && (
                <SiteImage
                  src={p.featuredImage}
                  alt={p.featuredImageAlt ?? p.title}
                  wrapperClassName="aspect-[16/10] w-full"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-primary font-medium">{p.category}</span>
                  <span>·</span>
                  <span>{p.publishedAt ? formatPostDate(p.publishedAt) : ""}</span>
                </div>
                <h3 className="mt-2 font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { data: faqs = [] } = useFaqs();
  const [open, setOpen] = useState<number | null>(0);
  if (faqs.length === 0) return null;
  return (
    <section className="section">
      <div className="container-page max-w-3xl">
        <SectionIntro eyebrow="أسئلة شائعة" title="إجابات سريعة." centered />
        <div className="section-body flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.id} className="faq-item-new" data-open={isOpen}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-start hover:bg-accent/30 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-[0.9375rem]">{f.question}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-primary shrink-0">
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="section section-compact-top pb-16">
      <div className="container-page">
        <div className="home-cta-block relative">
          <span className="relative page-intro-eyebrow !bg-white/15 !text-white !border-white/25">
            <Sparkles className="h-3 w-3" /> ابدأ الآن
          </span>
          <h2 className="relative mt-3 text-2xl md:text-3xl font-bold max-w-2xl mx-auto leading-snug">
            جاهز تضاعف leads من Google؟
          </h2>
          <p className="relative mt-2.5 text-white/80 max-w-lg mx-auto text-sm">
            تواصل معنا عبر واتساب أو اترك رسالة — نرد خلال 24 ساعة.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-primary">تواصل معنا <ArrowRight className="h-4 w-4 rtl-flip" /></Link>
            <Link to="/services" className="btn-ghost">استكشف الخدمات</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
