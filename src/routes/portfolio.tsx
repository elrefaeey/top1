import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowRight, ArrowUpLeft, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteImage } from "@/components/site/SiteImage";
import { PageIntro } from "@/components/site/SectionIntro";
import { ContentError } from "@/components/site/ContentState";
import { Reveal } from "@/components/site/Reveal";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { usePortfolio } from "@/hooks/use-cms";
import { flattenTitle, portfolioItemSlug, splitDisplayTitle } from "@/lib/cms/admin-utils";
import { portfolioPageInternalLinks } from "@/lib/seo/internal-links";
import { stripHtml } from "@/lib/seo/blog-utils";
import { SITE_NAME } from "@/lib/site-config";
import { loadPortfolioRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildPortfolioListingHead } from "@/lib/seo/static-page-head";
import type { PortfolioItem, WithId } from "@/types/cms";
import { localizePortfolio } from "@/lib/i18n/localize-cms";
import { useLocale } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/portfolio")({
  loader: () => loadPortfolioRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string) === "/portfolio/$slug")) return {};
    return buildPortfolioListingHead(loaderData ?? { cms: null, portfolio: [] });
  },
  component: Portfolio,
});

function projectExcerpt(description: string, max = 140) {
  const text = stripHtml(description);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function PortfolioCard({
  item,
  index,
  featured = false,
}: {
  item: WithId<PortfolioItem>;
  index: number;
  featured?: boolean;
}) {
  const { m, t } = useLocale();
  const slug = portfolioItemSlug(item);
  const { name, specialty } = splitDisplayTitle(item.title);
  const excerpt = projectExcerpt(item.description, featured ? 180 : 110);
  const showClient = Boolean(item.client && item.client.trim() !== name);

  return (
    <Link
      to="/portfolio/$slug"
      params={{ slug }}
      className={
        featured
          ? "group grid overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 lg:grid-cols-2"
          : "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1.5 transition-all duration-300"
      }
    >
      {item.imageUrl ? (
        <div className={`relative overflow-hidden ${featured ? "lg:order-2" : ""}`}>
          <SiteImage
            src={item.imageUrl}
            alt={t(m.portfolioPage.imageAlt, {
              title: flattenTitle(item.title),
              category: item.category,
              name: SITE_NAME,
            })}
            overlay
            width={featured ? 1200 : 800}
            height={featured ? 800 : 600}
            sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            wrapperClassName={featured ? "aspect-[16/10] w-full lg:h-full lg:min-h-full" : "aspect-[4/3] w-full"}
            className="transition-transform duration-500 group-hover:scale-105 object-cover object-top"
          />
          {item.category ? (
            <span className="absolute top-3 start-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
              {item.category}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="relative grid aspect-[4/3] w-full place-items-center bg-accent text-sm text-muted-foreground">
            {m.portfolioPage.noImage}
        </div>
      )}

      <div className={`flex flex-1 flex-col justify-center ${featured ? "p-6 md:p-8 lg:p-10 gap-3" : "p-5 gap-2.5"}`}>
        <div className="flex items-center justify-between gap-3">
          {showClient ? (
            <p className="text-xs font-medium text-muted-foreground">{t(m.portfolioPage.client, { name: item.client })}</p>
          ) : (
            <span />
          )}
          <span className="text-xs font-bold text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h2 className={`font-bold leading-snug group-hover:text-primary transition-colors ${featured ? "text-xl md:text-2xl" : "text-base"}`}>
          {name}
        </h2>
        {specialty ? (
          <p className="text-sm font-medium text-foreground/80">{specialty}</p>
        ) : null}
        {excerpt ? (
          <p className={`text-sm text-muted-foreground leading-relaxed ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
            {excerpt}
          </p>
        ) : null}

        <div className="mt-auto pt-3 border-t border-border/50">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            {m.portfolioPage.details}
            <ArrowUpLeft className="h-3.5 w-3.5 rtl-flip group-hover:-translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Portfolio() {
  const isDetail = useMatch({ from: "/portfolio/$slug", shouldThrow: false });
  const { portfolio: loaderItems = [] } = Route.useLoaderData();
  const { data: queryItems = [], isLoading, isError, isSuccess, refetch } = usePortfolio();
  const { m, locale } = useLocale();
  const rawItems = isSuccess ? queryItems : loaderItems.length > 0 ? loaderItems : queryItems;
  const items = useMemo(
    () => rawItems.map((item) => localizePortfolio(item, locale)),
    [rawItems, locale],
  );
  const allKey = "__all__";
  const [cat, setCat] = useState(allKey);

  const categories = useMemo(() => {
    const cats = [...new Set(items.map((p) => p.category).filter(Boolean))];
    return [allKey, ...cats];
  }, [items]);

  const filtered = useMemo(
    () => (cat === allKey ? items : items.filter((p) => p.category === cat)),
    [items, cat, allKey],
  );

  const featured = cat === allKey && filtered.length > 1 ? filtered[0] : null;
  const gridItems = featured ? filtered.slice(1) : filtered;

  if (isDetail) return <Outlet />;

  return (
    <>
      <PageIntro
        eyebrow={m.portfolioPage.eyebrow}
        title={
          <>
            {m.portfolioPage.titleBefore}
            <span className="text-gradient">{m.portfolioPage.titleGradient}</span>
          </>
        }
        desc={m.portfolioPage.desc}
      />

      <section className="section tone-tinted">
        <div className="container-page">
          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    cat === c
                      ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "border-border/80 bg-surface text-foreground shadow-sm hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {c === allKey ? m.common.all : c}
                </button>
              ))}
            </div>
          )}

          {isLoading && items.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">{m.portfolioPage.loading}</div>
          )}
          {isError && items.length === 0 && (
            <ContentError message={m.portfolioPage.fail} onRetry={() => void refetch()} />
          )}
          {!isLoading && !isError && items.length === 0 && (
            <p className="surface-card rounded-2xl py-16 text-center text-muted-foreground">
              {m.portfolioPage.empty}
            </p>
          )}
          {items.length > 0 && filtered.length === 0 && (
            <p className="surface-card rounded-2xl py-16 text-center text-muted-foreground">
              {m.portfolioPage.emptyCat}
            </p>
          )}

          {featured ? (
            <Reveal className="mb-6">
              <PortfolioCard item={featured} index={0} featured />
            </Reveal>
          ) : null}

          {gridItems.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridItems.map((p, idx) => (
                <Reveal key={p.id} delay={idx * 60} className="h-full">
                  <PortfolioCard item={p} index={featured ? idx + 1 : idx} />
                </Reveal>
              ))}
            </div>
          )}

          {!isLoading && items.length > 0 ? (
            <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
              <span className="page-intro-eyebrow mx-auto">
                <Sparkles className="h-3 w-3" /> {m.portfolioPage.nextEyebrow}
              </span>
              <h2 className="page-intro-title page-intro-title--section mt-3">{m.portfolioPage.nextTitle}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                {m.portfolioPage.nextDesc}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  {m.common.startProject} <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
                <Link to="/services" className="btn-ghost">
                  {m.common.browseServices}
                </Link>
              </div>
            </div>
          ) : null}

          {items.length > 0 ? (
            <InternalLinksBlock
              className="mt-10"
              title={m.common.usefulLinks}
              links={portfolioPageInternalLinks()}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}
