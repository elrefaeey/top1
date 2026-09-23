import {
  absoluteImageUrl,
  absoluteUrl,
  buildPageHead,
  breadcrumbSchema,
  DEFAULT_OG_IMAGE,
  jsonLdScript,
  notFoundHead,
} from "@/lib/seo";
import { authorSlug } from "@/lib/cms/admin-utils";
import { stripHtml } from "@/lib/seo/blog-utils";
import { withLocalePrefix } from "@/lib/i18n/locale-path";
import { getMessages } from "@/lib/i18n/messages";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { SITE_NAME } from "@/lib/site-config";
import type { Author } from "@/types/cms";

export { notFoundHead };

export function buildAuthorHead(author: Author, locale: Locale = DEFAULT_LOCALE) {
  const slug = authorSlug(author);
  const path = withLocalePrefix(locale, `/authors/${slug}`);
  const title = author.metaTitle?.trim() || `${author.name} | ${author.role} | ${SITE_NAME}`;
  const description =
    author.metaDescription?.trim() || stripHtml(author.bio).slice(0, 320);
  const m = getMessages(locale);

  return buildPageHead({
    title,
    description,
    path,
    image: author.avatarUrl ?? DEFAULT_OG_IMAGE,
    locale,
    scripts: [
      jsonLdScript(
        breadcrumbSchema([
          { name: m.nav.home, path: withLocalePrefix(locale, "/") },
          { name: m.nav.about, path: withLocalePrefix(locale, "/about") },
          { name: author.name, path },
        ]),
      ),
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        jobTitle: author.role,
        description,
        url: absoluteUrl(path),
        image: author.avatarUrl ? absoluteImageUrl(author.avatarUrl) : undefined,
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
          url: absoluteUrl(withLocalePrefix(locale, "/")),
        },
        knowsAbout: author.expertise,
        sameAs: author.linkedinUrl ? [author.linkedinUrl] : undefined,
        inLanguage: locale === "en" ? "en" : "ar-SA",
      }),
    ],
  });
}
