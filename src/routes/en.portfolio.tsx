import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/routes/portfolio";
import { loadPortfolioRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { clientNetworkFallback } from "@/lib/router/client-network-fallback";
import { buildPortfolioListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/en/portfolio")({
  loader: () => clientNetworkFallback(() => loadPortfolioRouteSeoFn()),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string).endsWith("/portfolio/$slug"))) return {};
    return buildPortfolioListingHead(loaderData ?? { cms: null, portfolio: [] }, "en");
  },
  component: Portfolio,
});
