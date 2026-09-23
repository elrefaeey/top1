import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/seo-dubai")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/seo-dubai", statusCode: 301 });
  },
});
