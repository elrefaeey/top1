import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/seo-qassim")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/seo-qassim", statusCode: 301 });
  },
});
