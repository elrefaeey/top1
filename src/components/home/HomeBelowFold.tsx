import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Star, MessageSquareQuote } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { SectionIntro } from "@/components/site/SectionIntro";
import { ContentError, Skeleton } from "@/components/site/ContentState";
import { useHomeBundle } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";

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

/** Below-the-fold home sections — code-split to shrink the initial home JS parse. */
export function HomeBelowFold() {
  return (
    <>
      <Process />
      <Testimonials />
      <BlogPreview />
    </>
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
  const mounted = useHasMounted();
  const { data: home, isLoading, isError, refetch } = useHomeBundle();
  const items = home?.testimonials ?? [];
  // Server + first client paint: skeleton only. Content only after mount.
  const showItems = mounted && !isError && items.length > 0;
  const showSkeleton = !showItems && (!mounted || isLoading);

  return (
    <section className="section">
      <div className="container-page">
        <SectionIntro eyebrow="آراء العملاء" title="يثق بنا شركاء النجاح." centered />
        {showSkeleton ? (
          <div className="section-body grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="testimonial-card-new">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="mt-4 h-20 w-full" />
                <Skeleton className="mt-6 h-10 w-2/3" />
              </div>
            ))}
          </div>
        ) : null}
        {mounted && isError ? (
          <ContentError message="تعذّر تحميل آراء العملاء." onRetry={() => void refetch()} />
        ) : null}
        {showItems ? (
          <div className="section-body grid gap-5 md:grid-cols-3">
            {items.map((t) => (
              <div key={t.id} className="testimonial-card-new">
                <MessageSquareQuote className="h-6 w-6 shrink-0 text-primary" aria-hidden />
                <p className="mt-4 flex-1 break-words text-[15px] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex min-w-0 items-center gap-3 border-t border-border pt-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                    {t.name[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </div>
                  </div>
                  <div
                    className="ms-auto flex shrink-0 text-primary"
                    aria-label={`تقييم ${t.rating} من 5`}
                  >
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BlogPreview() {
  const mounted = useHasMounted();
  const { data: home } = useHomeBundle();
  const posts = (home?.blog ?? []).slice(0, 3);
  if (!mounted || posts.length === 0) return null;
  return (
    <section className="section bg-surface/50">
      <div className="container-page">
        <SectionIntro
          eyebrow="المدونة"
          title="نصائح تسويق وSEO."
          action={
            <Link to="/blog" className="btn-ghost">
              كل المقالات <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          }
        />
        <div className="section-body grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: blogPostSlug(p) }}
              className="group bento-card block"
            >
              {p.featuredImage && (
                <SiteImage
                  src={p.featuredImage}
                  alt={p.featuredImageAlt ?? p.title}
                  width={640}
                  height={400}
                  wrapperClassName="aspect-[16/10] w-full"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-primary">{p.category}</span>
                  <span>·</span>
                  <span>{p.publishedAt ? formatPostDate(p.publishedAt) : ""}</span>
                </div>
                <h3 className="mt-2 line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-primary">
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

