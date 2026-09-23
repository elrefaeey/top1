import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/seo-abu-dhabi")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/seo-abu-dhabi", statusCode: 301 });
  },
});
