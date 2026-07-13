import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { Search, ArrowUpLeft, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useBlogPosts, usePage } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";
import { SiteImage } from "@/components/site/SiteImage";
import { SeoScreenReaderCopy } from "@/components/seo/SeoScreenReaderCopy";
import { siteImages } from "@/lib/site-images";

import { SITE_NAME } from "@/lib/site-config";

import { featuredBlogCategories } from "@/lib/seo/static-page-content";
import { blogListingInternalLinks } from "@/lib/seo/internal-links";
import { loadBlogRouteSeo } from "@/lib/seo/static-page-loaders";
import { buildBlogListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/blog")({
  loader: () => loadBlogRouteSeo(),
  head: ({ loaderData, matches }) => {
    // تجنّب canonical مزدوج مع صفحة المقال (parent + child)
    if (matches.some((m) => (m.routeId as string) === "/blog/$slug")) return {};
    if (!loaderData) return {};
    return buildBlogListingHead(loaderData);
  },
  component: Blog,
});

function Blog() {
  const isPost = useMatch({ from: "/blog/$slug", shouldThrow: false });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("الكل");
  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: cmsPage } = usePage("blog");

  const categories = useMemo(() => {
    const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
    return ["الكل", ...cats];
  }, [posts]);

  const featuredCategories = useMemo(() => featuredBlogCategories(posts), [posts]);
  const blogDescription = cmsPage?.metaDescription?.trim();

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          (cat === "الكل" || p.category === cat) &&
          p.title.toLowerCase().includes(q.toLowerCase()),
      ),
    [posts, cat, q],
  );

  const trending = filtered.filter((p) => p.trending);

  if (isPost) return <Outlet />;

  return (
    <>
      <section className="hero-bg relative overflow-hidden page-intro">
        <div className="container-page relative page-intro-inner">
          <div className="grid items-center gap-5 lg:grid-cols-2 lg:gap-12">
            <SiteImage
              src={siteImages.blog.default}
              alt="كتابة وتصميم محتوى رقمي"
              wrapperClassName="order-first lg:order-2 aspect-[16/10] w-full rounded-2xl shadow-[var(--shadow-card)]"
            />
            <div className="order-last lg:order-1 text-center lg:text-start">
              <span className="page-intro-eyebrow">المدونة</span>
              <h1 className="page-intro-title">
                مقالات من <span className="text-gradient">الاستوديو.</span>
              </h1>
              <p className="page-intro-desc lg:mx-0">
                أدلة عملية في التصميم والتطوير وSEO ونمو المنتجات.
              </p>
              <div className="mt-5 relative w-full max-w-xl mx-auto lg:mx-0">
                <Search className="h-4 w-4 absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="ابحث في المقالات…"
                  className="w-full h-12 ps-11 pe-4 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isLoading && posts.length > 0 && (
        <SeoScreenReaderCopy>
          <article>
            <h2>مدونة {SITE_NAME}</h2>
            {blogDescription ? <p>{blogDescription}</p> : null}
            {featuredCategories.length > 0 ? (
              <section>
                <h2>أقسام مميزة</h2>
                <ul>
                  {featuredCategories.map((category) => (
                    <li key={category}>{category}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {posts.map((post) => (
              <section key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <p>{post.category}</p>
              </section>
            ))}
            <nav aria-label="روابط داخلية للمدونة">
              <ul>
                {blogListingInternalLinks(posts).map((link) => (
                  <li key={link.href}>
                    <Link to={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p>
              <Link to="/contact">تواصل معنا</Link>
            </p>
          </article>
        </SeoScreenReaderCopy>
      )}

      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  cat === c
                    ? "bg-[var(--gradient-primary)] text-white border-transparent"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-12 text-muted-foreground text-sm">جاري تحميل المقالات…</div>
          )}

          {!isLoading && posts.length === 0 && (
            <p className="text-center py-16 text-muted-foreground surface-card">
              لا توجد مقالات منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم.
            </p>
          )}

          {!isLoading && trending.length > 0 && cat === "الكل" && q === "" && (
            <div className="mb-12">
              <div className="flex items-center gap-2 text-sm font-semibold mb-5">
                <TrendingUp className="h-4 w-4 text-primary" /> الأكثر رواجاً
              </div>
              <div
                className={`grid gap-5 w-full ${
                  trending.length > 1 ? "md:grid-cols-2" : "max-w-xl mx-auto"
                }`}
              >
                {trending.map((p) => (
                  <Link key={p.id} to="/blog/$slug" params={{ slug: blogPostSlug(p) }} className="card-interactive overflow-hidden group block">
                    {p.featuredImage && (
                      <SiteImage
                        src={p.featuredImage}
                        alt={p.featuredImageAlt ?? p.title}
                        wrapperClassName="aspect-[16/9] w-full"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="p-6">
                      <div className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary font-medium">{p.category}</span>
                        ·
                        <span>{p.publishedAt ? formatPostDate(p.publishedAt) : ""}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-semibold group-hover:text-primary">{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm font-semibold mb-4">أحدث المقالات</div>
          <div className="grid gap-5 md:grid-cols-3">
            {filtered.map((p) => (
              <Link key={p.id} to="/blog/$slug" params={{ slug: blogPostSlug(p) }} className="card-interactive overflow-hidden group block">
                {p.featuredImage && (
                  <SiteImage
                    src={p.featuredImage}
                    alt={p.featuredImageAlt ?? p.title}
                    wrapperClassName="aspect-[16/10] w-full"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="p-6">
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary font-medium">{p.category}</span>
                    ·
                    <span>{p.publishedAt ? formatPostDate(p.publishedAt) : ""}</span>
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary">{p.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    اقرأ المقال <ArrowUpLeft className="h-3 w-3 rtl-flip" />
                  </span>
                </div>
              </Link>
            ))}
            {!isLoading && filtered.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">لا توجد مقالات مطابقة.</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
