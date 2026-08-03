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
import { SITE_NAME } from "@/lib/site-config";
import type { Author } from "@/types/cms";

export { notFoundHead };

export function buildAuthorHead(author: Author) {
  const slug = authorSlug(author);
  const path = `/authors/${slug}`;
  const title = author.metaTitle?.trim() || `${author.name} | ${author.role} | ${SITE_NAME}`;
  const description =
    author.metaDescription?.trim() || stripHtml(author.bio).slice(0, 320);

  return buildPageHead({
    title,
    description,
    path,
    image: author.avatarUrl ?? DEFAULT_OG_IMAGE,
    scripts: [
      jsonLdScript(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "من نحن", path: "/about" },
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
          url: absoluteUrl("/"),
        },
        knowsAbout: author.expertise,
        sameAs: author.linkedinUrl ? [author.linkedinUrl] : undefined,
      }),
    ],
  });
}
