import { createFileRoute, notFound } from "@tanstack/react-router";
import { notFoundHead } from "@/lib/seo";

/** Catch-all for unknown paths — real not-found + noindex (avoids soft-404 indexing). */
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw notFound({
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  },
  head: () => notFoundHead(),
});
