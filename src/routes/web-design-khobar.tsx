import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-khobar")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-khobar", statusCode: 301 });
  },
});
