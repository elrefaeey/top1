import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Twitter, Linkedin, Facebook, Link2, ArrowRight } from "lucide-react";
import { useBlogPost, useBlogPosts } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";
import { SiteImage } from "@/components/site/SiteImage";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { loadBlogPostForSeo } from "@/lib/seo/cms-loaders";
import {
  extractTocFromHtml,
  getRelatedPosts,
  injectHeadingIds,
  resolveReadTime,
} from "@/lib/seo/blog-utils";
import { serviceLinksForBlogPost } from "@/lib/seo/internal-links";
import { buildBlogPostHead, buildPageHead } from "@/lib/seo";
import { sanitizeCmsHtml } from "@/lib/security/sanitize-html";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await loadBlogPostForSeo(params.slug);
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (loaderData?.post) {
      return buildBlogPostHead(loaderData.post, params.slug);
    }
    return buildPageHead({
      title: `مقال — ${SITE_NAME}`,
      description: `مقال من مدونة ${SITE_NAME}.`,
      path: `/blog/${params.slug}`,
      type: "article",
    });
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

  if (!post) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">المقال غير موجود</h1>
        <Link to="/blog" className="mt-6 inline-flex btn-primary">كل المقالات</Link>
      </main>
    );
  }

  const readTime = resolveReadTime(post);
  const sanitized = sanitizeCmsHtml(post.content);
  const contentWithIds = injectHeadingIds(sanitized);
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

  return (
    <article itemScope itemType="https://schema.org/Article">
      <header className="hero-bg">
        <div className="container-page pt-16 pb-12 max-w-3xl">
          <BreadcrumbNav items={breadcrumbs} className="mb-6" />
          <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
            <span className="text-primary font-medium">{post.category}</span>
            ·
            {dateLabel && (
              <time dateTime={post.publishedAt} itemProp="datePublished">
                {dateLabel}
              </time>
            )}
            ·
            <span itemProp="author">{post.author}</span>
            ·
            <span>
              {readTime} دقائق قراءة
              <meta itemProp="timeRequired" content={`PT${readTime}M`} />
            </span>
            {modifiedLabel && post.updatedAt !== post.publishedAt && (
              <>
                ·
                <time dateTime={post.updatedAt} itemProp="dateModified">
                  محدّث {modifiedLabel}
                </time>
              </>
            )}
          </div>
          <h1
            className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]"
            itemProp="headline"
          >
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground" itemProp="description">
            {post.excerpt}
          </p>
        </div>
      </header>

      {post.featuredImage && (
        <div className="container-page py-12 max-w-4xl">
          <SiteImage
            src={post.featuredImage}
            alt={post.featuredImageAlt ?? `${post.title} — مدونة ${SITE_NAME}`}
            width={1280}
            height={640}
            fetchPriority="high"
            loading="eager"
            wrapperClassName="aspect-[16/8] w-full rounded-[var(--radius-2xl)] border border-border shadow-[var(--shadow-card)]"
          />
        </div>
      )}

      <div className="container-page pb-24 max-w-3xl">
        {showToc && (
          <nav
            className="surface-card p-5 mb-10"
            aria-label="جدول المحتويات"
          >
            <h2 className="text-sm font-bold text-foreground">جدول المحتويات</h2>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              {toc.map((entry, i) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`} className="hover:text-primary transition-colors">
                    {i + 1}. {entry.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div
          className="prose-section space-y-4 text-[17px] leading-[1.85] text-foreground/85 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:pe-6 [&_ul]:space-y-2"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />

        <InternalLinksBlock
          title="خدمات ذات صلة"
          links={serviceLinks}
          className="mt-10 pt-6 border-t border-border"
        />

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span
              className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center font-semibold text-primary"
              aria-hidden
            >
              {post.author.split(" ").map((x) => x[0]).join("")}
            </span>
            <div>
              <div className="text-sm font-semibold" itemProp="author">
                {post.author}
              </div>
              <div className="text-xs text-muted-foreground">
                فريق الاستوديو · {SITE_NAME}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" aria-label="مشاركة المقال">
            {[Twitter, Linkedin, Facebook, Link2].map((Icon, i) => (
              <button
                key={i}
                type="button"
                aria-label="مشاركة"
                className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="related-posts-title">
            <h2 id="related-posts-title" className="text-xl font-bold">
              مقالات ذات صلة
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to="/blog/$slug"
                  params={{ slug: blogPostSlug(r) }}
                  className="surface-card overflow-hidden hover:-translate-y-1 transition-all block"
                >
                  {r.featuredImage && (
                    <SiteImage
                      src={r.featuredImage}
                      alt={r.featuredImageAlt ?? r.title}
                      width={640}
                      height={360}
                      wrapperClassName="aspect-[16/9] w-full"
                    />
                  )}
                  <div className="p-5">
                    <div className="text-xs text-primary font-medium">{r.category}</div>
                    <h3 className="mt-2 font-semibold">{r.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resolveReadTime(r)} دقائق قراءة
                    </p>
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
