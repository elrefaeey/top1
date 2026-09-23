import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-jeddah")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-jeddah", statusCode: 301 });
  },
});
