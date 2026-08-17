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

/** Normalize tags that may arrive as one comma-separated string. */
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

  return (
    <article className="portfolio-detail" itemScope itemType="https://schema.org/CreativeWork">
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pb-12 pt-6 md:pb-16">
          <div className="portfolio-detail-head">
            <div className="portfolio-detail-head-main">
              {item.category ? (
                <p className="portfolio-detail-kicker">
                  <span>{item.category}</span>
                </p>
              ) : null}
              <h1 className="portfolio-detail-title" itemProp="name">
                <span className="portfolio-detail-brand">{brandName}</span>
                {specialty ? (
                  <span className="portfolio-detail-specialty">{specialty}</span>
                ) : null}
              </h1>
              {item.client ? (
                <p className="portfolio-detail-client">
                  <span>العميل</span>
                  {item.client}
                </p>
              ) : null}
            </div>
            {projectUrl ? (
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
            ) : null}
          </div>

          {item.imageUrl ? (
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
          ) : null}

          <div className="portfolio-detail-lower">
            <div className="portfolio-detail-copy">
              <h2 className="portfolio-detail-section-label">عن المشروع</h2>
              <p className="portfolio-detail-desc" itemProp="description">
                {item.description}
              </p>
            </div>

            {tags.length > 0 ? (
              <aside className="portfolio-detail-side">
                <h2 className="portfolio-detail-section-label">الكلمات المفتاحية</h2>
                <ul className="portfolio-detail-tags">
                  {tags.slice(0, 12).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </section>

      {(hasStory ||
        (item.servicesProvided && item.servicesProvided.length > 0) ||
        (item.technologies && item.technologies.length > 0) ||
        serviceLinks.length > 0) && (
        <section className="section tone-tinted portfolio-detail-body">
          <div className="container-page">
            <div className="portfolio-detail-panel">
              {hasStory ? (
                <div className="portfolio-detail-story">
                  {item.challenge ? (
                    <div>
                      <h2>التحدي</h2>
                      <p>{item.challenge}</p>
                    </div>
                  ) : null}
                  {item.solution ? (
                    <div>
                      <h2>الحل</h2>
                      <p>{item.solution}</p>
                    </div>
                  ) : null}
                  {item.resultsSummary ? (
                    <div className="portfolio-detail-story-full">
                      <h2>النتيجة</h2>
                      <p>{item.resultsSummary}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {item.servicesProvided && item.servicesProvided.length > 0 ? (
                <div className="portfolio-detail-chips">
                  <h2>الخدمات المقدَّمة</h2>
                  <ul>
                    {item.servicesProvided.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {item.technologies && item.technologies.length > 0 ? (
                <div className="portfolio-detail-chips">
                  <h2>التقنيات</h2>
                  <ul>
                    {item.technologies.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {serviceLinks.length > 0 ? (
                <div className="portfolio-detail-chips">
                  <h2>خدمات مرتبطة</h2>
                  <ul>
                    {serviceLinks.map((link) => (
                      <li key={link.href}>
                        <Link to={link.href}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="portfolio-detail-back">
              <Link to="/portfolio">
                <ArrowUpLeft className="h-4 w-4 rtl-flip" aria-hidden />
                العودة إلى الأعمال
              </Link>
            </div>
          </div>
        </section>
      )}

      {!hasStory &&
      !(item.servicesProvided && item.servicesProvided.length > 0) &&
      !(item.technologies && item.technologies.length > 0) &&
      serviceLinks.length === 0 ? (
        <section className="section section-compact-top">
          <div className="container-page">
            <div className="portfolio-detail-back">
              <Link to="/portfolio">
                <ArrowUpLeft className="h-4 w-4 rtl-flip" aria-hidden />
                العودة إلى الأعمال
              </Link>
            </div>
          </div>
        </section>
      ) : null}

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
