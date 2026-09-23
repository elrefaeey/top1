import { createFileRoute, redirect } from "@tanstack/react-router";

/** Legacy unprefixed URL → Arabic locale path. */
export const Route = createFileRoute("/ecommerce-development")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/ecommerce-development", statusCode: 301 });
  },
});
