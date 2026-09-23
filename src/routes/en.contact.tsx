import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/routes/contact";
import { loadContactRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildContactPageHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/en/contact")({
  loader: () => loadContactRouteSeoFn(),
  head: ({ loaderData }) =>
    buildContactPageHead(loaderData ?? { cms: null, faqs: [] }, "en"),
  component: Contact,
});
