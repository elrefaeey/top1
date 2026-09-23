import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/seo-buraidah")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/seo-buraidah", statusCode: 301 });
  },
});
