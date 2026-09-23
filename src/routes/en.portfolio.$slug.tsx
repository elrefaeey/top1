import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { PortfolioDetail } from "@/routes/portfolio.$slug";
import { portfolioItemSlug } from "@/lib/cms/admin-utils";
import { loadPortfolioItemForSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildPortfolioItemHead, notFoundHead } from "@/lib/seo";
import { localizePortfolio } from "@/lib/i18n/localize-cms";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/en/portfolio/$slug")({
  loader: async ({ params }) => {
    const item = await loadPortfolioItemForSeoFn({ data: { slug: params.slug } });
    if (!item) throw notFound({ headers: NOINDEX_HEADERS });
    const canonical = portfolioItemSlug(item);
    if (canonical && canonical !== params.slug) {
      throw redirect({
        to: "/en/portfolio/$slug",
        params: { slug: canonical },
        statusCode: 301,
        replace: true,
      });
    }
    return { item };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData?.item) return notFoundHead();
    const localized = localizePortfolio(loaderData.item, "en");
    return buildPortfolioItemHead(localized, params.slug, "en");
  },
  component: PortfolioDetail,
});
