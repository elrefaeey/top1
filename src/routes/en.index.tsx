import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/routes/index";
import { absoluteImageUrl, buildStaticPageHead, resolveStaticPageOgImage } from "@/lib/seo";
import { loadHomeHeroSettingsFn, loadPublishedPageSeoFn } from "@/lib/seo/cms-seo.functions";

export const Route = createFileRoute("/en/")({
  loader: async () => {
    const [cms, hero] = await Promise.all([
      loadPublishedPageSeoFn({ data: { slug: "home" } }),
      loadHomeHeroSettingsFn(),
    ]);
    return { cms, hero };
  },
  head: ({ loaderData }) => {
    const cms = loaderData?.cms;
    const heroUrl = loaderData?.hero?.heroImageUrl?.trim() || "";
    const image = resolveStaticPageOgImage("home", cms);
    const preloadHref =
      heroUrl && !heroUrl.startsWith("data:") ? absoluteImageUrl(heroUrl) : absoluteImageUrl(image);
    const extraLinks =
      preloadHref && !preloadHref.startsWith("data:")
        ? [{ rel: "preload", as: "image", href: preloadHref, fetchPriority: "high" }]
        : undefined;
    return buildStaticPageHead("home", "/", {
      cms,
      image: heroUrl && !heroUrl.startsWith("data:") ? heroUrl : image,
      extraLinks,
      locale: "en",
    });
  },
  component: Home,
});
