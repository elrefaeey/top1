import type { BlogPost, PortfolioItem } from "@/types/cms";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";

export type InternalLink = { label: string; href: string };

/**
 * Capability hubs — prefer money landings for commercial intent (anti-cannibalization).
 * `/services/*` remains for brand/capability detail; clusters link landings as primary CTAs.
 */
export const SERVICE_LINKS: InternalLink[] = [
  { label: "تصميم المواقع", href: "/web-design-saudi-arabia" },
  { label: "المتاجر الإلكترونية", href: "/ecommerce-development" },
  { label: "تحسين SEO", href: "/seo-services" },
  { label: "تصميم UI/UX", href: "/services/ui-ux" },
];

export const LANDING_LINKS: InternalLink[] = [
  { label: "تصميم مواقع في السعودية", href: "/web-design-saudi-arabia" },
  { label: "خدمات SEO", href: "/seo-services" },
  { label: "تطوير متاجر إلكترونية", href: "/ecommerce-development" },
  { label: "تسويق رقمي", href: "/digital-marketing" },
];

export const LOCATION_LINKS: InternalLink[] = [
  { label: "تصميم مواقع الرياض", href: "/web-design-riyadh" },
  { label: "تصميم مواقع جدة", href: "/web-design-jeddah" },
  { label: "تصميم مواقع الدمام", href: "/web-design-dammam" },
  { label: "تصميم مواقع الخبر", href: "/web-design-khobar" },
  { label: "تصميم مواقع القصيم", href: "/web-design-qassim" },
  { label: "تصميم مواقع بريدة", href: "/web-design-buraidah" },
  { label: "تصميم مواقع السعودية", href: "/web-design-saudi-arabia" },
  { label: "تصميم مواقع دبي", href: "/web-design-dubai" },
  { label: "تصميم مواقع أبوظبي", href: "/web-design-abu-dhabi" },
  { label: "تصميم مواقع الشارقة", href: "/web-design-sharjah" },
];

export const SEO_LOCATION_LINKS: InternalLink[] = [
  { label: "خدمات SEO الرياض", href: "/seo-riyadh" },
  { label: "خدمات SEO القصيم", href: "/seo-qassim" },
  { label: "خدمات SEO بريدة", href: "/seo-buraidah" },
  { label: "خدمات SEO دبي", href: "/seo-dubai" },
  { label: "خدمات SEO أبوظبي", href: "/seo-abu-dhabi" },
  { label: "خدمات SEO السعودية", href: "/seo-services" },
];

/** Footer mix: national + major cities SA/AE + SEO + proof */
export const FOOTER_SEO_LINKS: InternalLink[] = [
  { label: "تصميم مواقع السعودية", href: "/web-design-saudi-arabia" },
  { label: "تصميم مواقع الرياض", href: "/web-design-riyadh" },
  { label: "تصميم مواقع جدة", href: "/web-design-jeddah" },
  { label: "تصميم مواقع دبي", href: "/web-design-dubai" },
  { label: "تصميم مواقع أبوظبي", href: "/web-design-abu-dhabi" },
  { label: "خدمات SEO", href: "/seo-services" },
  { label: "خدمات SEO دبي", href: "/seo-dubai" },
  { label: "خدمات SEO أبوظبي", href: "/seo-abu-dhabi" },
  { label: "متاجر إلكترونية", href: "/ecommerce-development" },
];

const CATEGORY_SERVICE_MAP: Record<string, string> = {
  "تصميم مواقع": "/web-design-saudi-arabia",
  مواقع: "/web-design-saudi-arabia",
  متجر: "/ecommerce-development",
  "تجارة إلكترونية": "/ecommerce-development",
  SEO: "/seo-services",
  UI: "/services/ui-ux",
  UX: "/services/ui-ux",
  تسويق: "/digital-marketing",
  هوية: "/services/ui-ux",
};

const TAG_SERVICE_MAP: Record<string, string> = {
  seo: "/seo-services",
  "web-design": "/web-design-saudi-arabia",
  "ui-ux": "/services/ui-ux",
  ecommerce: "/ecommerce-development",
  marketing: "/digital-marketing",
};

export function serviceLinksForPortfolio(item: PortfolioItem): InternalLink[] {
  const links: InternalLink[] = [];
  const haystack = `${item.category} ${item.tags.join(" ")} ${item.title}`.toLowerCase();

  for (const [key, href] of Object.entries(CATEGORY_SERVICE_MAP)) {
    if (haystack.includes(key.toLowerCase()) && !links.some((l) => l.href === href)) {
      const label = SERVICE_LINKS.find((s) => s.href === href)?.label ?? key;
      links.push({ label, href });
    }
  }

  return links.slice(0, 2);
}

export function serviceLinksForBlogPost(post: BlogPost): InternalLink[] {
  const links: InternalLink[] = [];
  const haystack = `${post.category} ${post.tags.join(" ")} ${post.title}`.toLowerCase();

  for (const [key, href] of Object.entries(TAG_SERVICE_MAP)) {
    if (haystack.includes(key.toLowerCase()) && !links.some((l) => l.href === href)) {
      const label = SERVICE_LINKS.find((s) => s.href === href)?.label ?? key;
      links.push({ label, href });
    }
  }

  for (const [key, href] of Object.entries(CATEGORY_SERVICE_MAP)) {
    if (haystack.includes(key.toLowerCase()) && !links.some((l) => l.href === href)) {
      const label = SERVICE_LINKS.find((s) => s.href === href)?.label ?? key;
      links.push({ label, href });
    }
  }

  return links.slice(0, 3);
}

export function footerInternalLinks(): InternalLink[] {
  return [
    { label: "أعمالنا", href: "/portfolio" },
    { label: "تواصل معنا", href: "/contact" },
    ...SERVICE_LINKS.slice(0, 3),
    ...LOCATION_LINKS.slice(0, 3),
    ...LANDING_LINKS.slice(0, 2),
  ];
}

export function servicesPageInternalLinks(
  services: Array<{ slug: string; title: string }>,
): InternalLink[] {
  const links: InternalLink[] = services.map((service) => ({
    label: service.title,
    href: `/services/${preferredServiceSlug(service.slug)}`,
  }));

  for (const link of [
    ...LANDING_LINKS,
    ...LOCATION_LINKS.slice(0, 6),
    { label: "المدونة", href: "/blog" },
    { label: "أعمالنا", href: "/portfolio" },
    { label: "تواصل معنا", href: "/contact" },
  ]) {
    if (!links.some((item) => item.href === link.href)) {
      links.push(link);
    }
  }

  return links;
}

export function portfolioPageInternalLinks(): InternalLink[] {
  return [
    ...SERVICE_LINKS.slice(0, 3),
    ...LANDING_LINKS.slice(0, 3),
    { label: "المدونة", href: "/blog" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}

export function blogListingInternalLinks(_posts: BlogPost[]): InternalLink[] {
  return [
    ...SERVICE_LINKS,
    ...LANDING_LINKS.slice(0, 3),
    { label: "أعمالنا", href: "/portfolio" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}
