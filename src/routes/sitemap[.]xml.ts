import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { loadSitemapEntriesFn } from "@/lib/seo/cms-seo.functions";
import { buildSitemapEntries, renderSitemapXml } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const headers = {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        };
        try {
          const data = await loadSitemapEntriesFn();
          const entries = buildSitemapEntries(data);
          return new Response(renderSitemapXml(entries), { headers });
        } catch (err) {
          console.error("[sitemap] failed to load CMS entries; serving static fallback", err);
          // Never 500 the sitemap — landings + static routes remain crawlable.
          const entries = buildSitemapEntries({
            services: [],
            blog: [],
            portfolio: [],
            authors: [],
          });
          return new Response(renderSitemapXml(entries), { headers });
        }
      },
    },
  },
});
