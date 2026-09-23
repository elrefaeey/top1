import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "@/routes/blog";
import { loadBlogRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildBlogListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/en/blog")({
  loader: () => loadBlogRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string).endsWith("/blog/$slug"))) return {};
    return buildBlogListingHead(loaderData ?? { cms: null, posts: [] }, "en");
  },
  component: Blog,
});
