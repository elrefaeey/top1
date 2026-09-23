import {
  SITE_CONTACT_EMAIL,
  SITE_CONTACT_PHONE,
  SITE_CONTACT_PHONE_SA,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_PRODUCTION_URL,
  SITE_TWITTER,
  SITE_URL,
  SITE_WHATSAPP_NUMBER,
  SITE_WHATSAPP_NUMBER_AE,
  resolvePublicSiteUrl,
} from "@/lib/site-config";
import { SITE_SOCIAL_SAME_AS } from "@/lib/site-social";
import type { LandingPageContent } from "@/lib/seo/landing-pages";
import type { BlogPost, CmsPage, FaqItem, PortfolioItem, Service } from "@/types/cms";
import { blogPostSlug, flattenTitle, portfolioItemSlug } from "@/lib/cms/admin-utils";
import { stripHtml } from "@/lib/seo/blog-utils";
import { normalizeIntlPhone } from "@/lib/phone";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locale";
import { hreflangPair, stripLocalePrefix, withLocalePrefix } from "@/lib/i18n/locale-path";
import { localizeBlogPost, localizeLanding } from "@/lib/i18n/localize-cms";
import { getMessages } from "@/lib/i18n/messages";

export const SITE_TAGLINE_EN = "Digital agency serving Saudi Arabia and the United Arab Emirates";

/** مناطق الخدمة — السعودية والإمارات + مدن رئيسية */
export const SEO_AREAS_SERVED = [
  { "@type": "Country", name: "Saudi Arabia" },
  { "@type": "Country", name: "United Arab Emirates" },
  { "@type": "City", name: "Riyadh" },
  { "@type": "City", name: "Jeddah" },
  { "@type": "City", name: "Dammam" },
  { "@type": "City", name: "Khobar" },
  { "@type": "City", name: "Dubai" },
  { "@type": "City", name: "Abu Dhabi" },
  { "@type": "City", name: "Sharjah" },
  { "@type": "AdministrativeArea", name: "Al-Qassim" },
  { "@type": "City", name: "Buraidah" },
] as const;

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
  blog: "/blog-cover.png",
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
    title: "Top1Markting | وكالة رقمية — السعودية والإمارات",
    description:
      "Top1Markting وكالة رقمية تخدم السعودية والإمارات — تصميم مواقع، متاجر إلكترونية، SEO، UI/UX، وتسويق رقمي. حلول احترافية لنمو أعمالك في الرياض ودبي وأبوظبي والقصيم.",
  },
  about: {
    title: "من نحن | Top1Markting",
    description:
      "تعرف على فريق Top1Markting وخبرتنا في السعودية والإمارات — تصميم مواقع، SEO، وتسويق رقمي مع ثقة E-E-A-T من الفكرة إلى الإطلاق.",
  },
  services: {
    title: "خدماتنا | تصميم مواقع ومتاجر إلكترونية وSEO | Top1Markting",
    description:
      "استكشف خدمات Top1Markting في تصميم المواقع، تطوير المتاجر الإلكترونية، تحسين محركات البحث، تصميم واجهات المستخدم، والحلول الرقمية للشركات في السعودية والإمارات.",
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
    title: "تواصل مع Top1Markting | السعودية والإمارات",
    description:
      "تواصل مع Top1Markting — استشارة مجانية لتصميم المواقع والمتاجر الإلكترونية وSEO والتسويق الرقمي في السعودية والإمارات.",
  },
} as const;

