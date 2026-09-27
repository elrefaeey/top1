import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { ServiceDetail } from "@/routes/services.$slug";
import { loadServiceForSeoFn } from "@/lib/seo/cms-seo.functions";
import { clientNetworkFallback } from "@/lib/router/client-network-fallback";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import { getServiceSeoBlock } from "@/lib/seo/service-content";
import { buildServiceHead, notFoundHead } from "@/lib/seo";
import { localizeService } from "@/lib/i18n/localize-cms";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/en/services/$slug")({
  loader: ({ params }) =>
    clientNetworkFallback(async () => {
      const service = await loadServiceForSeoFn({ data: { slug: params.slug } });
      if (!service) throw notFound({ headers: NOINDEX_HEADERS });
      const preferred = preferredServiceSlug(service.slug || params.slug);
      if (params.slug !== preferred) {
        throw redirect({
          to: "/en/services/$slug",
          params: { slug: preferred },
          statusCode: 301,
          replace: true,
        });
      }
      return { service };
    }),
  head: ({ loaderData, params }) => {
    if (!loaderData?.service) return notFoundHead();
    const preferred = preferredServiceSlug(params.slug);
    const seoBlock = getServiceSeoBlock(preferred);
    const localized = localizeService(loaderData.service, "en");
    return buildServiceHead(localized, preferred, seoBlock?.faqs, "en");
  },
  component: ServiceDetail,
});
