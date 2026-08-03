import type { InternalLink } from "@/lib/seo/internal-links";
import { LOCATION_LINKS, SEO_LOCATION_LINKS } from "@/lib/seo/internal-links";

/**
 * Money / geo landings that should win commercial+location intent.
 * Service detail pages stay as brand/capability hubs and link here.
 */
export const SERVICE_MONEY_PAGE: Record<string, string> = {
  "web-design": "/web-design-saudi-arabia",
  seo: "/seo-services",
  "digital-solutions": "/digital-marketing",
  "web-apps": "/ecommerce-development",
};

export function moneyPageForService(slug: string): string | undefined {
  return SERVICE_MONEY_PAGE[slug];
}

/** City / geo cluster links for a service capability page (anti-cannibalization). */
export function serviceLocationClusterLinks(serviceSlug: string): InternalLink[] {
  if (serviceSlug === "web-design") {
    return [
      { label: "تصميم مواقع السعودية (صفحة رئيسية)", href: "/web-design-saudi-arabia" },
      ...LOCATION_LINKS,
    ];
  }
  if (serviceSlug === "seo") {
    return [
      { label: "خدمات SEO السعودية (صفحة رئيسية)", href: "/seo-services" },
      ...SEO_LOCATION_LINKS,
    ];
  }
  if (serviceSlug === "web-apps") {
    return [
      { label: "تطوير متاجر إلكترونية", href: "/ecommerce-development" },
      { label: "تصميم مواقع السعودية", href: "/web-design-saudi-arabia" },
      { label: "تواصل معنا", href: "/contact" },
    ];
  }
  if (serviceSlug === "digital-solutions") {
    return [
      { label: "تسويق رقمي", href: "/digital-marketing" },
      { label: "خدمات SEO", href: "/seo-services" },
      { label: "تواصل معنا", href: "/contact" },
    ];
  }
  return [
    { label: "تصميم مواقع السعودية", href: "/web-design-saudi-arabia" },
    { label: "خدمات SEO", href: "/seo-services" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}
