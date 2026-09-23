import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/seo-riyadh")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/seo-riyadh", statusCode: 301 });
  },
});
