import type {
  Author,
  BlogPost,
  FaqItem,
  PortfolioItem,
  Service,
  SiteStat,
  Testimonial,
} from "@/types/cms";
import type { Locale } from "@/lib/i18n/locale";
import { BLOG_AR, BLOG_EN } from "@/lib/i18n/blog-copy";
import { CMS_PHRASE_EN, PORTFOLIO_EN, SERVICE_EN } from "@/lib/i18n/cms-en";
import { AUTHOR_EN, FAQ_EN, STAT_EN, TESTIMONIAL_EN } from "@/lib/i18n/cms-misc-en";
import { ALL_LANDING_EN } from "@/lib/i18n/landing-en";
import { blogPostSlug, portfolioItemSlug } from "@/lib/cms/admin-utils";
import { serviceSlugCandidates } from "@/lib/seo/service-slug-aliases";
import type { LandingPageContent } from "@/lib/seo/landing-pages";

function lookupServiceEn(slug: string) {
  const normalized = slug.trim().toLowerCase();
  if (SERVICE_EN[normalized]) return SERVICE_EN[normalized];
  for (const candidate of serviceSlugCandidates(normalized)) {
    if (SERVICE_EN[candidate]) return SERVICE_EN[candidate];
  }
  return null;
}

export function localizePhrase(value: string, locale: Locale): string {
  if (locale !== "en") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  const exact = CMS_PHRASE_EN[trimmed];
  if (exact) return exact;
  if (/[,،]/.test(trimmed)) {
    return trimmed
      .split(/[,،]/u)
      .map((part) => CMS_PHRASE_EN[part.trim()] ?? part.trim())
      .filter(Boolean)
      .join(", ");
  }
  return value;
}

function localizeList(values: string[] | undefined, locale: Locale): string[] | undefined {
  if (!values) return values;
  return values.map((item) => localizePhrase(item, locale));
}

/**
 * Prefer CMS English field when locale is EN.
 * When EN and `en` is empty, return undefined so callers can fall back to overlays
 * (do not return Arabic primary here — that would block overlays).
 */
export function pickLocaleText(
  primary: string | undefined,
  en: string | undefined,
  locale: Locale,
): string | undefined {
  if (locale === "en") {
    const trimmed = en?.trim();
    return trimmed || undefined;
  }
  return primary;
}

function pickLocaleList(
  primary: string[] | undefined,
  en: string[] | undefined,
  locale: Locale,
): string[] | undefined {
  if (locale === "en") {
    if (en && en.some((x) => x.trim())) {
      return en.map((x) => x.trim()).filter(Boolean);
    }
    return undefined;
  }
  return primary;
}

function pickLocaleImage(primary: string | undefined, en: string | undefined, locale: Locale): string | undefined {
  if (locale === "en" && en?.trim()) return en.trim();
  return primary;
}

const AUTHOR_NAME_EN: Record<string, string> = {
  "محمد الخطيب": "Mohamed Al-Khatib",
  "أحمد الرفاعي": "Ahmed El-Refaei",
  "ليلى بناني": "Layla Bennani",
};

const AUTHOR_NAME_AR: Record<string, string> = {
  "Mohamed Al-Khatib": "محمد الخطيب",
  "Ahmed El-Refaei": "أحمد الرفاعي",
  "Layla Bennani": "ليلى بناني",
};

const CATEGORY_EN: Record<string, string> = {
  "تصميم مواقع": "Web design",
  "تسويق رقمي": "Digital marketing",
  الأداء: "Performance",
};

const CATEGORY_AR: Record<string, string> = {
  "Web design": "تصميم مواقع",
  "Digital marketing": "تسويق رقمي",
  Performance: "الأداء",
  SEO: "SEO",
};

function localizeAuthorName(name: string, locale: Locale): string {
  if (locale === "en") return AUTHOR_NAME_EN[name] ?? name;
  return AUTHOR_NAME_AR[name] ?? name;
}

function localizeCategory(category: string, locale: Locale): string {
  if (locale === "en") return CATEGORY_EN[category] ?? localizePhrase(category, locale);
  return CATEGORY_AR[category] ?? category;
}

function rewriteArticleChrome(html: string, locale: Locale): string {
  if (locale === "en") return html.replaceAll("صورة من المقال", "Article image");
  return html.replaceAll("Article image", "صورة من المقال");
}

