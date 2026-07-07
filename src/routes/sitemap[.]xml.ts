import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { loadSitemapEntries } from "@/lib/seo/cms-loaders";
import { buildSitemapEntries, renderSitemapXml } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const data = await loadSitemapEntries();
        const entries = buildSitemapEntries(data);
        const xml = renderSitemapXml(entries);
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
