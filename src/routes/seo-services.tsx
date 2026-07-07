import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { buildLandingPageHead } from "@/lib/seo";
import { getLandingPageByPath } from "@/lib/seo/landing-pages";

const PAGE = getLandingPageByPath("/seo-services")!;

export const Route = createFileRoute("/seo-services")({
  head: () => buildLandingPageHead(PAGE),
  component: () => <SeoLandingTemplate page={PAGE} />,
});
