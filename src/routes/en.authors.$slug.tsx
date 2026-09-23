import { createFileRoute, notFound } from "@tanstack/react-router";
import { AuthorProfile } from "@/routes/authors.$slug";
import { loadAuthorForSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildAuthorHead, notFoundHead } from "@/lib/seo/authority-head";
import { localizeAuthorProfile } from "@/lib/i18n/localize-cms";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/en/authors/$slug")({
  loader: async ({ params }) => {
    const author = await loadAuthorForSeoFn({ data: { slug: params.slug } });
    if (!author) throw notFound({ headers: NOINDEX_HEADERS });
    return { author };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.author) return notFoundHead();
    const localized = localizeAuthorProfile(loaderData.author, "en");
    return buildAuthorHead(localized, "en");
  },
  component: AuthorProfile,
});
