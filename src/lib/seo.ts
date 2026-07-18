import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_PRODUCTION_URL,
  SITE_TWITTER,
  SITE_URL,
  SITE_WHATSAPP_NUMBER,
  resolvePublicSiteUrl,
} from "@/lib/site-config";
import { SITE_SOCIAL_SAME_AS } from "@/lib/site-social";
import type { LandingPageContent } from "@/lib/seo/landing-pages";
import type { BlogPost, CmsPage, FaqItem, PortfolioItem, Service } from "@/types/cms";
import { blogPostSlug, portfolioItemSlug } from "@/lib/cms/admin-utils";
import { stripHtml } from "@/lib/seo/blog-utils";

export const SITE_TAGLINE_EN = "Digital Agency serving Saudi Arabia";

/** مناطق الخدمة — السعودية فقط */
export const SEO_AREAS_SERVED = [{ "@type": "Country", name: "Saudi Arabia" }] as const;

export const SEO_KNOWS_ABOUT = [
  "Web Design",
  "Ecommerce Development",
  "SEO",
  "UI/UX",
  "Digital Marketing",
] as const;

export const DEFAULT_OG_IMAGE = SITE_LOGO_URL;

export const STATIC_PAGE_OG_FALLBACK: Record<keyof typeof STATIC_PAGE_SEO, string> = {
  home: SITE_LOGO_URL,
  about: SITE_LOGO_URL,
  services: SITE_LOGO_URL,
  portfolio: SITE_LOGO_URL,
  blog: SITE_LOGO_URL,
  contact: SITE_LOGO_URL,
};

export type CmsPageHeadFields = Pick<
  CmsPage,
  "metaTitle" | "metaDescription" | "ogImage" | "canonicalUrl" | "noIndex"
>;

export function resolveStaticPageOgImage(
  page: keyof typeof STATIC_PAGE_SEO,
  cms?: CmsPageHeadFields | null,
): string {
  return cms?.ogImage?.trim() || STATIC_PAGE_OG_FALLBACK[page] || DEFAULT_OG_IMAGE;
}

function resolveCanonicalUrl(path: string, cms?: CmsPageHeadFields | null): string {
  const custom = cms?.canonicalUrl?.trim();
  if (custom) {
    try {
      const parsed = new URL(custom);
      if (parsed.protocol === "https:" && parsed.pathname) {
        return parsed.href;
      }
    } catch {
      // fall through
    }
  }
  return absoluteUrl(path);
}

export const STATIC_PAGE_SEO = {
  home: {
    title: "Top1Markting | وكالة رقمية — تصميم مواقع وSEO للسعودية",
    description:
      "Top1Markting وكالة رقمية تخدم السعودية — تصميم مواقع، متاجر إلكترونية، SEO، UI/UX، وتسويق رقمي. حلول رقمية احترافية لنمو أعمالك في الرياض وجدة والدمام.",
  },
  about: {
    title: "من نحن | Top1Markting",
    description:
      "Top1Markting وكالة رقمية ناشئة تخدم السعودية — تصميم مواقع، متاجر إلكترونية، SEO، وتسويق رقمي من الفكرة إلى الإطلاق.",
  },
  services: {
    title: "خدماتنا | تصميم مواقع ومتاجر إلكترونية وSEO | Top1Markting",
    description:
      "استكشف خدمات Top1Markting في تصميم المواقع، تطوير المتاجر الإلكترونية، تحسين محركات البحث، تصميم واجهات المستخدم، والحلول الرقمية.",
  },
  portfolio: {
    title: "أعمالنا | مشاريع تصميم المواقع والمتاجر الإلكترونية | Top1Markting",
    description:
      "شاهد أحدث مشاريع Top1Markting في تصميم المواقع والمتاجر الإلكترونية وتجربة المستخدم والهوية الرقمية.",
  },
  blog: {
    title: "مدونة Top1Markting | تصميم المواقع والتسويق الرقمي وSEO",
    description:
      "اقرأ أحدث المقالات والنصائح حول تصميم المواقع، تحسين محركات البحث، التجارة الإلكترونية، وتجربة المستخدم.",
  },
  contact: {
    title: "تواصل مع Top1Markting",
    description: "تواصل مع فريق Top1Markting للحصول على استشارة مجانية أو بدء مشروعك الإلكتروني.",
  },
} as const;

