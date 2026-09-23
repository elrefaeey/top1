import { createFileRoute, notFound } from "@tanstack/react-router";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { buildLandingPageHead, notFoundHead } from "@/lib/seo";
import { getLandingPageByPath } from "@/lib/seo/landing-pages";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/en/$")({
  loader: ({ params }) => {
    const splat = ((params as { _splat?: string })._splat ?? (params as { "*": string })["*"] ?? "").replace(
      /^\/+|\/+$/g,
      "",
    );
    if (!splat) throw notFound({ headers: NOINDEX_HEADERS });
    const arabicPath = `/${splat}`;
    const page = getLandingPageByPath(arabicPath);
    if (!page) throw notFound({ headers: NOINDEX_HEADERS });
    return { page };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.page) return notFoundHead();
    return buildLandingPageHead(loaderData.page, "en");
  },
  component: EnLanding,
});

function EnLanding() {
  const { page } = Route.useLoaderData();
  return <SeoLandingTemplate page={page} />;
}
