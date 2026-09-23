import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/digital-marketing")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/digital-marketing", statusCode: 301 });
  },
});
