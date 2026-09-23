import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { Post } from "@/routes/blog.$slug";
import { blogPostSlug } from "@/lib/cms/admin-utils";
import { loadBlogPostForSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildBlogPostHead, notFoundHead } from "@/lib/seo";

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/ar/blog/$slug")({
  loader: async ({ params }) => {
    const post = await loadBlogPostForSeoFn({ data: { slug: params.slug } });
    if (!post) throw notFound({ headers: NOINDEX_HEADERS });
    const canonical = blogPostSlug(post);
    if (canonical && canonical !== params.slug) {
      throw redirect({
        to: "/ar/blog/$slug",
        params: { slug: canonical },
        statusCode: 301,
        replace: true,
      });
    }
    return { post, locale: "ar" as const };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData?.post) return notFoundHead();
    return buildBlogPostHead(loaderData.post, params.slug, "ar");
  },
  component: Post,
});
