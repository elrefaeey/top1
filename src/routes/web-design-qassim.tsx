import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-qassim")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-qassim", statusCode: 301 });
  },
});
