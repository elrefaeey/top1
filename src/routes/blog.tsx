import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { Search, ArrowUpLeft, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBlogPosts } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { localizeBlogPost } from "@/lib/i18n/localize-cms";
import { formatPostDate } from "@/lib/date-utils";
import { SiteImage } from "@/components/site/SiteImage";
import { ContentError } from "@/components/site/ContentState";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";

import { blogListingInternalLinks } from "@/lib/seo/internal-links";
import { loadBlogRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildBlogListingHead } from "@/lib/seo/static-page-head";
import { useLocale } from "@/providers/LocaleProvider";
import { localeDateTag } from "@/lib/i18n/locale";

export const Route = createFileRoute("/blog")({
  loader: () => loadBlogRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string) === "/blog/$slug")) return {};
    return buildBlogListingHead(loaderData ?? { cms: null, posts: [] });
  },
  component: Blog,
});

function Blog() {
  const isPost = useMatch({ from: "/blog/$slug", shouldThrow: false });
  const [q, setQ] = useState("");
  const allKey = "__all__";
  const [cat, setCat] = useState(allKey);
  const { posts: loaderPosts = [] } = Route.useLoaderData();
  const { data: queryPosts = [], isLoading, isError, isSuccess, refetch } = useBlogPosts();
  const { m, t, locale } = useLocale();
  const rawPosts = isSuccess ? queryPosts : loaderPosts.length > 0 ? loaderPosts : queryPosts;
  const posts = useMemo(
    () => rawPosts.map((item) => localizeBlogPost(item, locale)),
    [rawPosts, locale],
  );

  useEffect(() => {
    setCat(allKey);
  }, [locale, allKey]);

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return [allKey, ...cats];
  }, [posts]);

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (cat === allKey || p.category === cat) &&
          p.title.toLowerCase().includes(q.toLowerCase()),
      ),
    [posts, cat, q, allKey],
  );

  const trending = filtered.filter((p) => p.trending);

  if (isPost) return <Outlet />;

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <span className="page-intro-eyebrow mx-auto">{m.blogPage.eyebrow}</span>
            <h1 className="page-intro-title mt-4">
              {m.blogPage.titleBefore}
              <span className="text-gradient">{m.blogPage.titleGradient}</span>
            </h1>
            <p className="page-intro-desc mt-4">{m.blogPage.desc}</p>

            {/* Search */}
            <div className="mt-8 relative w-full max-w-lg mx-auto">
              <Search className="h-4 w-4 absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={m.blogPage.search}
                aria-label={m.blogPage.searchAria}
                className="w-full h-13 ps-11 pe-5 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring shadow-sm text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section tone-tinted">
        <div className="container-page">

          {/* ─── Category filters ─── */}
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

          {/* ─── States ─── */}
          {isLoading && posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {m.blogPage.loading}
            </div>
          )}
          {isError && posts.length === 0 && (
            <ContentError message={m.blogPage.fail} onRetry={() => void refetch()} />
          )}
          {!isLoading && !isError && posts.length === 0 && (
            <p className="text-center py-16 text-muted-foreground surface-card">
              {m.blogPage.empty}
            </p>
          )}

          {/* ─── Trending ─── */}
          {trending.length > 0 && cat === allKey && q === "" && (
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold tracking-wide">{m.blogPage.trending}</span>
              </div>

              <div className={`grid gap-6 ${trending.length > 1 ? "md:grid-cols-2" : "max-w-2xl"}`}>
                {trending.map((p) => (
                  <Link
                    key={p.id}
                    to="/blog/$slug"
                    params={{ slug: blogPostSlug(p) }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* صورة */}
                    <div className="overflow-hidden">
                      {p.featuredImage ? (
                        <SiteImage
                          src={p.featuredImage}
                          alt={p.featuredImageAlt ?? p.title}
                          width={960}
                          height={540}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          wrapperClassName="aspect-[16/9] w-full"
                          className="transition-transform duration-500 group-hover:scale-105 object-cover object-top"
                        />
                      ) : (
                        <div className="aspect-[16/9] w-full bg-muted" />
                      )}
                    </div>

                    {/* Trending badge */}
                    <span className="absolute top-3 start-3 inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      <TrendingUp className="h-3 w-3" /> {m.blogPage.hot}
                    </span>

                    <div className="flex flex-col flex-1 p-6 gap-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="bg-primary/10 text-primary font-semibold rounded-full px-2.5 py-0.5">
                          {p.category}
                        </span>
                        <span className="opacity-40">·</span>
                        <Calendar className="h-3 w-3 opacity-60" />
                        <span>{p.publishedAt ? formatPostDate(p.publishedAt, localeDateTag(locale)) : ""}</span>
                      </div>
                      <h2 className="text-lg font-bold leading-snug group-hover:text-primary line-clamp-2">
                        {p.title}
                      </h2>
                      {p.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {p.excerpt}
                        </p>
                      )}
                      <div className="mt-auto pt-3 border-t border-border/50">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          {m.blogPage.read} <ArrowUpLeft className="h-3.5 w-3.5 rtl-flip" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ─── Latest posts ─── */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold tracking-wide">{m.blogPage.latest}</span>
              <span className="text-xs text-muted-foreground">{t(m.blogPage.count, { n: filtered.length })}</span>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: blogPostSlug(p) }}
                className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* صورة */}
                <div className="overflow-hidden">
                  {p.featuredImage ? (
                    <SiteImage
                      src={p.featuredImage}
                      alt={p.featuredImageAlt ?? p.title}
                      width={800}
                      height={450}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      wrapperClassName="aspect-[16/9] w-full"
                      className="transition-transform duration-500 group-hover:scale-105 object-cover object-top"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full bg-muted" />
                  )}
                </div>

                {/* محتوى */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-primary/10 text-primary font-semibold rounded-full px-2.5 py-0.5">
                      {p.category}
                    </span>
                    <span className="opacity-40">·</span>
                    <Calendar className="h-3 w-3 opacity-60" />
                    <span>{p.publishedAt ? formatPostDate(p.publishedAt, localeDateTag(locale)) : ""}</span>
                  </div>

                  <h2 className="font-bold text-base leading-snug group-hover:text-primary line-clamp-2">
                    {p.title}
                  </h2>

                  {p.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.excerpt}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-border/50">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      {m.blogPage.read} <ArrowUpLeft className="h-3.5 w-3.5 rtl-flip" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {!isLoading && filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                {m.blogPage.noMatch}
              </div>
            )}
          </div>

          {!isLoading && posts.length > 0 ? (
            <InternalLinksBlock
              className="mt-14"
              title={m.common.usefulLinks}
              links={blogListingInternalLinks(posts)}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}
