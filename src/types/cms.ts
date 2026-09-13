export type PublishStatus = "draft" | "published" | "scheduled";

export interface SeoFields {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  contactEmail: string;
  /** هاتف أساسي للعرض (الإمارات) */
  contactPhone: string;
  /** هاتف السعودية (ثانوي) */
  contactPhoneSa?: string;
  whatsappNumber: string;
  /** الرسالة المسبقة عند فتح واتساب (من الإعدادات / Firebase) */
  whatsappMessage?: string;
  address: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
  integrations: {
    googleAnalyticsId?: string;
    metaPixelId?: string;
    clarityId?: string;
  };
  robotsTxt: string;
  headerNav: NavItem[];
  footerNav: NavItem[];
  heroImageUrl?: string;
  heroImageAlt?: string;
}

export interface NavItem {
  label: string;
  href: string;
  order: number;
}

export interface PageSection {
  id: string;
  type: string;
  order: number;
  enabled: boolean;
  data: Record<string, unknown>;
}

export interface CmsPage extends SeoFields, Timestamps {
  id: string;
  title: string;
  status: PublishStatus;
  sections: PageSection[];
}

export interface Service extends SeoFields, Timestamps {
  id: string;
  title: string;
  titleEn?: string;
  tagline?: string;
  taglineEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
  features: string[];
  featuresEn?: string[];
  deliverables?: string[];
  deliverablesEn?: string[];
  process?: Array<{ title: string; description: string }>;
  processEn?: Array<{ title: string; description: string }>;
  imageUrl?: string;
  /** Optional English cover — falls back to `imageUrl` when empty. */
  imageUrlEn?: string;
  order: number;
  status: PublishStatus;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
}

export interface PortfolioItem extends SeoFields, Timestamps {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl: string;
  /** Optional English cover — falls back to `imageUrl` when empty. */
  imageUrlEn?: string;
  tags: string[];
  tagsEn?: string[];
  client?: string;
  clientEn?: string;
  url?: string;
  /** Client problem / brief — optional to avoid inventing data */
  challenge?: string;
  challengeEn?: string;
  /** What we delivered */
  solution?: string;
  solutionEn?: string;
  /** Service labels shown on the project page */
  servicesProvided?: string[];
  servicesProvidedEn?: string[];
  /** Stack / tools used */
  technologies?: string[];
  /** Optional outcome note (only when real) */
  resultsSummary?: string;
  resultsSummaryEn?: string;
  order: number;
  status: PublishStatus;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
}

export interface BlogPost extends SeoFields, Timestamps {
  id: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  featuredImage?: string;
  /** Optional English featured image — falls back to `featuredImage` when empty. */
  featuredImageEn?: string;
  featuredImageAlt?: string;
  featuredImageAltEn?: string;
  category: string;
  tags: string[];
  author: string;
  /** Links blog byline to CMS author profile (`/authors/$slug`). */
  authorSlug?: string;
  authorAvatar?: string;
  readTime: number;
  views: number;
  trending: boolean;
  status: PublishStatus;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
  /** Optional AI SEO title (mirrors metaTitle when set by draft generator). */
  seoTitle?: string;
  /** Optional keyword list from AI SEO drafts. */
  keywords?: string[];
  /** Optional photorealistic image brief for AI/human image production. */
  imagePrompt?: string;
  /** Optional FAQPage JSON-LD string (draft-time schema payload). */
  faqSchema?: string;
}

/** E-E-A-T author / team profile for About, blog bylines, and Person schema. */
export interface Author extends SeoFields, Timestamps {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  bio: string;
  bioEn?: string;
  avatarUrl?: string;
  expertise: string[];
  expertiseEn?: string[];
  linkedinUrl?: string;
  yearsExperience?: number;
  order: number;
  status: PublishStatus;
}

export interface Testimonial extends Timestamps {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  company: string;
  companyEn?: string;
  quote: string;
  quoteEn?: string;
  avatarUrl?: string;
  rating: number;
  /** Optional city for local E-E-A-T signals */
  city?: string;
  cityEn?: string;
  /** Optional service slug association */
  serviceSlug?: string;
  order: number;
  status: PublishStatus;
}

export interface FaqItem extends Timestamps {
  id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  order: number;
  status: PublishStatus;
}

export interface SiteStat extends Timestamps {
  id: string;
  value: string;
  label: string;
  labelEn?: string;
  icon: string;
  order: number;
  status: PublishStatus;
}

export interface Lead extends Timestamps {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  source: string;
  status: "new" | "contacted" | "closed";
}

export interface MediaAsset extends Timestamps {
  id: string;
  name: string;
  url: string;
  path: string;
  type: string;
  size: number;
  alt?: string;
}

export type WithId<T> = T & { id: string };
