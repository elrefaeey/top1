import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/web-design-buraidah")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/web-design-buraidah", statusCode: 301 });
  },
});