export const STATIC_PAGE_SEO_EN: Record<keyof typeof STATIC_PAGE_SEO, { title: string; description: string }> = {
  home: {
    title: "Top1Markting | Digital Agency — Saudi Arabia & UAE",
    description:
      "Top1Markting is a digital agency serving Saudi Arabia and the UAE — web design, ecommerce, SEO, UI/UX, and digital marketing for growth in Riyadh, Dubai, Abu Dhabi, and Qassim.",
  },
  about: {
    title: "About Us | Top1Markting",
    description:
      "Meet the Top1Markting team and our experience across Saudi Arabia and the UAE — web design, SEO, and digital marketing with E-E-A-T trust from idea to launch.",
  },
  services: {
    title: "Our Services | Web Design, Ecommerce & SEO | Top1Markting",
    description:
      "Explore Top1Markting services in web design, ecommerce development, search engine optimization, UI/UX, and digital solutions for businesses in Saudi Arabia and the UAE.",
  },
  portfolio: {
    title: "Our Work | Web & Ecommerce Projects | Top1Markting",
    description:
      "See recent Top1Markting projects in website design, ecommerce, UX, and digital brand presence.",
  },
  blog: {
    title: "Top1Markting Blog | Web Design, Digital Marketing & SEO",
    description:
      "Read the latest articles and tips on web design, SEO, ecommerce, and user experience.",
  },
  contact: {
    title: "Contact Top1Markting | Saudi Arabia & UAE",
    description:
      "Contact Top1Markting — a free consult for web design, ecommerce, SEO, and digital marketing in Saudi Arabia and the UAE.",
  },
};

/** Reciprocal hreflang for Arabic (`/ar`) and English (`/en`). */
export function hreflangLinksForPath(path: string): Array<Record<string, string>> {
  const pair = hreflangPair(path);
  return [
    { rel: "alternate", hrefLang: "ar", href: absoluteUrl(pair.ar) },
    { rel: "alternate", hrefLang: "en", href: absoluteUrl(pair.en) },
    { rel: "alternate", hrefLang: "x-default", href: absoluteUrl(pair.xDefault) },
  ];
}

export type BreadcrumbItem = { name: string; path: string };

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = resolvePublicSiteUrl(SITE_URL || SITE_PRODUCTION_URL).replace(/\/$/, "");
  return `${base}${normalizedPath}`;
}

export function absoluteImageUrl(src: string): string {
  if (!src || src.startsWith("data:")) return absoluteUrl(SITE_LOGO_URL);
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
  const phoneUae = `+${normalizeIntlPhone(SITE_CONTACT_PHONE, SITE_WHATSAPP_NUMBER_AE)}`;
  const phoneSa = `+${normalizeIntlPhone(SITE_CONTACT_PHONE_SA, SITE_WHATSAPP_NUMBER)}`;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": absoluteUrl("/#localbusiness"),
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_TAGLINE_EN,
    telephone: phoneSa,
    email: contactEmail,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "حي السادة",
      addressLocality: "Buraidah",
      addressRegion: "Al-Qassim",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.326,
      longitude: 43.975,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phoneSa,
        contactType: "customer service",
        areaServed: "SA",
        availableLanguage: ["Arabic", "ar"],
      },
      {
        "@type": "ContactPoint",
        telephone: phoneUae,
        contactType: "customer service",
        areaServed: "AE",
        availableLanguage: ["Arabic", "ar"],
      },
    ],
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
  privacy: "سياسة الخصوصية",
  terms: "الشروط والأحكام",
  "web-design-saudi-arabia": "تصميم مواقع في السعودية",
  "web-design-riyadh": "تصميم مواقع الرياض",
  "web-design-qassim": "تصميم مواقع القصيم",
  "web-design-buraidah": "تصميم مواقع بريدة",
  "seo-services": "خدمات SEO",
  "seo-riyadh": "خدمات SEO الرياض",
  "seo-qassim": "خدمات SEO القصيم",
  "seo-buraidah": "خدمات SEO بريدة",
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
  const normalized = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);
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