export type BreadcrumbItem = { name: string; path: string };

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = resolvePublicSiteUrl(SITE_URL || SITE_PRODUCTION_URL).replace(/\/$/, "");
  return `${base}${normalizedPath}`;
}

export function absoluteImageUrl(src: string): string {
  if (!src) return absoluteUrl(SITE_LOGO_URL);
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return absoluteUrl(src);
}

export function jsonLdScript(data: unknown) {
  return { type: "application/ld+json" as const, children: JSON.stringify(data) };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: absoluteImageUrl(SITE_LOGO_URL),
    description: SITE_TAGLINE_EN,
    areaServed: [...SEO_AREAS_SERVED],
    knowsAbout: [...SEO_KNOWS_ABOUT],
    sameAs: [...SITE_SOCIAL_SAME_AS],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE_EN,
    inLanguage: "ar",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: absoluteImageUrl(SITE_LOGO_URL),
    },
  };
}

export function localBusinessSchema(contactEmail = SITE_CONTACT_EMAIL) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#localbusiness"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE_EN,
    telephone: `+${SITE_WHATSAPP_NUMBER}`,
    email: contactEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    areaServed: [...SEO_AREAS_SERVED],
    knowsAbout: [...SEO_KNOWS_ABOUT],
    image: absoluteImageUrl(DEFAULT_OG_IMAGE),
    logo: absoluteImageUrl(SITE_LOGO_URL),
    sameAs: [...SITE_SOCIAL_SAME_AS],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "خدمات Top1Markting",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Design" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ecommerce Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing" } },
      ],
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** تسميات عربية لشرائح المسار — لاستخدام Breadcrumb تلقائي من الرابط */
const PATH_SEGMENT_LABELS: Record<string, string> = {
  about: "من نحن",
  services: "الخدمات",
  portfolio: "أعمالنا",
  blog: "المدونة",
  contact: "تواصل معنا",
  pricing: "الأسعار",
  privacy: "سياسة الخصوصية",
  terms: "الشروط والأحكام",
  cookies: "ملفات تعريف الارتباط",
  "web-design-saudi-arabia": "تصميم مواقع في السعودية",
  "seo-services": "خدمات SEO",
  "ecommerce-development": "تطوير متاجر إلكترونية",
  "digital-marketing": "التسويق الرقمي",
};

function pageTitleForSchema(title: string): string {
  return (
    title
      .replace(new RegExp(`\\s*[|–-]\\s*${SITE_NAME}\\s*$`, "i"), "")
      .replace(new RegExp(`^${SITE_NAME}\\s*[|–-]\\s*`, "i"), "")
      .trim() || title
  );
}

/** يبني مسار التنقل (Breadcrumb) تلقائيًا من رابط الصفحة + العنوان */
export function breadcrumbsFromPath(path: string, pageTitle?: string): BreadcrumbItem[] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const clean = normalized.replace(/\/+$/, "") || "/";
  if (clean === "/") return [{ name: "الرئيسية", path: "/" }];

  const parts = clean.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ name: "الرئيسية", path: "/" }];
  let acc = "";
  parts.forEach((part, index) => {
    acc += `/${part}`;
    const isLast = index === parts.length - 1;
    const label =
      isLast && pageTitle
        ? pageTitleForSchema(pageTitle)
        : PATH_SEGMENT_LABELS[part] || decodeURIComponent(part).replace(/-/g, " ");
    items.push({ name: label, path: acc });
  });
  return items;
}

