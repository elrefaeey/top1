import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { buildLandingPageHead } from "@/lib/seo";
import { getLandingPageByPath } from "@/lib/seo/landing-pages";

const PAGE = getLandingPageByPath("/web-design-dammam")!;

export const Route = createFileRoute("/web-design-dammam")({
  head: () => buildLandingPageHead(PAGE),
  component: () => <SeoLandingTemplate page={PAGE} />,
});