export function localizeService<T extends Service>(item: T, locale: Locale): T {
  const imageUrl = pickLocaleImage(item.imageUrl, item.imageUrlEn, locale) ?? item.imageUrl;
  if (locale !== "en") return { ...item, imageUrl };

  const slug = (item.slug || item.id || "").trim();
  const overlay = lookupServiceEn(slug);
  const processEn = item.processEn?.length
    ? item.processEn
    : overlay?.process ??
      item.process?.map((step) => ({
        title: localizePhrase(step.title, locale),
        description: localizePhrase(step.description, locale),
      }));

  return {
    ...item,
    imageUrl,
    title: pickLocaleText(item.title, item.titleEn, locale) || overlay?.title || item.title,
    tagline:
      pickLocaleText(item.tagline, item.taglineEn, locale) ||
      overlay?.tagline ||
      (item.tagline ? localizePhrase(item.tagline, locale) : item.tagline),
    shortDescription:
      pickLocaleText(item.shortDescription, item.shortDescriptionEn, locale) ||
      overlay?.shortDescription ||
      localizePhrase(item.shortDescription, locale),
    description:
      pickLocaleText(item.description, item.descriptionEn, locale) ||
      overlay?.description ||
      item.description,
    features:
      pickLocaleList(item.features, item.featuresEn, locale) ||
      overlay?.features ||
      localizeList(item.features, locale) ||
      item.features,
    deliverables:
      pickLocaleList(item.deliverables, item.deliverablesEn, locale) ||
      overlay?.deliverables ||
      localizeList(item.deliverables, locale),
    process: processEn,
    metaTitle: pickLocaleText(item.metaTitle, item.metaTitleEn, locale) || item.metaTitle,
    metaDescription:
      pickLocaleText(item.metaDescription, item.metaDescriptionEn, locale) || item.metaDescription,
  };
}

export function localizePortfolio<T extends PortfolioItem>(item: T, locale: Locale): T {
  const imageUrl = pickLocaleImage(item.imageUrl, item.imageUrlEn, locale) ?? item.imageUrl;
  if (locale !== "en") return { ...item, imageUrl };

  const slug = portfolioItemSlug(item).trim().toLowerCase();
  const overlay = PORTFOLIO_EN[slug] ?? PORTFOLIO_EN[item.id];

  return {
    ...item,
    imageUrl,
    title:
      pickLocaleText(item.title, item.titleEn, locale) ||
      overlay?.title ||
      item.title
        .split("\n")
        .map((line) => localizePhrase(line, locale))
        .join("\n"),
    category:
      pickLocaleText(item.category, item.categoryEn, locale) ||
      overlay?.category ||
      localizePhrase(item.category, locale),
    description:
      pickLocaleText(item.description, item.descriptionEn, locale) ||
      overlay?.description ||
      item.description,
    client:
      pickLocaleText(item.client, item.clientEn, locale) || overlay?.client || item.client,
    tags:
      pickLocaleList(item.tags, item.tagsEn, locale) ||
      (overlay?.tags.length ? overlay.tags : undefined) ||
      localizeList(item.tags, locale) ||
      item.tags,
    challenge:
      pickLocaleText(item.challenge, item.challengeEn, locale) ||
      overlay?.challenge ||
      item.challenge,
    solution:
      pickLocaleText(item.solution, item.solutionEn, locale) ||
      overlay?.solution ||
      item.solution,
    servicesProvided:
      pickLocaleList(item.servicesProvided, item.servicesProvidedEn, locale) ||
      overlay?.servicesProvided ||
      localizeList(item.servicesProvided, locale),
    resultsSummary:
      pickLocaleText(item.resultsSummary, item.resultsSummaryEn, locale) ||
      overlay?.resultsSummary ||
      item.resultsSummary,
    caseMetrics: item.caseMetrics?.map((metric) => ({
      ...metric,
      label: pickLocaleText(metric.label, metric.labelEn, locale) || metric.label,
    })),
    caseDuration: pickLocaleText(item.caseDuration, item.caseDurationEn, locale) || item.caseDuration,
    metaTitle: pickLocaleText(item.metaTitle, item.metaTitleEn, locale) || item.metaTitle,
    metaDescription:
      pickLocaleText(item.metaDescription, item.metaDescriptionEn, locale) || item.metaDescription,
  };
}

export function localizeLanding<T extends LandingPageContent>(page: T, locale: Locale): T {
  if (locale !== "en") return page;
  const en = ALL_LANDING_EN[page.slug];
  if (!en) return page;
  const metaTitle = `${en.title} | Top1Markting`;
  const metaDescription =
    en.intro[0]?.slice(0, 160) || page.metaDescription;
  return {
    ...page,
    title: en.title,
    metaTitle,
    metaDescription,
    h1: en.h1,
    tagline: en.tagline,
    intro: en.intro,
    features: en.features,
    process: en.process,
    faqs: en.faqs,
    breadcrumbs: en.breadcrumbs,
  };
}