/** WebPage Schema من عنوان الصفحة والرابط الكانوني */
export function webPageSchema(input: { title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: input.url,
    inLanguage: "ar-SA",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: absoluteImageUrl(SITE_LOGO_URL),
    },
  };
}

function scriptsHaveSchemaType(
  scripts: Array<{ type: string; children: string }>,
  typeName: string,
): boolean {
  return scripts.some((s) => {
    if (typeof s.children !== "string") return false;
    return (
      s.children.includes(`"@type":"${typeName}"`) || s.children.includes(`"@type": "${typeName}"`)
    );
  });
}

export function articleSchema(post: BlogPost, slug: string) {
  const path = `/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: post.featuredImage
      ? absoluteImageUrl(post.featuredImage)
      : absoluteImageUrl(DEFAULT_OG_IMAGE),
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteImageUrl(SITE_LOGO_URL),
      },
    },
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: absoluteUrl(path),
    timeRequired: `PT${post.readTime}M`,
    inLanguage: "ar",
  };
}

export function serviceSchema(service: Service, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription || service.shortDescription || service.description,
    url: absoluteUrl(`/services/${slug}`),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
    areaServed: [...SEO_AREAS_SERVED],
    serviceType: service.title,
    image: service.imageUrl
      ? absoluteImageUrl(service.imageUrl)
      : absoluteImageUrl(DEFAULT_OG_IMAGE),
  };
}

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export type PageHeadInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  scripts?: Array<{ type: string; children: string }>;
  extraLinks?: Array<Record<string, string>>;
};

export function buildPageHead(input: PageHeadInput) {
  const url = input.canonicalUrl ?? absoluteUrl(input.path);
  const image = absoluteImageUrl(input.image ?? DEFAULT_OG_IMAGE);
  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:image", content: image },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "ar_SA" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SITE_TWITTER },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];

  if (input.noIndex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    meta.push({
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
  }

  const links: Array<Record<string, string>> = [
    { rel: "canonical", href: url },
    ...(input.extraLinks ?? []),
  ];

  const scripts = [...(input.scripts ?? [])];

  // Schema تلقائي من العنوان + الرابط الكانوني (لكل الصفحات العامة)
  if (!input.noIndex) {
    if (!scriptsHaveSchemaType(scripts, "WebPage")) {
      scripts.unshift(
        jsonLdScript(
          webPageSchema({
            title: input.title,
            description: input.description,
            url,
          }),
        ),
      );
    }
    if (!scriptsHaveSchemaType(scripts, "BreadcrumbList")) {
      scripts.push(jsonLdScript(breadcrumbSchema(breadcrumbsFromPath(input.path, input.title))));
    }
  }

  return {
    meta,
    links,
    scripts,
  };
}

export function buildStaticPageHead(
  page: keyof typeof STATIC_PAGE_SEO,
  path: string,
  options?: {
    cms?: CmsPageHeadFields | null;
    type?: "website" | "article";
    image?: string;
    scripts?: Array<{ type: string; children: string }>;
    breadcrumbs?: BreadcrumbItem[];
    extraLinks?: Array<Record<string, string>>;
  },
) {
  const seo = STATIC_PAGE_SEO[page];
  const title = options?.cms?.metaTitle?.trim() || seo.title;
  const description = options?.cms?.metaDescription?.trim() || seo.description;
  const scripts = [...(options?.scripts ?? [])];
  if (options?.breadcrumbs?.length) {
    scripts.push(jsonLdScript(breadcrumbSchema(options.breadcrumbs)));
  }
  const image = options?.image ?? resolveStaticPageOgImage(page, options?.cms);
  return buildPageHead({
    title,
    description,
    path,
    type: options?.type,
    image,
    canonicalUrl: resolveCanonicalUrl(path, options?.cms),
    noIndex: options?.cms?.noIndex,
    scripts,
    extraLinks: options?.extraLinks,
  });
}

export function buildBlogPostHead(post: BlogPost, slugParam: string) {
  const slug = blogPostSlug({ slug: post.slug, id: slugParam });
  const path = `/blog/${slug}`;
  const title = post.metaTitle?.trim() || `${post.title} | ${SITE_NAME}`;
  const description = post.metaDescription?.trim() || post.excerpt;
  return buildPageHead({
    title,
    description,
    path,
    type: "article",
    image: post.featuredImage ?? DEFAULT_OG_IMAGE,
    scripts: [
      jsonLdScript(articleSchema(post, slug)),
      jsonLdScript(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "المدونة", path: "/blog" },
          { name: post.title, path },
        ]),
      ),
    ],
  });
}

export function buildServiceHead(
  service: Service,
  slug: string,
  faqs?: Array<{ question: string; answer: string }>,
) {
  const path = `/services/${slug}`;
  const title = service.metaTitle?.trim() || `${service.title} | ${SITE_NAME}`;
  const rawDescription =
    service.metaDescription?.trim() || service.shortDescription || service.description || "";
  const description = stripHtml(rawDescription).slice(0, 320);
  const scripts: Array<{ type: string; children: string }> = [
    jsonLdScript(serviceSchema(service, slug)),
    jsonLdScript(
      breadcrumbSchema([
        { name: "الرئيسية", path: "/" },
        { name: "الخدمات", path: "/services" },
        { name: service.title, path },
      ]),
    ),
  ];
  if (faqs?.length) {
    scripts.push(
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }),
    );
  }
  return buildPageHead({
    title,
    description,
    path,
    type: "website",
    image: service.imageUrl ?? DEFAULT_OG_IMAGE,
    scripts,
  });
}

export function buildPortfolioItemHead(item: PortfolioItem, slugParam: string) {
  const slug = portfolioItemSlug({ slug: item.slug, id: slugParam });
  const path = `/portfolio/${slug}`;
  const title = item.metaTitle?.trim() || `${item.title} | ${SITE_NAME}`;
  const description = item.metaDescription?.trim() || item.description || item.category;
  return buildPageHead({
    title,
    description,
    path,
    type: "website",
    image: item.imageUrl || DEFAULT_OG_IMAGE,
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        ...creativeWorkSchemaForHead(item, path),
      }),
      jsonLdScript(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "أعمالنا", path: "/portfolio" },
          { name: item.title, path },
        ]),
      ),
    ],
  });
}

function creativeWorkSchemaForHead(item: PortfolioItem, path: string) {
  return {
    "@type": "CreativeWork",
    name: item.title,
    description: item.description || item.metaDescription || item.category,
    image: item.imageUrl ? absoluteImageUrl(item.imageUrl) : absoluteImageUrl(DEFAULT_OG_IMAGE),
    url: absoluteUrl(path),
    genre: item.category,
    keywords: item.tags?.length ? item.tags.join(", ") : undefined,
    ...(item.client
      ? {
          creator: {
            "@type": "Organization",
            name: item.client,
          },
        }
      : {}),
  };
}

export function buildLandingPageHead(page: LandingPageContent) {
  const scripts: Array<{ type: string; children: string }> = [
    jsonLdScript(breadcrumbSchema(page.breadcrumbs)),
    jsonLdScript({
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.title,
      description: page.metaDescription,
      url: absoluteUrl(page.path),
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl("/"),
      },
      areaServed: [...SEO_AREAS_SERVED],
    }),
  ];
  if (page.faqs.length) {
    scripts.push(
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }),
    );
  }
  return buildPageHead({
    title: page.metaTitle,
    description: page.metaDescription,
    path: page.path,
    scripts,
  });
}

export function rootJsonLdScripts() {
  return [
    jsonLdScript(organizationSchema()),
    jsonLdScript(websiteSchema()),
    jsonLdScript(localBusinessSchema()),
  ];
}

export function notFoundHead() {
  return buildPageHead({
    title: `الصفحة غير موجودة | ${SITE_NAME}`,
    description: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    path: "/404",
    noIndex: true,
  });
}