export function articleSchema(post: BlogPost, slug: string, locale: Locale = DEFAULT_LOCALE) {
  const path = withLocalePrefix(locale, `/blog/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
    inLanguage: locale === "en" ? "en" : "ar-SA",
  };
}

export function serviceSchema(service: Service, slug: string, locale: Locale = DEFAULT_LOCALE) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.metaDescription || service.shortDescription || service.description,
    url: absoluteUrl(withLocalePrefix(locale, `/services/${slug}`)),
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(withLocalePrefix(locale, "/")),
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
        text: stripHtml(faq.answer),
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
  /** Drives og:locale / alternate when provided. */
  locale?: Locale;
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
    { property: "og:image:alt", content: input.title },
    { property: "og:site_name", content: SITE_NAME },
    {
      property: "og:locale",
      content: input.locale === "en" ? "en_GB" : "ar_SA",
    },
    {
      property: "og:locale:alternate",
      content: input.locale === "en" ? "ar_SA" : "en_GB",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SITE_TWITTER },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: input.title },
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
    ...(input.noIndex ? [] : hreflangLinksForPath(input.path)),
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
    locale?: Locale;
  },
) {
  const locale = options?.locale ?? DEFAULT_LOCALE;
  const seo = locale === "en" ? STATIC_PAGE_SEO_EN[page] : STATIC_PAGE_SEO[page];
  // English must not fall back to Arabic CMS meta — use *En fields or EN defaults.
  const cmsTitle =
    locale === "en"
      ? (options?.cms as { metaTitleEn?: string } | null | undefined)?.metaTitleEn?.trim() || ""
      : options?.cms?.metaTitle?.trim() || "";
  const cmsDescription =
    locale === "en"
      ? (options?.cms as { metaDescriptionEn?: string } | null | undefined)?.metaDescriptionEn?.trim() ||
        ""
      : options?.cms?.metaDescription?.trim() || "";
  const title = cmsTitle || seo.title;
  const description = cmsDescription || seo.description;
  const scripts = [...(options?.scripts ?? [])];
  if (options?.breadcrumbs?.length) {
    scripts.push(jsonLdScript(breadcrumbSchema(options.breadcrumbs)));
  }
  const image = options?.image ?? resolveStaticPageOgImage(page, options?.cms);
  const localizedPath = withLocalePrefix(locale, path);
  return buildPageHead({
    title,
    description,
    path: localizedPath,
    type: options?.type,
    image,
    canonicalUrl: resolveCanonicalUrl(localizedPath, options?.cms),
    noIndex: options?.cms?.noIndex,
    scripts,
    extraLinks: options?.extraLinks,
    locale,
  });
}

export function buildBlogPostHead(
  post: BlogPost,
  slugParam: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const slug = blogPostSlug({ slug: post.slug, id: slugParam });
  const arabicPath = `/blog/${slug}`;
  const path = withLocalePrefix(locale, arabicPath);
  const localized = localizeBlogPost(post, locale);
  const m = getMessages(locale);
  const title = localized.metaTitle?.trim() || `${localized.title} | ${SITE_NAME}`;
  const description = localized.metaDescription?.trim() || localized.excerpt;
  return buildPageHead({
    title,
    description,
    path,
    type: "article",
    image: localized.featuredImage ?? DEFAULT_OG_IMAGE,
    locale,
    scripts: [
      jsonLdScript(articleSchema(localized, slug, locale)),
      jsonLdScript(
        breadcrumbSchema([
          { name: m.nav.home, path: withLocalePrefix(locale, "/") },
          { name: m.nav.blog, path: withLocalePrefix(locale, "/blog") },
          { name: localized.title, path },
        ]),
      ),
    ],
  });
}

export function buildServiceHead(
  service: Service,
  slug: string,
  faqs?: Array<{ question: string; answer: string }>,
  locale: Locale = DEFAULT_LOCALE,
) {
  const path = withLocalePrefix(locale, `/services/${slug}`);
  const title = service.metaTitle?.trim() || `${service.title} | ${SITE_NAME}`;
  const rawDescription =
    service.metaDescription?.trim() || service.shortDescription || service.description || "";
  const description = stripHtml(rawDescription).slice(0, 320);
  const m = getMessages(locale);
  const scripts: Array<{ type: string; children: string }> = [
    jsonLdScript({
      ...serviceSchema(service, slug),
      url: absoluteUrl(path),
    }),
    jsonLdScript(
      breadcrumbSchema([
        { name: m.nav.home, path: withLocalePrefix(locale, "/") },
        { name: m.nav.services, path: withLocalePrefix(locale, "/services") },
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
          acceptedAnswer: { "@type": "Answer", text: stripHtml(faq.answer) },
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
    locale,
  });
}

export function buildPortfolioItemHead(
  item: PortfolioItem,
  slugParam: string,
  locale: Locale = DEFAULT_LOCALE,
) {
  const slug = portfolioItemSlug({ slug: item.slug, id: slugParam });
  const path = withLocalePrefix(locale, `/portfolio/${slug}`);
  const displayName = flattenTitle(item.title);
  const title = item.metaTitle?.trim() || `${displayName} | ${SITE_NAME}`;
  const description = item.metaDescription?.trim() || item.description || item.category;
  const m = getMessages(locale);
  return buildPageHead({
    title,
    description,
    path,
    type: "website",
    image: item.imageUrl || DEFAULT_OG_IMAGE,
    locale,
    scripts: [
      jsonLdScript({
        "@context": "https://schema.org",
        ...creativeWorkSchemaForHead(item, path),
      }),
      jsonLdScript(
        breadcrumbSchema([
          { name: m.nav.home, path: withLocalePrefix(locale, "/") },
          { name: m.nav.portfolio, path: withLocalePrefix(locale, "/portfolio") },
          { name: displayName, path },
        ]),
      ),
    ],
  });
}

function creativeWorkSchemaForHead(item: PortfolioItem, path: string) {
  return {
    "@type": "CreativeWork",
    name: flattenTitle(item.title),
    description: item.description || item.metaDescription || item.category,
    image: item.imageUrl ? absoluteImageUrl(item.imageUrl) : absoluteImageUrl(DEFAULT_OG_IMAGE),
    url: absoluteUrl(path),
    genre: item.category,
    keywords: (() => {
      const joined = [
        ...(item.tags ?? []),
        ...(item.servicesProvided ?? []),
        ...(item.technologies ?? []),
      ]
        .filter(Boolean)
        .join(", ");
      return joined || undefined;
    })(),
    ...(item.client
      ? {
          creator: {
            "@type": "Organization",
            name: item.client,
          },
        }
      : {}),
    ...(item.challenge || item.solution
      ? {
          abstract: [item.challenge, item.solution].filter(Boolean).join(" — "),
        }
      : {}),
  };
}

export function buildLandingPageHead(page: LandingPageContent, locale: Locale = DEFAULT_LOCALE) {
  const localized = localizeLanding(page, locale);
  const areaServed = localized.areaServed?.length ? localized.areaServed : [...SEO_AREAS_SERVED];
  const path = withLocalePrefix(locale, localized.path);
  const scripts: Array<{ type: string; children: string }> = [
    jsonLdScript(
      breadcrumbSchema(
        localized.breadcrumbs.map((crumb) => ({
          ...crumb,
          path: withLocalePrefix(locale, stripLocalePrefix(crumb.path)),
        })),
      ),
    ),
    jsonLdScript({
      "@context": "https://schema.org",
      "@type": "Service",
      name: localized.title,
      description: localized.metaDescription,
      url: absoluteUrl(path),
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(withLocalePrefix(locale, "/")),
      },
      areaServed,
      inLanguage: locale === "en" ? "en" : "ar-SA",
    }),
  ];
  if (localized.faqs.length) {
    scripts.push(
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: localized.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: stripHtml(faq.answer) },
        })),
      }),
    );
  }
  if (localized.process.length >= 2) {
    scripts.push(
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: localized.h1,
        description: localized.metaDescription,
        step: localized.process.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text: step.description,
        })),
      }),
    );
  }
  return buildPageHead({
    title: localized.metaTitle,
    description: localized.metaDescription,
    path,
    scripts,
    locale,
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
