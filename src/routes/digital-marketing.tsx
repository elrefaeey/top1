import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { buildLandingPageHead } from "@/lib/seo";
import { getLandingPageByPath } from "@/lib/seo/landing-pages";

const PAGE = getLandingPageByPath("/digital-marketing")!;

export const Route = createFileRoute("/digital-marketing")({
  head: () => buildLandingPageHead(PAGE),
  component: () => <SeoLandingTemplate page={PAGE} />,
});
