import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-riyadh")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-riyadh", statusCode: 301 });
  },
});
