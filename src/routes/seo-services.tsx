import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/seo-services")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/seo-services", statusCode: 301 });
  },
});
