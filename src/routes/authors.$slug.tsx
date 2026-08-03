import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { useAuthor } from "@/hooks/use-cms";
import { authorSlug } from "@/lib/cms/admin-utils";
import { loadAuthorForSeoFn } from "@/lib/seo/cms-seo.functions";
import { LANDING_LINKS } from "@/lib/seo/internal-links";
import { buildAuthorHead, notFoundHead } from "@/lib/seo/authority-head";
import { SITE_NAME } from "@/lib/site-config";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/authors/$slug")({
  loader: async ({ params }) => {
    const author = await loadAuthorForSeoFn({ data: { slug: params.slug } });
    if (!author) throw notFound({ headers: NOINDEX_HEADERS });
    return { author };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.author) return notFoundHead();
    return buildAuthorHead(loaderData.author);
  },
  component: AuthorProfile,
});

function AuthorProfile() {
  const { slug } = useParams({ from: "/authors/$slug" });
  const { author: loaderAuthor } = Route.useLoaderData();
  const { data: hookAuthor, isLoading } = useAuthor(slug);
  const author = hookAuthor ?? loaderAuthor;

  if (isLoading && !author) {
    return (
      <div className="container-page py-24 text-center text-sm text-muted-foreground">
        جاري التحميل…
      </div>
    );
  }

  if (!author) return null;

  const pathSlug = authorSlug(author);
  const breadcrumbs = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: author.name, path: `/authors/${pathSlug}` },
  ];

  return (
    <article>
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative max-w-3xl pb-14 pt-6">
          <BreadcrumbNav items={breadcrumbs} />
          <p className="mt-6 text-sm font-medium text-primary">{author.role}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{author.name}</h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">{author.bio}</p>
          {author.yearsExperience != null && (
            <p className="mt-3 text-sm text-muted-foreground">
              خبرة تقريبية: {author.yearsExperience}+ سنوات
            </p>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl space-y-8">
          {author.expertise.length > 0 && (
            <div>
              <h2 className="text-xl font-bold tracking-tight">مجالات الخبرة</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {author.expertise.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link to="/about" className="btn-ghost">
              عن {SITE_NAME}
            </Link>
            <Link to="/contact" className="btn-primary">
              تواصل معنا
            </Link>
          </div>
          <InternalLinksBlock title="خدمات ومناطق" links={LANDING_LINKS} />
        </div>
      </section>
    </article>
  );
}
