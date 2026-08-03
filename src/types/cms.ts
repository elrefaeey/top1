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
  tagline?: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  deliverables?: string[];
  process?: Array<{ title: string; description: string }>;
  imageUrl?: string;
  order: number;
  status: PublishStatus;
}

export interface PortfolioItem extends SeoFields, Timestamps {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  tags: string[];
  client?: string;
  url?: string;
  order: number;
  status: PublishStatus;
}

export interface BlogPost extends SeoFields, Timestamps {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
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
  role: string;
  bio: string;
  avatarUrl?: string;
  expertise: string[];
  linkedinUrl?: string;
  yearsExperience?: number;
  order: number;
  status: PublishStatus;
}

export interface Testimonial extends Timestamps {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl?: string;
  rating: number;
  /** Optional city for local E-E-A-T signals */
  city?: string;
  /** Optional service slug association */
  serviceSlug?: string;
  order: number;
  status: PublishStatus;
}

export interface PricingPlan extends Timestamps {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  status: PublishStatus;
}

export interface FaqItem extends Timestamps {
  id: string;
  question: string;
  answer: string;
  order: number;
  status: PublishStatus;
}

export interface SiteStat extends Timestamps {
  id: string;
  value: string;
  label: string;
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
