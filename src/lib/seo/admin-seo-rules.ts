import { STATIC_PAGE_SEO } from "@/lib/seo";
import { siteImages } from "@/lib/site-images";
import { SITE_NAME } from "@/lib/site-config";

export type StaticPageSeoId = keyof typeof STATIC_PAGE_SEO;

/** أوزان التقييم — المجموع 100 */
export const SEO_SCORE_WEIGHTS = {
  metaTitle: 25,
  metaDescription: 25,
  keywords: 10,
  schema: 15,
  canonical: 5,
  ogImage: 5,
  images: 5,
  content: 10,
} as const;

export type SeoScoreCategory = keyof typeof SEO_SCORE_WEIGHTS;

/** مضاعف نقاط Meta عند استخدام STATIC_PAGE_SEO الافتراضي */
export const DEFAULT_META_MULTIPLIER = 0.4;

/** سقف الدرجة عند الاعتماد الكامل على Meta الافتراضي */
export const DEFAULT_META_SCORE_CAP = 72;

export const CUSTOM_META_WARNING = "يُنصح بتخصيص Meta Content لهذه الصفحة";

export type KeywordGroup = {
  id: string;
  terms: string[];
};

export type PageContentProfile = {
  hasH1: boolean;
  estimatedWords: number;
  minRecommendedWords: number;
  hasInternalLinks: boolean;
  hasPageCta: boolean;
};

export type PageImageProfile = {
  heroHasAlt: boolean;
  heroHasDimensions: boolean;
  usesLazyLoading: boolean;
};

export type PageSchemaConfig = {
  /** أنواع Schema المطلوبة لنوع الصفحة (لا تشمل العام من layout إلا للرئيسية) */
  pageRequired: string[];
  /** ما يُصدِره الموقع فعلياً اليوم */
  implemented: string[];
};

export type SeoPageRule = {
  path: string;
  keywords: KeywordGroup[];
  schemas: PageSchemaConfig;
  content: PageContentProfile;
  images: PageImageProfile;
};

export const SEO_CTA_PHRASES = [
  "تواصل معنا",
  "اكتشف خدماتنا",
  "ابدأ مشروعك",
  "تواصل مع",
  "استشارة مجانية",
  "ابدأ مشروعك الإلكتروني",
  "تواصل الآن",
  "اطلب عرض",
  "احجز استشارة",
  "ابدأ الآن",
];