export function localizeBlogPost<T extends BlogPost>(item: T, locale: Locale): T {
  const slug = blogPostSlug(item).trim().toLowerCase();
  const overlay = locale === "en" ? BLOG_EN[slug] : BLOG_AR[slug];
  const featuredImage =
    pickLocaleImage(item.featuredImage, item.featuredImageEn, locale) ?? item.featuredImage;

  if (locale === "en") {
    return {
      ...item,
      featuredImage,
      title: pickLocaleText(item.title, item.titleEn, locale) || overlay?.title || item.title,
      excerpt:
        pickLocaleText(item.excerpt, item.excerptEn, locale) || overlay?.excerpt || item.excerpt,
      content:
        pickLocaleText(item.content, item.contentEn, locale) ||
        overlay?.content ||
        rewriteArticleChrome(item.content, locale),
      category: overlay?.category || localizeCategory(item.category, locale),
      tags: overlay?.tags ?? localizeList(item.tags, locale) ?? item.tags,
      featuredImageAlt:
        pickLocaleText(item.featuredImageAlt, item.featuredImageAltEn, locale) ||
        overlay?.featuredImageAlt ||
        (item.featuredImageAlt
          ? item.featuredImageAlt.replaceAll("صورة من المقال", "Article image")
          : item.featuredImageAlt),
      author: localizeAuthorName(item.author, locale),
      metaTitle: pickLocaleText(item.metaTitle, item.metaTitleEn, locale) || item.metaTitle,
      metaDescription:
        pickLocaleText(item.metaDescription, item.metaDescriptionEn, locale) ||
        item.metaDescription,
    };
  }

  // Arabic: primary fields are Arabic; optional overlay for EN-sourced posts
  if (!overlay) {
    return {
      ...item,
      featuredImage,
      category: localizeCategory(item.category, locale),
      tags: localizeList(item.tags, locale) ?? item.tags,
      author: localizeAuthorName(item.author, locale),
      content: rewriteArticleChrome(item.content, locale),
    };
  }
  return {
    ...item,
    featuredImage,
    title: overlay.title,
    excerpt: overlay.excerpt,
    category: overlay.category,
    tags: overlay.tags ?? item.tags,
    featuredImageAlt: overlay.featuredImageAlt ?? item.featuredImageAlt,
    author: localizeAuthorName(item.author, locale),
    content: overlay.content ? overlay.content : rewriteArticleChrome(item.content, locale),
  };
}

export function localizeFaq<T extends FaqItem>(item: T, locale: Locale): T {
  if (locale !== "en") return item;
  const overlay = FAQ_EN[item.id];
  return {
    ...item,
    question:
      pickLocaleText(item.question, item.questionEn, locale) ||
      overlay?.question ||
      item.question,
    answer:
      pickLocaleText(item.answer, item.answerEn, locale) || overlay?.answer || item.answer,
  };
}

export function localizeTestimonial<T extends Testimonial>(item: T, locale: Locale): T {
  if (locale !== "en") return item;
  const overlay = TESTIMONIAL_EN[item.id];
  return {
    ...item,
    name: pickLocaleText(item.name, item.nameEn, locale) || overlay?.name || item.name,
    role: pickLocaleText(item.role, item.roleEn, locale) || overlay?.role || item.role,
    company:
      pickLocaleText(item.company, item.companyEn, locale) || overlay?.company || item.company,
    quote: pickLocaleText(item.quote, item.quoteEn, locale) || overlay?.quote || item.quote,
    city: pickLocaleText(item.city, item.cityEn, locale) || overlay?.city || item.city,
  };
}

export function localizeStat<T extends SiteStat>(item: T, locale: Locale): T {
  if (locale !== "en") return item;
  const overlay = STAT_EN[item.id];
  return {
    ...item,
    label:
      pickLocaleText(item.label, item.labelEn, locale) ||
      overlay?.label ||
      localizePhrase(item.label.trim(), locale),
  };
}

export function localizeAuthorProfile<T extends Author>(item: T, locale: Locale): T {
  if (locale !== "en") return item;
  const overlay = AUTHOR_EN[item.slug] ?? AUTHOR_EN[item.id];
  return {
    ...item,
    name:
      pickLocaleText(item.name, item.nameEn, locale) ||
      overlay?.name ||
      localizeAuthorName(item.name, locale),
    role:
      pickLocaleText(item.role, item.roleEn, locale) ||
      overlay?.role ||
      localizePhrase(item.role, locale),
    bio: pickLocaleText(item.bio, item.bioEn, locale) || overlay?.bio || item.bio,
    expertise:
      pickLocaleList(item.expertise, item.expertiseEn, locale) ||
      overlay?.expertise ||
      localizeList(item.expertise, locale) ||
      item.expertise,
  };
}
