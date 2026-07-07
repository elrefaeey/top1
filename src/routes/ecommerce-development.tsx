import { createFileRoute } from "@tanstack/react-router";
import { SeoLandingTemplate } from "@/components/seo/SeoLandingTemplate";
import { buildLandingPageHead } from "@/lib/seo";
import { getLandingPageByPath } from "@/lib/seo/landing-pages";

const PAGE = getLandingPageByPath("/ecommerce-development")!;

export const Route = createFileRoute("/ecommerce-development")({
  head: () => buildLandingPageHead(PAGE),
  component: () => <SeoLandingTemplate page={PAGE} />,
});
