import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ShieldCheck, Zap, TrendingUp, Target } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import { SiteImage } from "@/components/site/SiteImage";
import { useHomeBundle } from "@/hooks/use-cms";
import { statIcon } from "@/lib/stat-icons";
import { portfolioItemSlug } from "@/lib/cms/admin-utils";
import { serviceIcon } from "@/lib/service-icons";
import { SITE_NAME } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";
import { absoluteImageUrl, buildStaticPageHead, resolveStaticPageOgImage } from "@/lib/seo";
import { loadHomeHeroSettingsFn, loadPublishedPageSeoFn } from "@/lib/seo/cms-seo.functions";
import { SectionIntro } from "@/components/site/SectionIntro";

const HomeBelowFold = lazy(() =>
  import("@/components/home/HomeBelowFold").then((m) => ({ default: m.HomeBelowFold })),
);

export const Route = createFileRoute("/")({
  loader: async () => {
    const [cms, hero] = await Promise.all([
      loadPublishedPageSeoFn({ data: { slug: "home" } }),
      loadHomeHeroSettingsFn(),
    ]);
    return { cms, hero };
  },
  head: ({ loaderData }) => {
    const cms = loaderData?.cms;
    const heroUrl = loaderData?.hero?.heroImageUrl?.trim() || "";
    const image = resolveStaticPageOgImage("home", cms);
    const preloadHref =
      heroUrl && !heroUrl.startsWith("data:") ? absoluteImageUrl(heroUrl) : absoluteImageUrl(image);
    const extraLinks =
      preloadHref && !preloadHref.startsWith("data:")
        ? [
            {
              rel: "preload",
              as: "image",
              href: preloadHref,
              fetchPriority: "high",
            },
          ]
        : undefined;
    return buildStaticPageHead("home", "/", {
      cms,
      image: heroUrl && !heroUrl.startsWith("data:") ? heroUrl : image,
      extraLinks,
    });
  },
  component: Home,
});

const MARQUEE_ITEMS = [
  "تصميم مواقع",
  "SEO السعودية",
  "إعلانات Google",
  "تسويق سوشيال",
  "UI/UX",
  "تحليلات",
  "Core Web Vitals",
  "تحويل الزوار",
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
      <Suspense
        fallback={
          <div className="section container-page" aria-busy="true">
            <div className="skeleton-block h-8 w-48 mx-auto" />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="skeleton-block h-40 w-full" />
              <div className="skeleton-block h-40 w-full" />
              <div className="skeleton-block h-40 w-full" />
            </div>
          </div>
        }
      >
        <HomeBelowFold />
      </Suspense>
    </>
  );
}

function Hero() {
  const { hero } = Route.useLoaderData();
  const { data: home } = useHomeBundle();
  const settings = home?.settings;
  const cmsSrc = (settings?.heroImageUrl?.trim() || hero.heroImageUrl || "").trim();
  const usableCmsSrc = cmsSrc && !cmsSrc.startsWith("data:") ? cmsSrc : "";
  const [cmsFailed, setCmsFailed] = useState(false);
  const heroSrc = !cmsFailed && usableCmsSrc ? usableCmsSrc : siteImages.hero.main;
  const heroAlt =
    settings?.heroImageAlt?.trim() ||
    hero.heroImageAlt ||
    siteImages.hero.mainAlt;

  return (
    <section className="hero-studio hero-bg" aria-labelledby="hero-heading">
      <div className="container-page hero-studio-grid">
        <div className="hero-studio-copy">
          <p className="hero-studio-brand animate-hero animate-hero-delay-1">{SITE_NAME}</p>

          <h1 id="hero-heading" className="hero-studio-title animate-hero animate-hero-delay-2">
            تصميم مواقع وSEO
            <span className="hero-studio-title-line">
              يحوّلان الزوار إلى عملاء في السعودية.
            </span>
          </h1>

          <p className="hero-studio-desc animate-hero animate-hero-delay-3">
            مواقع، تحسين محركات البحث، وتسويق رقمي — لعلامات تريد نتائج واضحة وقابلة للقياس.
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
            key={heroSrc}
            src={heroSrc}
            alt={heroAlt}
            loading="eager"
            fetchPriority="high"
            width={960}
            height={720}
            sizes="(max-width: 1024px) 100vw, 560px"
            wrapperClassName="hero-studio-photo"
            className="hero-studio-photo-img"
            onError={() => {
              if (usableCmsSrc && heroSrc === usableCmsSrc) setCmsFailed(true);
            }}
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
          <span key={`${t}-${i}`} className="home-marquee-item">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Services() {
  const { data: home } = useHomeBundle();
  const services = home?.services ?? [];
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
                      width={640}
                      height={360}
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                      التفاصيل{" "}
                      <ArrowRight className="h-3.5 w-3.5 rtl-flip group-hover:translate-x-0.5 transition-transform" />
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
    {
      icon: Target,
      t: "تركيز على النتائج",
      d: "كل قرار مبني على تحويل وزيارات وعائد — مش vanity metrics.",
    },
    {
      icon: ShieldCheck,
      t: "خبراء فقط",
      d: "فريق senior بدون outsourcing — جودة ثابتة من أول يوم.",
    },
    { icon: Zap, t: "سرعة وتسليم واضح", d: "سبرنتات أسبوعين، تحديثات مستمرة، بدون مفاجآت." },
    {
      icon: TrendingUp,
      t: "SEO من البداية",
      d: "Core Web Vitals، schema، ومحتوى يُرتّب في Google.",
    },
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
                RTL، WhatsApp، google.sa، وسلوك المستخدم المحلي — نبني منتجات digital تناسب جمهورك
                وتحقق leads حقيقية.
              </p>
              <Link
                to="/about"
                className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors"
              >
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
  const { data: home } = useHomeBundle();
  const projects = home?.portfolio ?? [];
  const preview = projects.slice(0, 3);
  if (preview.length === 0) return null;

  return (
    <section className="section">
      <div className="container-page">
        <SectionIntro
          eyebrow="أعمالنا"
          title="مشاريع حققت نتائج."
          desc="عيّنة من أعمالنا — مواقع، حملات، وSEO."
          action={
            <Link to="/portfolio" className="btn-ghost">
              كل المشاريع <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          }
        />
        <div className="section-body portfolio-home-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((p, i) => (
            <Reveal key={p.id} delay={i * 100} className="h-full min-w-0 w-full">
              <Link
                to="/portfolio/$slug"
                params={{ slug: portfolioItemSlug(p) }}
                className="group bento-card portfolio-home-card block h-full w-full min-w-0 max-w-full overflow-hidden"
              >
                {p.imageUrl ? (
                  <SiteImage
                    src={p.imageUrl}
                    alt={p.title}
                    overlay
                    width={640}
                    height={480}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    wrapperClassName="portfolio-home-media aspect-[4/3] w-full max-w-full"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="portfolio-home-media aspect-[4/3] w-full max-w-full bg-accent" />
                )}
                <div className="portfolio-home-card-body p-5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[0.9375rem] group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
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
  const { data: home } = useHomeBundle();
  const items = home?.stats ?? [];
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