export const SEO_PAGE_RULES: Record<StaticPageSeoId, SeoPageRule> = {
  home: {
    path: "/",
    keywords: [
      {
        id: "web-design",
        terms: [
          "تصميم مواقع",
          "تصميم موقع",
          "شركة تصميم مواقع",
          "web design",
          "website design",
        ],
      },
      { id: "ecommerce", terms: ["متاجر إلكترونية", "متجر إلكتروني", "ecommerce", "e-commerce"] },
      { id: "seo", terms: ["seo", "تحسين محركات البحث"] },
      { id: "marketing", terms: ["تسويق رقمي", "digital marketing"] },
    ],
    schemas: {
      pageRequired: ["Organization", "WebSite", "LocalBusiness"],
      implemented: ["Organization", "WebSite", "LocalBusiness"],
    },
    content: {
      hasH1: true,
      estimatedWords: 900,
      minRecommendedWords: 300,
      hasInternalLinks: true,
      hasPageCta: true,
    },
    images: {
      heroHasAlt: true,
      heroHasDimensions: true,
      usesLazyLoading: true,
    },
  },
  about: {
    path: "/about",
    keywords: [
      { id: "brand", terms: ["top1markting", "شركة top1markting"] },
      { id: "agency", terms: ["وكالة رقمية", "digital agency", "وكالة"] },
      { id: "team", terms: ["من نحن", "about us", "فريق"] },
    ],
    schemas: {
      pageRequired: ["BreadcrumbList"],
      implemented: ["Organization", "WebSite", "LocalBusiness", "BreadcrumbList"],
    },
    content: {
      hasH1: true,
      estimatedWords: 350,
      minRecommendedWords: 300,
      hasInternalLinks: true,
      hasPageCta: true,
    },
    images: {
      heroHasAlt: true,
      heroHasDimensions: false,
      usesLazyLoading: true,
    },
  },
  services: {
    path: "/services",
    keywords: [
      {
        id: "web-services",
        terms: [
          "خدمات تصميم المواقع",
          "تصميم مواقع",
          "شركة تصميم مواقع",
          "web design",
          "website design",
        ],
      },
      { id: "ecommerce", terms: ["تطوير المتاجر", "متاجر إلكترونية", "ecommerce"] },
      { id: "seo", terms: ["تحسين محركات البحث", "seo"] },
    ],
    schemas: {
      pageRequired: ["Service", "FAQPage", "BreadcrumbList"],
      implemented: [
        "Organization",
        "WebSite",
        "LocalBusiness",
        "BreadcrumbList",
        "Service",
        "FAQPage",
      ],
    },
    content: {
      hasH1: true,
      estimatedWords: 520,
      minRecommendedWords: 300,
      hasInternalLinks: true,
      hasPageCta: true,
    },
    images: {
      heroHasAlt: true,
      heroHasDimensions: false,
      usesLazyLoading: true,
    },
  },
  portfolio: {
    path: "/portfolio",
    keywords: [
      { id: "projects", terms: ["مشاريع تصميم مواقع", "مشاريع", "portfolio", "projects"] },
      { id: "digital", terms: ["حلول رقمية", "digital solutions", "أعمالنا"] },
      { id: "creative", terms: ["creative work", "معرض أعمال"] },
    ],
    schemas: {
      pageRequired: ["CreativeWork", "BreadcrumbList"],
      implemented: [
        "Organization",
        "WebSite",
        "LocalBusiness",
        "BreadcrumbList",
        "CreativeWork",
        "ItemList",
      ],
    },
    content: {
      hasH1: true,
      estimatedWords: 380,
      minRecommendedWords: 300,
      hasInternalLinks: true,
      hasPageCta: true,
    },
    images: {
      heroHasAlt: true,
      heroHasDimensions: false,
      usesLazyLoading: true,
    },
  },
  blog: {
    path: "/blog",
    keywords: [
      { id: "seo-articles", terms: ["مقالات seo", "seo", "تحسين محركات البحث"] },
      {
        id: "web-design",
        terms: ["تصميم المواقع", "تصميم مواقع", "تصميم موقع", "web design"],
      },
      { id: "marketing", terms: ["التسويق الرقمي", "تسويق رقمي", "digital marketing"] },
    ],
    schemas: {
      pageRequired: ["Blog", "BreadcrumbList"],
      implemented: [
        "Organization",
        "WebSite",
        "LocalBusiness",
        "BreadcrumbList",
        "Blog",
        "ItemList",
      ],
    },
    content: {
      hasH1: true,
      estimatedWords: 360,
      minRecommendedWords: 300,
      hasInternalLinks: true,
      hasPageCta: true,
    },
    images: {
      heroHasAlt: true,
      heroHasDimensions: false,
      usesLazyLoading: true,
    },
  },
  contact: {
    path: "/contact",
    keywords: [
      { id: "contact-brand", terms: ["تواصل مع top1markting", "top1markting", "تواصل"] },
      { id: "web-design", terms: ["تصميم مواقع", "تصميم موقع", "web design"] },
      { id: "consult", terms: ["استشارة", "consultation", "contact"] },
    ],
    schemas: {
      pageRequired: ["FAQPage", "BreadcrumbList"],
      implemented: ["Organization", "WebSite", "LocalBusiness", "BreadcrumbList", "FAQPage"],
    },
    content: {
      hasH1: true,
      estimatedWords: 320,
      minRecommendedWords: 300,
      hasInternalLinks: true,
      hasPageCta: true,
    },
    images: {
      heroHasAlt: true,
      heroHasDimensions: false,
      usesLazyLoading: true,
    },
  },
};

export const STATIC_PAGE_HERO_ALT: Partial<Record<StaticPageSeoId, string>> = {
  home: siteImages.hero.mainAlt,
  about: siteImages.about.studioAlt,
  contact: siteImages.contact.sideAlt,
  services: `خدمات رقمية — ${SITE_NAME}`,
  portfolio: `معرض أعمال — ${SITE_NAME}`,
  blog: `مدونة ${SITE_NAME}`,
};

export const STATIC_PAGE_IDS = Object.keys(SEO_PAGE_RULES) as StaticPageSeoId[];
