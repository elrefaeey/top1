import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/routes/services";
import { loadServicesRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildServicesListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/en/services")({
  loader: () => loadServicesRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string).endsWith("/services/$slug"))) return {};
    return buildServicesListingHead(loaderData ?? { cms: null, services: [], faqs: [] }, "en");
  },
  component: Services,
});
