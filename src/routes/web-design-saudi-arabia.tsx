import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-saudi-arabia")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-saudi-arabia", statusCode: 301 });
  },
});
