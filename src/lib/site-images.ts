import { SITE_NAME } from "@/lib/site-config";

/** Curated stock / local imagery — CMS uploads override these in production. */

function unsplash(photoId: string, width = 1200) {
  return `https://images.unsplash.com/${photoId}?auto=format&fm=webp&fit=crop&w=${width}&q=75`;
}

export const siteImages = {
  hero: {
    main: unsplash("photo-1460925895917-afe12b2b6d0e", 1200),
    mainAlt: `فريق ${SITE_NAME} يتعاون على بناء منتج رقمي`,
  },
  about: {
    /** Public path kept stable for SEO/cache; filename is about-team.png. */
    studio: "/about-team.png",
    studioAlt: `استوديو ${SITE_NAME} — تصميم مواقع وتحليلات رقمية`,
  },
  contact: {
    sideAlt: `تواصل مع فريق ${SITE_NAME}`,
  },
  services: {
    "web-design": unsplash("photo-1547658719-da2b511691dd", 900),
    "web-apps": unsplash("photo-1555066931-4365d14bab8c", 900),
    seo: unsplash("photo-1432888622747-4ebee778346a", 900),
    "ui-ux": unsplash("photo-1561070791-2526d30994b5", 900),
    "digital-solutions": unsplash("photo-1551288049-bebda4e38f71", 900),
    default: unsplash("photo-1517694712202-14dd9538aa97", 900),
  },
  blog: {
    "lighthouse-99-by-default": unsplash("photo-1467232004584-a241de8bcf5d", 900),
    "saas-seo-playbook-2026": unsplash("photo-1432888622747-4ebee778346a", 900),
    "premium-microinteractions": unsplash("photo-1561070791-2526d30994b5", 900),
    "design-system-foundations": unsplash("photo-1558655146-d09347e92766", 900),
    "shipping-fast-without-debt": unsplash("photo-1517694712202-14dd9538aa97", 900),
    "from-figma-to-production": unsplash("photo-1558655146-364adaf76fcc", 900),
    /** Brand blog cover — public/blog-cover.png */
    default: "/blog-cover.png",
    defaultAlt: `مدونة ${SITE_NAME} — تصميم مواقع وSEO وتسويق رقمي`,
  },
} as const;

export function serviceImage(slug: string) {
  return (
    siteImages.services[slug as keyof typeof siteImages.services] ?? siteImages.services.default
  );
}

export function blogImage(slug: string) {
  return siteImages.blog[slug as keyof typeof siteImages.blog] ?? siteImages.blog.default;
}
