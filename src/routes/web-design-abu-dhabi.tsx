import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-abu-dhabi")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-abu-dhabi", statusCode: 301 });
  },
});
