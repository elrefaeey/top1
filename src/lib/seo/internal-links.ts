import type { BlogPost, PortfolioItem } from "@/types/cms";

export type InternalLink = { label: string; href: string };

export const SERVICE_LINKS: InternalLink[] = [
  { label: "تصميم المواقع", href: "/services/web-design-development" },
  { label: "المتاجر الإلكترونية", href: "/services/ecommerce-development" },
  { label: "تحسين SEO", href: "/services/seo-optimization" },
  { label: "تصميم UI/UX", href: "/services/ui-ux-design" },
];

export const LANDING_LINKS: InternalLink[] = [
  { label: "تصميم مواقع في السعودية", href: "/web-design-saudi-arabia" },
  { label: "خدمات SEO", href: "/seo-services" },
  { label: "تطوير متاجر إلكترونية", href: "/ecommerce-development" },
  { label: "تسويق رقمي", href: "/digital-marketing" },
];

const CATEGORY_SERVICE_MAP: Record<string, string> = {
  "تصميم مواقع": "/services/web-design-development",
  مواقع: "/services/web-design-development",
  متجر: "/services/ecommerce-development",
  "تجارة إلكترونية": "/services/ecommerce-development",
  SEO: "/services/seo-optimization",
  UI: "/services/ui-ux-design",
  UX: "/services/ui-ux-design",
  تسويق: "/services/seo-optimization",
  هوية: "/services/ui-ux-design",
};

const TAG_SERVICE_MAP: Record<string, string> = {
  seo: "/services/seo-optimization",
  "web-design": "/services/web-design-development",
  "ui-ux": "/services/ui-ux-design",
  ecommerce: "/services/ecommerce-development",
  marketing: "/services/seo-optimization",
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
  ];
}

export function servicesPageInternalLinks(
  services: Array<{ slug: string; title: string }>,
): InternalLink[] {
  const links: InternalLink[] = services.map((service) => ({
    label: service.title,
    href: `/services/${service.slug}`,
  }));

  for (const link of [
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
    { label: "المدونة", href: "/blog" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}

export function blogListingInternalLinks(_posts: BlogPost[]): InternalLink[] {
  return [
    ...SERVICE_LINKS,
    { label: "أعمالنا", href: "/portfolio" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}
