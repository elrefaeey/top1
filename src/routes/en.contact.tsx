import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/routes/contact";
import { loadContactRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { clientNetworkFallback } from "@/lib/router/client-network-fallback";
import { buildContactPageHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/en/contact")({
  loader: () => clientNetworkFallback(() => loadContactRouteSeoFn()),
  head: ({ loaderData }) =>
    buildContactPageHead(loaderData ?? { cms: null, faqs: [] }, "en"),
  component: Contact,
});
