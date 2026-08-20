import { createFileRoute, Link, notFound, redirect, useParams } from "@tanstack/react-router";
import { Twitter, Linkedin, Facebook, Link2, Clock, Calendar, ArrowUpLeft } from "lucide-react";
import { useBlogPost, useBlogPosts } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";
import { SiteImage } from "@/components/site/SiteImage";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { loadBlogPostForSeoFn } from "@/lib/seo/cms-seo.functions";
import {
  extractTocFromHtml,
  getRelatedPosts,
  injectHeadingIds,
  resolveReadTime,
} from "@/lib/seo/blog-utils";
import { serviceLinksForBlogPost } from "@/lib/seo/internal-links";
import { buildBlogPostHead, notFoundHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await loadBlogPostForSeoFn({ data: { slug: params.slug } });
    if (!post) {
      throw notFound({ headers: NOINDEX_HEADERS });
    }
    const canonical = blogPostSlug(post);
    if (canonical && canonical !== params.slug) {
      throw redirect({
        to: "/blog/$slug",
        params: { slug: canonical },
        statusCode: 301,
        replace: true,
      });
    }
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData?.post) return notFoundHead();
    return buildBlogPostHead(loaderData.post, params.slug);
  },
  component: Post,
});

function Post() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { post: loaderPost } = Route.useLoaderData();
  const { data: hookPost, isLoading } = useBlogPost(slug);
  const post = hookPost ?? loaderPost;
  const { data: allPosts = [] } = useBlogPosts();

  if (isLoading && !post) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground text-sm">
        جاري تحميل المقال…
      </div>
    );
  }

  if (!post) return null;

  const readTime = resolveReadTime(post);
  const contentWithIds = injectHeadingIds(post.content);
  const toc = extractTocFromHtml(contentWithIds);
  const showToc = toc.length >= 3;
  const related = getRelatedPosts(post, allPosts, 3);
  const serviceLinks = serviceLinksForBlogPost(post);
  const dateLabel = post.publishedAt ? formatPostDate(post.publishedAt) : "";
  const modifiedLabel = post.updatedAt ? formatPostDate(post.updatedAt) : "";
  const breadcrumbs = [
    { name: "الرئيسية", path: "/" },
    { name: "المدونة", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ];

  const authorInitials = post.author
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

  return (
    <article itemScope itemType="https://schema.org/Article">

      {/* ─── Header ─── */}
      <header className="hero-bg">
        <div className="container-page pt-14 pb-10 max-w-3xl">
          <BreadcrumbNav items={breadcrumbs} className="mb-8" />

          {/* Category badge */}
          <span className="inline-block text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1 mb-5">
            {post.category}
          </span>

          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.2]"
            itemProp="headline"
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed" itemProp="description">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-7 pt-5 border-t border-border/60 flex flex-wrap items-center gap-4">
            {/* Author avatar + name */}
            <div className="flex items-center gap-2.5">
              <span
                className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center text-xs font-bold text-primary shrink-0"
                aria-hidden
              >
                {authorInitials}
              </span>
              <span itemProp="author" className="text-sm font-semibold text-foreground">
                {post.author}
              </span>
            </div>

            <span className="text-border/60 hidden sm:inline" aria-hidden>|</span>

            {/* Date */}
            {dateLabel && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <time dateTime={post.publishedAt} itemProp="datePublished">
                  {dateLabel}
                </time>
              </div>
            )}

            {/* Read time */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>
                {readTime} دقائق قراءة
                <meta itemProp="timeRequired" content={`PT${readTime}M`} />
              </span>
            </div>

            {/* Updated */}
            {modifiedLabel && post.updatedAt !== post.publishedAt && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-full px-2.5 py-1">
                <time dateTime={post.updatedAt} itemProp="dateModified">
                  محدّث {modifiedLabel}
                </time>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Featured image ─── */}
      {post.featuredImage && (
        <div className="container-page pt-2 pb-10 max-w-4xl">
          <SiteImage
            src={post.featuredImage}
            alt={post.featuredImageAlt ?? `${post.title} — مدونة ${SITE_NAME}`}
            width={1280}
            height={640}
            fetchPriority="high"
            loading="eager"
            wrapperClassName="aspect-[16/9] w-full rounded-2xl border border-border shadow-[var(--shadow-card)]"
            className="object-cover object-top"
          />
        </div>
      )}

      {/* ─── Article body ─── */}
      <div className="container-page pb-24 max-w-3xl">

        {/* TOC */}
        {showToc && (
          <nav
            className="rounded-2xl border border-border bg-surface/80 p-5 mb-10 shadow-sm"
            aria-label="جدول المحتويات"
          >
            <h2 className="text-sm font-bold text-foreground mb-3">جدول المحتويات</h2>
            <ol className="space-y-2">
              {toc.map((entry, i) => (
                <li key={entry.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold shrink-0 w-5">{i + 1}.</span>
                  <a href={`#${entry.id}`} className="hover:text-primary transition-colors leading-snug">
                    {entry.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Content */}
        <div
          className="prose-section space-y-4 text-[17px] leading-[1.85] text-foreground/85 [&_h2]:mt-10 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:scroll-mt-28 [&_h3]:text-xl [&_h3]:font-bold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-primary/40 hover:[&_a]:decoration-primary [&_ul]:list-disc [&_ul]:pe-6 [&_ul]:space-y-2 [&_figure.blog-inline-image]:my-8 [&_figure.blog-inline-image]:overflow-hidden [&_figure.blog-inline-image]:rounded-2xl [&_figure.blog-inline-image]:border [&_figure.blog-inline-image]:border-border [&_figure.blog-inline-image_img]:block [&_figure.blog-inline-image_img]:w-full [&_figure.blog-inline-image_img]:h-auto [&_figure.blog-inline-image_figcaption]:px-4 [&_figure.blog-inline-image_figcaption]:py-3 [&_figure.blog-inline-image_figcaption]:text-sm [&_figure.blog-inline-image_figcaption]:text-muted-foreground [&_figure.blog-inline-image_figcaption]:bg-muted/40"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />

        <InternalLinksBlock
          title="خدمات ذات صلة"
          links={serviceLinks}
          className="mt-10 pt-6 border-t border-border"
        />

        {/* ─── Author + Share ─── */}
        <div className="mt-10 pt-6 border-t border-border rounded-2xl bg-surface/60 p-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center font-bold text-primary text-sm shrink-0"
              aria-hidden
            >
              {authorInitials}
            </span>
            <div>
              <div className="text-sm font-semibold" itemProp="author">
                {post.author}
              </div>
              <div className="text-xs text-muted-foreground">فريق الاستوديو · {SITE_NAME}</div>
            </div>
          </div>
          <div className="flex items-center gap-2" aria-label="مشاركة المقال">
            {[Twitter, Linkedin, Facebook, Link2].map((Icon, i) => (
              <button
                key={i}
                type="button"
                aria-label="مشاركة"
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        {/* ─── Related posts ─── */}
        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-posts-title">
            <h2 id="related-posts-title" className="text-xl font-bold mb-5">
              مقالات ذات صلة
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/blog/$slug"
                  params={{ slug: blogPostSlug(r) }}
                  className="group overflow-hidden rounded-2xl border border-border bg-surface hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {r.featuredImage && (
                    <SiteImage
                      src={r.featuredImage}
                      alt={r.featuredImageAlt ?? r.title}
                      width={640}
                      height={360}
                      wrapperClassName="aspect-[16/9] w-full overflow-hidden"
                      className="transition-transform duration-500 group-hover:scale-105 object-cover object-top"
                    />
                  )}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="text-xs bg-primary/10 text-primary font-semibold rounded-full px-2.5 py-0.5 self-start">
                      {r.category}
                    </span>
                    <h3 className="font-semibold leading-snug group-hover:text-primary line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        اقرأ المقال <ArrowUpLeft className="h-3 w-3 rtl-flip" />
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {resolveReadTime(r)} دقائق
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
