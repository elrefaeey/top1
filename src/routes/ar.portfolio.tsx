import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/routes/portfolio";
import { loadPortfolioRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildPortfolioListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/ar/portfolio")({
  loader: () => loadPortfolioRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string).endsWith("/portfolio/$slug"))) return {};
    return buildPortfolioListingHead(loaderData ?? { cms: null, portfolio: [] }, "ar");
  },
  component: Portfolio,
});
