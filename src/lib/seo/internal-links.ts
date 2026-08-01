import type { BlogPost, PortfolioItem } from "@/types/cms";

export type InternalLink = { label: string; href: string };

/** Real service/landing paths — must match fallback or resolve via slug aliases */
export const SERVICE_LINKS: InternalLink[] = [
  { label: "تصميم المواقع", href: "/services/web-design" },
  { label: "المتاجر الإلكترونية", href: "/ecommerce-development" },
  { label: "تحسين SEO", href: "/services/seo" },
  { label: "تصميم UI/UX", href: "/services/ui-ux" },
];

export const LANDING_LINKS: InternalLink[] = [
  { label: "تصميم مواقع في السعودية", href: "/web-design-saudi-arabia" },
  { label: "خدمات SEO", href: "/seo-services" },
  { label: "تطوير متاجر إلكترونية", href: "/ecommerce-development" },
  { label: "تسويق رقمي", href: "/digital-marketing" },
];

const CATEGORY_SERVICE_MAP: Record<string, string> = {
  "تصميم مواقع": "/services/web-design",
  مواقع: "/services/web-design",
  متجر: "/ecommerce-development",
  "تجارة إلكترونية": "/ecommerce-development",
  SEO: "/services/seo",
  UI: "/services/ui-ux",
  UX: "/services/ui-ux",
  تسويق: "/digital-marketing",
  هوية: "/services/ui-ux",
};

const TAG_SERVICE_MAP: Record<string, string> = {
  seo: "/services/seo",
  "web-design": "/services/web-design",
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
    ...LANDING_LINKS.slice(0, 2),
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
    ...LANDING_LINKS,
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
    ...LANDING_LINKS.slice(0, 2),
    { label: "المدونة", href: "/blog" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}

export function blogListingInternalLinks(_posts: BlogPost[]): InternalLink[] {
  return [
    ...SERVICE_LINKS,
    ...LANDING_LINKS.slice(0, 2),
    { label: "أعمالنا", href: "/portfolio" },
    { label: "تواصل معنا", href: "/contact" },
  ];
}
