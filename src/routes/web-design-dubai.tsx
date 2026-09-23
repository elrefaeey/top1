import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-dubai")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-dubai", statusCode: 301 });
  },
});
