import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/routes/about";
import { buildStaticPageHead } from "@/lib/seo";
import { loadPublishedPageSeoFn } from "@/lib/seo/cms-seo.functions";
import { getMessages } from "@/lib/i18n/messages";
import { withLocalePrefix } from "@/lib/i18n/locale-path";

export const Route = createFileRoute("/ar/about")({
  loader: () => loadPublishedPageSeoFn({ data: { slug: "about" } }),
  head: ({ loaderData }) => {
    const m = getMessages("ar");
    return buildStaticPageHead("about", "/about", {
      cms: loaderData,
      locale: "ar",
      breadcrumbs: [
        { name: m.nav.home, path: withLocalePrefix("ar", "/") },
        { name: m.nav.about, path: withLocalePrefix("ar", "/about") },
      ],
    });
  },
  component: About,
});
