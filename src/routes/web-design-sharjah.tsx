import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-sharjah")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-sharjah", statusCode: 301 });
  },
});
