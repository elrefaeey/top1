import { createFileRoute, Link, notFound, redirect, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpLeft, ExternalLink, Sparkles } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { usePortfolioItem } from "@/hooks/use-cms";
import { flattenTitle, portfolioItemSlug, splitDisplayTitle } from "@/lib/cms/admin-utils";
import { loadPortfolioItemForSeoFn } from "@/lib/seo/cms-seo.functions";
import { serviceLinksForPortfolio } from "@/lib/seo/internal-links";
import { buildPortfolioItemHead, notFoundHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const item = await loadPortfolioItemForSeoFn({ data: { slug: params.slug } });
    if (!item) {
      throw notFound({ headers: NOINDEX_HEADERS });
    }
    const canonical = portfolioItemSlug(item);
    if (canonical && canonical !== params.slug) {
      throw redirect({
        to: "/portfolio/$slug",
        params: { slug: canonical },
        statusCode: 301,
        replace: true,
      });
    }
    return { item };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData?.item) return notFoundHead();
    return buildPortfolioItemHead(loaderData.item, params.slug);
  },
  component: PortfolioDetail,
});

function normalizeTags(tags: string[]): string[] {
  const out: string[] = [];
  for (const raw of tags) {
    const parts = String(raw)
      .split(/[,،]/u)
      .map((t) => t.trim())
      .filter(Boolean);
    for (const p of parts) {
      if (!out.includes(p)) out.push(p);
    }
  }
  return out;
}

function PortfolioDetail() {
  const { slug } = useParams({ from: "/portfolio/$slug" });
  const { item: loaderItem } = Route.useLoaderData();
  const { data: hookItem, isLoading } = usePortfolioItem(slug);
  const item = hookItem ?? loaderItem;

  if (isLoading && !item) {
    return (
      <div className="container-page py-24 text-center text-sm text-muted-foreground">
        جاري تحميل المشروع…
      </div>
    );
  }

  if (!item) return null;

  const projectUrl = item.url?.trim();
  const serviceLinks = serviceLinksForPortfolio(item);
  const tags = normalizeTags(item.tags ?? []);
  const hasStory = Boolean(item.challenge || item.solution || item.resultsSummary);
  const { name: brandName, specialty } = splitDisplayTitle(item.title);

  const hasExtra =
    hasStory ||
    (item.servicesProvided && item.servicesProvided.length > 0) ||
    (item.technologies && item.technologies.length > 0) ||
    serviceLinks.length > 0;

  return (
    <article className="portfolio-detail" itemScope itemType="https://schema.org/CreativeWork">

      {/* ─── Hero ─── */}
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pb-12 pt-6 md:pb-16">
          <div className="portfolio-detail-head">
            <div className="portfolio-detail-head-main">
              {item.category && (
                <p className="portfolio-detail-kicker">
                  <span>{item.category}</span>
                </p>
              )}
              <h1 className="portfolio-detail-title" itemProp="name">
                <span className="portfolio-detail-brand">{brandName}</span>
                {specialty && <span className="portfolio-detail-specialty">{specialty}</span>}
              </h1>
              {item.client && (
                <p className="portfolio-detail-client">
                  <span>العميل</span>
                  {item.client}
                </p>
              )}
            </div>
            {projectUrl && (
              <div className="portfolio-detail-actions">
                <a
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  itemProp="url"
                >
                  زيارة الموقع
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>
            )}
          </div>

          {item.imageUrl && (
            <figure className="portfolio-detail-figure">
              <SiteImage
                src={item.imageUrl}
                alt={`${flattenTitle(item.title)} — مشروع ${item.category} | ${SITE_NAME}`}
                width={1600}
                height={1000}
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 768px) 100vw, 72rem"
                wrapperClassName="portfolio-detail-media"
                className="!h-auto !w-full !max-h-none !object-contain"
              />
            </figure>
          )}

          <div className="portfolio-detail-lower">
            <div className="portfolio-detail-copy">
              <h2 className="portfolio-detail-section-label">عن المشروع</h2>
              <p className="portfolio-detail-desc" itemProp="description">
                {item.description}
              </p>
            </div>
            {tags.length > 0 && (
              <aside className="portfolio-detail-side">
                <h2 className="portfolio-detail-section-label">الكلمات المفتاحية</h2>
                <ul className="portfolio-detail-tags">
                  {tags.slice(0, 12).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ─── Story + Chips ─── */}
      {hasExtra && (
        <section className="section tone-tinted">
          <div className="container-page">

            {/* Challenge / Solution / Result */}
            {hasStory && (
              <div className="grid gap-5 md:grid-cols-2 mb-8">
                {item.challenge && (
                  <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-500 grid place-items-center shrink-0 font-black text-sm">
                        !
                      </span>
                      <h2 className="font-bold text-base">التحدي</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.challenge}</p>
                  </div>
                )}
                {item.solution && (
                  <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0 font-black text-sm">
                        ✓
                      </span>
                      <h2 className="font-bold text-base">الحل</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.solution}</p>
                  </div>
                )}
                {item.resultsSummary && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 flex flex-col gap-3 md:col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0 font-black text-base">
                        ↑
                      </span>
                      <h2 className="font-bold text-base text-primary">النتيجة</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.resultsSummary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Services / Tech / Related */}
            {(item.servicesProvided?.length || item.technologies?.length || serviceLinks.length > 0) && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {item.servicesProvided && item.servicesProvided.length > 0 && (
                  <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
                    <h2 className="font-bold text-sm">الخدمات المقدَّمة</h2>
                    <ul className="flex flex-wrap gap-2">
                      {item.servicesProvided.map((s) => (
                        <li
                          key={s}
                          className="text-xs font-semibold border border-border bg-background rounded-full px-3 py-1"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
                    <h2 className="font-bold text-sm">التقنيات</h2>
                    <ul className="flex flex-wrap gap-2">
                      {item.technologies.map((t) => (
                        <li
                          key={t}
                          className="text-xs font-semibold border border-border bg-background rounded-full px-3 py-1"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {serviceLinks.length > 0 && (
                  <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-3">
                    <h2 className="font-bold text-sm">خدمات مرتبطة</h2>
                    <ul className="flex flex-wrap gap-2">
                      {serviceLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            className="text-xs font-semibold border border-border bg-background rounded-full px-3 py-1 hover:border-primary/40 hover:text-primary transition-colors inline-block"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8">
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowUpLeft className="h-4 w-4 rtl-flip" aria-hidden />
                العودة إلى الأعمال
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* back link if no extra section */}
      {!hasExtra && (
        <section className="section section-compact-top">
          <div className="container-page">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowUpLeft className="h-4 w-4 rtl-flip" aria-hidden />
              العودة إلى الأعمال
            </Link>
          </div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="section section-compact-top pb-16">
        <div className="container-page">
          <div className="home-cta-block relative">
            <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white">
              <Sparkles className="h-3 w-3" aria-hidden /> ابدأ اليوم
            </span>
            <h2 className="relative mx-auto mt-3 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
              مشروع مشابه في بالك؟
            </h2>
            <p className="relative mx-auto mt-2.5 max-w-lg text-sm text-white/80">
              تواصل معنا عبر واتساب أو اترك رسالة — نرد خلال 24 ساعة.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="btn-primary">
                تواصل معنا <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
              </Link>
              <Link to="/portfolio" className="btn-ghost">
                شاهد أعمال أخرى
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
