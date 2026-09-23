import { useCallback, useEffect, useState } from "react";
import { LocaleLink } from "@/components/site/LocaleLink";
import {
  ArrowRight,
  HelpCircle,
  Sparkles,
  Star,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { SectionIntro } from "@/components/site/SectionIntro";
import { ContentError, Skeleton } from "@/components/site/ContentState";
import { useHomeBundle } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";
import { useLocale } from "@/providers/LocaleProvider";
import { localeDateTag } from "@/lib/i18n/locale";

/**
 * false on SSR and on the first client render — flips true only after hydration.
 * Do NOT use useSyncExternalStore(() => true, () => false); that mismatches on purpose.
 */
function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

/** First letter of the personal name, skipping Arabic honorifics. */
function testimonialInitial(name: string) {
  const cleaned = name
    .replace(/^(الأستاذة|الاستاذة|الأستاذ|الاستاذ|المهندسة|المهندس|الكابتن|كابتن)\s+/u, "")
    .trim();
  return cleaned.charAt(0) || name.trim().charAt(0) || "?";
}

/** Below-the-fold home sections — code-split to shrink the initial home JS parse. */
export function HomeBelowFold() {
  return (
    <>
      <Process />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <CTA />
    </>
  );
}

function Process() {
  const { m } = useLocale();
  const steps = [
    { n: "01", t: m.home.p1t, d: m.home.p1d },
    { n: "02", t: m.home.p2t, d: m.home.p2d },
    { n: "03", t: m.home.p3t, d: m.home.p3d },
    { n: "04", t: m.home.p4t, d: m.home.p4d },
  ];
  return (
    <section className="section">
      <div className="container-page">
        <SectionIntro
          eyebrow={m.home.processEyebrow}
          title={m.home.processTitle}
          desc={m.home.processDesc}
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
  const mounted = useHasMounted();
  const { m, t, locale } = useLocale();
  const { data: home, isLoading, isError, refetch } = useHomeBundle();
  const items = [...(home?.testimonials ?? [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const showItems = mounted && !isError && items.length > 0;
  const showSkeleton = !showItems && (!mounted || isLoading);
  const total = items.length;

  useEffect(() => {
    if (total === 0) {
      setIndex(0);
      return;
    }
    setIndex((i) => ((i % total) + total) % total);
  }, [total]);

  const active = total > 0 ? ((index % total) + total) % total : 0;
  const current = items[active];
  const stars = current ? Math.max(1, Math.min(5, Math.round(Number(current.rating) || 5))) : 5;

  const go = useCallback(
    (delta: number) => {
      if (total < 2) return;
      setIndex((i) => {
        const base = ((i % total) + total) % total;
        return (base + delta + total) % total;
      });
    },
    [total],
  );

  useEffect(() => {
    if (!showItems || total < 2 || paused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(id);
  }, [showItems, total, paused, go]);

  return (
    <section className="section tone-tinted">
      <div className="container-page max-w-3xl">
        <SectionIntro eyebrow={m.home.testimonialsEyebrow} title={m.home.testimonialsTitle} centered />
        {showSkeleton ? (
          <div className="section-body" aria-busy="true">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <div className="mt-4 flex justify-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-3 w-24 self-center rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        ) : null}
        {mounted && isError ? (
          <ContentError message={m.home.testimonialsFail} onRetry={() => void refetch()} />
        ) : null}
        {showItems && current ? (
          <div
            className="section-body faq-slider"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
          >
            <article
              key={current.id}
              className="testimonial-slider-card"
              aria-live="polite"
              aria-atomic="true"
              aria-roledescription={m.home.slide}
              aria-label={t(m.home.reviewOf, { n: active + 1, total })}
            >
              <MessageSquareQuote className="testimonial-slider-mark" aria-hidden />
              <div className="testimonial-slider-top">
                <div className="testimonial-slider-stars testimonial-stars-gold" aria-label={t(m.home.ratingOf, { n: stars })}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
                  ))}
                </div>
              </div>
              <blockquote className="testimonial-slider-quote">{current.quote}</blockquote>
              <footer className="testimonial-slider-footer">
                <span className="testimonial-slider-avatar" aria-hidden>
                  {testimonialInitial(current.name)}
                </span>
                <div className="testimonial-slider-person min-w-0 flex-1">
                  <cite className="testimonial-slider-name">{current.name}</cite>
                  <p className="testimonial-slider-meta">
                    {[current.role, current.company].filter(Boolean).join(locale === "ar" ? "، " : ", ")}
                    {current.city ? ` — ${current.city}` : ""}
                  </p>
                </div>
              </footer>
            </article>

            {total > 1 ? (
              <div className="faq-slider-controls">
                <button
                  type="button"
                  className="faq-slider-nav"
                  onClick={() => go(-1)}
                  aria-label={m.home.prevReview}
                >
                  {locale === "ar" ? <ChevronRight className="h-5 w-5" aria-hidden /> : <ChevronLeft className="h-5 w-5" aria-hidden />}
                </button>
                <div className="faq-slider-dots" role="tablist" aria-label={m.home.pickReview}>
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={t(m.home.reviewN, { n: i + 1 })}
                      className="faq-slider-dot"
                      data-active={i === active}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="faq-slider-nav"
                  onClick={() => go(1)}
                  aria-label={m.home.nextReview}
                >
                  {locale === "ar" ? <ChevronLeft className="h-5 w-5" aria-hidden /> : <ChevronRight className="h-5 w-5" aria-hidden />}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BlogPreview() {
  const mounted = useHasMounted();
  const { data: home } = useHomeBundle();
  const { m, locale } = useLocale();
  const posts = (home?.blog ?? []).slice(0, 4);
  if (!mounted || posts.length === 0) return null;
  return (
    <section className="section tone-tinted">
      <div className="container-page">
        <SectionIntro
          eyebrow={m.home.blogEyebrow}
          title={m.home.blogTitle}
          action={
            <LocaleLink to="/blog" className="btn-ghost">
              {m.common.allArticles} <ArrowRight className="h-4 w-4 rtl-flip" />
            </LocaleLink>
          }
        />
        <div className="section-body grid gap-5 sm:grid-cols-2">
          {posts.map((p) => (
            <LocaleLink
              key={p.id}
              to="/blog/$slug"
              params={{ slug: blogPostSlug(p) }}
              className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {p.featuredImage && (
                <SiteImage
                  src={p.featuredImage}
                  alt={p.featuredImageAlt ?? p.title}
                  width={640}
                  height={360}
                  wrapperClassName="aspect-[16/9] w-full overflow-hidden"
                  className="transition-transform duration-500 group-hover:scale-105 object-cover object-top"
                />
              )}
              <div className="flex flex-col flex-1 p-5 gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="bg-primary/10 text-primary font-semibold rounded-full px-2.5 py-0.5">
                    {p.category}
                  </span>
                  <span className="opacity-40">·</span>
                  <span>{p.publishedAt ? formatPostDate(p.publishedAt, localeDateTag(locale)) : ""}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {p.title}
                </h3>
              </div>
            </LocaleLink>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const mounted = useHasMounted();
  const { m, t, locale } = useLocale();
  const { data: home, isLoading, isError, refetch } = useHomeBundle();
  const faqs = home?.faqs ?? [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const showFaqs = mounted && !isError && faqs.length > 0;
  const showSkeleton = !showFaqs && (!mounted || isLoading);
  const total = faqs.length;
  const active = total > 0 ? ((index % total) + total) % total : 0;
  const current = faqs[active];

  const go = useCallback(
    (delta: number) => {
      if (total < 2) return;
      setIndex((i) => (i + delta + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!showFaqs || total < 2 || paused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => go(1), 6500);
    return () => window.clearInterval(id);
  }, [showFaqs, total, paused, go]);

  useEffect(() => {
    if (active >= total && total > 0) setIndex(0);
  }, [active, total]);

  return (
    <section className="section tone-tinted">
      <div className="container-page max-w-3xl">
        <SectionIntro eyebrow={m.home.faqEyebrow} title={m.home.faqTitle} centered />
        {showSkeleton ? <ContentLoadingFallback /> : null}
        {mounted && isError ? (
          <ContentError message={m.home.faqFail} onRetry={() => void refetch()} />
        ) : null}
        {showFaqs && current ? (
          <div
            className="section-body faq-slider"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
            }}
          >
            <div
              key={current.id}
              className="faq-slider-card"
              aria-live="polite"
              aria-atomic="true"
              aria-roledescription={m.home.slide}
              aria-label={t(m.home.questionOf, { n: active + 1, total })}
            >
              <div className="faq-slider-meta">
                <span className="faq-slider-badge" aria-hidden>
                  <HelpCircle className="h-4 w-4" />
                </span>
              </div>
              <h3 className="faq-slider-q">{current.question}</h3>
              <div
                className="faq-slider-a prose prose-sm max-w-none break-words"
                dangerouslySetInnerHTML={{ __html: current.answer }}
              />
            </div>

            {total > 1 ? (
              <div className="faq-slider-controls">
                <button
                  type="button"
                  className="faq-slider-nav"
                  onClick={() => go(-1)}
                  aria-label={m.home.prevQuestion}
                >
                  {locale === "ar" ? <ChevronRight className="h-5 w-5" aria-hidden /> : <ChevronLeft className="h-5 w-5" aria-hidden />}
                </button>
                <div className="faq-slider-dots" role="tablist" aria-label={m.home.pickQuestion}>
                  {faqs.map((f, i) => (
                    <button
                      key={f.id}
                      type="button"
                      role="tab"
                      aria-selected={i === active}
                      aria-label={t(m.home.questionN, { n: i + 1 })}
                      className="faq-slider-dot"
                      data-active={i === active}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="faq-slider-nav"
                  onClick={() => go(1)}
                  aria-label={m.home.nextQuestion}
                >
                  {locale === "ar" ? <ChevronLeft className="h-5 w-5" aria-hidden /> : <ChevronRight className="h-5 w-5" aria-hidden />}
                </button>
              </div>
            ) : null}

            {/* Keep full FAQ text in DOM for crawlers / schema consumers */}
            <div className="sr-only">
              {faqs.map((f) => (
                <div key={`seo-${f.id}`}>
                  <h3>{f.question}</h3>
                  <div dangerouslySetInnerHTML={{ __html: f.answer }} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ContentLoadingFallback() {
  return (
    <div className="section-body" aria-busy="true">
      <Skeleton className="h-52 w-full rounded-2xl" />
      <div className="mt-4 flex justify-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-3 w-24 rounded-full self-center" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}

function CTA() {
  const { m } = useLocale();
  return (
    <section className="section section-compact-top pb-16">
      <div className="container-page">
        <div className="home-cta-block relative">
          <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white">
            <Sparkles className="h-3 w-3" /> {m.common.startNow}
          </span>
          <h2 className="relative mx-auto mt-3 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
            {m.home.ctaTitle}
          </h2>
          <p className="relative mx-auto mt-2.5 max-w-lg text-sm text-white/80">
            {m.home.ctaDesc}
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <LocaleLink to="/contact" className="btn-primary">
              {m.common.contactUs} <ArrowRight className="h-4 w-4 rtl-flip" />
            </LocaleLink>
            <LocaleLink to="/services" className="btn-ghost">
              {m.common.exploreServices}
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
