import { createFileRoute, notFound, useLoaderData, useParams, redirect } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Linkedin } from "lucide-react";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { LocaleLink } from "@/components/site/LocaleLink";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { useAuthor } from "@/hooks/use-cms";
import { authorSlug } from "@/lib/cms/admin-utils";
import { loadAuthorForSeoFn } from "@/lib/seo/cms-seo.functions";
import { LANDING_LINKS } from "@/lib/seo/internal-links";
import { buildAuthorHead, notFoundHead } from "@/lib/seo/authority-head";
import { SITE_NAME } from "@/lib/site-config";
import { localizeAuthorProfile } from "@/lib/i18n/localize-cms";
import { useLocale } from "@/providers/LocaleProvider";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 1);
  return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`;
}

export const Route = createFileRoute("/authors/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/ar/authors/${params.slug}`, statusCode: 301 });
  },
});

export function AuthorProfile() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { author: loaderAuthor } = (useLoaderData({ strict: false }) ?? {}) as {
    author?: import("@/types/cms").Author;
  };
  const { data: hookAuthor, isLoading } = useAuthor(slug);
  const { m, t, locale } = useLocale();
  const raw = hookAuthor ?? loaderAuthor;
  const author = raw ? localizeAuthorProfile(raw, locale) : raw;

  if (isLoading && !author) {
    return (
      <div className="container-page py-24 text-center text-sm text-muted-foreground">
        {m.common.loading}
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
    { name: m.nav.home, path: "/" },
    { name: m.nav.about, path: "/about" },
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
                    {t(m.authorPage.years, { n: author.yearsExperience })}
                  </span>
                ) : null}
                <span className="author-profile-chip">{SITE_NAME}</span>
              </div>

              <div className="author-profile-actions">
                <LocaleLink to="/contact" className="btn-primary">
                  {m.common.contactUs}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </LocaleLink>
                <LocaleLink to="/about" className="btn-ghost">
                  {t(m.authorPage.aboutSite, { name: SITE_NAME })}
                </LocaleLink>
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
              <h2 className="author-profile-section-title">{m.authorPage.expertise}</h2>
              <ul className="author-profile-expertise-list">
                {author.expertise.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <InternalLinksBlock title={m.authorPage.regions} links={LANDING_LINKS} />
        </div>
      </section>
    </article>
  );
}
