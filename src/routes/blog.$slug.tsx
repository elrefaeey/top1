import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Twitter, Linkedin, Facebook, Link2, ArrowRight } from "lucide-react";
import { useBlogPost, useBlogPosts } from "@/hooks/use-cms";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { formatPostDate } from "@/lib/date-utils";
import { SiteImage } from "@/components/site/SiteImage";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `مقال — ${SITE_NAME}` },
      { name: "description", content: `مقال من ${SITE_NAME}` },
      { property: "og:url", content: `/blog/${params.slug}` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  component: Post,
});

function Post() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: post, isLoading } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground text-sm">
        جاري تحميل المقال…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">المقال غير موجود</h1>
        <Link to="/blog" className="mt-6 inline-flex btn-primary">كل المقالات</Link>
      </div>
    );
  }

  const related = allPosts.filter((p) => blogPostSlug(p) !== slug).slice(0, 2);
  const dateLabel = post.publishedAt ? formatPostDate(post.publishedAt) : "";

  return (
    <article>
      <header className="hero-bg">
        <div className="container-page pt-16 pb-12 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowRight className="h-3.5 w-3.5 rtl-flip" /> كل المقالات
          </Link>
          <div className="mt-6 text-xs text-muted-foreground flex gap-2">
            <span className="text-primary font-medium">{post.category}</span>
            ·
            <span>{dateLabel}</span>
            ·
            <span>بقلم {post.author}</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight leading-[1.2]">{post.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>
        </div>
      </header>

      {post.featuredImage && (
        <div className="container-page py-12 max-w-4xl">
          <SiteImage
            src={post.featuredImage}
            alt={post.featuredImageAlt ?? post.title}
            wrapperClassName="aspect-[16/8] w-full rounded-[var(--radius-2xl)] border border-border shadow-[var(--shadow-card)]"
          />
        </div>
      )}

      <div className="container-page pb-24 max-w-3xl">
        <div
          className="prose-section space-y-4 text-[17px] leading-[1.85] text-foreground/85 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_ul]:list-disc [&_ul]:pe-6 [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center font-semibold text-primary">
              {post.author.split(" ").map((x) => x[0]).join("")}
            </span>
            <div>
              <div className="text-sm font-semibold">{post.author}</div>
              <div className="text-xs text-muted-foreground">فريق الاستوديو · {SITE_NAME}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[Twitter, Linkedin, Facebook, Link2].map((Icon, i) => (
              <button key={i} className="grid h-9 w-9 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h3 className="text-xl font-bold">مقالات ذات صلة</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <Link key={r.id} to="/blog/$slug" params={{ slug: blogPostSlug(r) }} className="surface-card overflow-hidden hover:-translate-y-1 transition-all block">
                  {r.featuredImage && (
                    <SiteImage
                      src={r.featuredImage}
                      alt={r.featuredImageAlt ?? r.title}
                      wrapperClassName="aspect-[16/9] w-full"
                    />
                  )}
                  <div className="p-5">
                    <div className="text-xs text-primary font-medium">{r.category}</div>
                    <h4 className="mt-2 font-semibold">{r.title}</h4>
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
