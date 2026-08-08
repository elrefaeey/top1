import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Linkedin } from "lucide-react";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { useAuthor } from "@/hooks/use-cms";
import { authorSlug } from "@/lib/cms/admin-utils";
import { loadAuthorForSeoFn } from "@/lib/seo/cms-seo.functions";
import { LANDING_LINKS } from "@/lib/seo/internal-links";
import { buildAuthorHead, notFoundHead } from "@/lib/seo/authority-head";
import { SITE_NAME } from "@/lib/site-config";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 1);
  return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`;
}

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
  const avatarSrc =
    author.avatarUrl?.trim() && !author.avatarUrl.startsWith("data:")
      ? author.avatarUrl.trim()
      : "";
  const breadcrumbs = [
    { name: "الرئيسية", path: "/" },
    { name: "من نحن", path: "/about" },
    { name: author.name, path: `/authors/${pathSlug}` },
  ];

  return (
    <article className="author-profile">
      <section className="author-profile-hero hero-bg" aria-labelledby="author-heading">
        <div className="container-page author-profile-hero-inner">
          <BreadcrumbNav items={breadcrumbs} />

          <div className="author-profile-layout">
            <div className="author-profile-photo-wrap">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={author.name}
                  width={320}
                  height={320}
                  decoding="async"
                  fetchPriority="high"
                  className="author-profile-photo"
                />
              ) : (
                <div className="author-profile-photo author-profile-photo--initials" aria-hidden>
                  {authorInitials(author.name)}
                </div>
              )}
            </div>

            <div className="author-profile-copy">
              <p className="author-profile-role">{author.role}</p>
              <h1 id="author-heading" className="author-profile-name">
                {author.name}
              </h1>
              <p className="author-profile-bio">{author.bio}</p>

              <div className="author-profile-meta">
                {author.yearsExperience != null ? (
                  <span className="author-profile-chip">
                    <Briefcase className="h-3.5 w-3.5" aria-hidden />
                    {author.yearsExperience}+ سنوات خبرة
                  </span>
                ) : null}
                <span className="author-profile-chip">{SITE_NAME}</span>
              </div>

              <div className="author-profile-actions">
                <Link to="/contact" className="btn-primary">
                  تواصل معنا
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
                <Link to="/about" className="btn-ghost">
                  عن {SITE_NAME}
                </Link>
                {author.linkedinUrl ? (
                  <a
                    href={author.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden />
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section tone-tinted">
        <div className="container-page author-profile-body">
          {author.expertise.length > 0 ? (
            <div className="author-profile-expertise">
              <h2 className="author-profile-section-title">مجالات الخبرة</h2>
              <ul className="author-profile-expertise-list">
                {author.expertise.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <InternalLinksBlock title="خدمات ومناطق" links={LANDING_LINKS} />
        </div>
      </section>
    </article>
  );
}
