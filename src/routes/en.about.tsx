import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/routes/about";
import { buildStaticPageHead } from "@/lib/seo";
import { loadPublishedPageSeoFn } from "@/lib/seo/cms-seo.functions";
import { clientNetworkFallback } from "@/lib/router/client-network-fallback";
import { getMessages } from "@/lib/i18n/messages";
import { withLocalePrefix } from "@/lib/i18n/locale-path";

export const Route = createFileRoute("/en/about")({
  loader: () => clientNetworkFallback(() => loadPublishedPageSeoFn({ data: { slug: "about" } })),
  head: ({ loaderData }) => {
    const m = getMessages("en");
    return buildStaticPageHead("about", "/about", {
      cms: loaderData,
      locale: "en",
      breadcrumbs: [
        { name: m.nav.home, path: withLocalePrefix("en", "/") },
        { name: m.nav.about, path: withLocalePrefix("en", "/about") },
      ],
    });
  },
  component: About,
});
