import { doc, setDoc, writeBatch } from "firebase/firestore";
import { getDb, COLLECTIONS } from "@/lib/firebase/firestore";
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_FAQS,
  FALLBACK_PRICING,
  FALLBACK_SERVICES,
  FALLBACK_SITE_STATS,
  FALLBACK_TESTIMONIALS,
} from "./fallback-data";
import type { SiteSettings } from "@/types/cms";

import { SITE_NAME, SITE_LOGO_URL, SITE_CONTACT_EMAIL, SITE_CONTACT_PHONE, SITE_WHATSAPP_NUMBER, SITE_WHATSAPP_MESSAGE, SITE_ADDRESS } from "@/lib/site-config";

const SITE_SETTINGS: SiteSettings = {
  siteName: SITE_NAME,
  tagline: "تصميم مواقع وتطبيقات وSEO احترافي",
  logoUrl: SITE_LOGO_URL,
  faviconUrl: SITE_LOGO_URL,
  heroImageUrl: "",
  heroImageAlt: "",
  contactEmail: SITE_CONTACT_EMAIL,
  contactPhone: SITE_CONTACT_PHONE,
  whatsappNumber: SITE_WHATSAPP_NUMBER,
  whatsappMessage: SITE_WHATSAPP_MESSAGE,
  address: SITE_ADDRESS,
  socialLinks: {
    facebook: "https://www.facebook.com/Top1Markting",
    instagram: "https://www.instagram.com/top1markting/",
    twitter: "https://twitter.com/Top1Markting",
    linkedin: "https://www.linkedin.com/company/top1markting",
  },
  integrations: {
    googleAnalyticsId: "G-09WBWML921",
  },
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: https://www.top1markting.com/sitemap.xml",
  headerNav: [
    { label: "Services", href: "/services", order: 1 },
    { label: "Portfolio", href: "/portfolio", order: 2 },
    { label: "Blog", href: "/blog", order: 3 },
    { label: "About", href: "/about", order: 4 },
  ],
  footerNav: [
    { label: "Contact", href: "/contact", order: 1 },
    { label: "Pricing", href: "/pricing", order: 2 },
    { label: "Privacy", href: "/privacy", order: 3 },
    { label: "Terms", href: "/terms", order: 4 },
    { label: "Cookies", href: "/cookies", order: 5 },
  ],
};

export interface SeedResult {
  services: number;
  blogPosts: number;
  testimonials: number;
  pricingPlans: number;
  faqs: number;
  siteStats: number;
  settings: boolean;
}

export async function seedFirestoreContent(): Promise<SeedResult> {
  const batch = writeBatch(getDb());

  for (const service of FALLBACK_SERVICES) {
    const { id, ...data } = service;
    batch.set(doc(getDb(), COLLECTIONS.services, id), data);
  }

  for (const post of FALLBACK_BLOG_POSTS) {
    const { id, ...data } = post;
    batch.set(doc(getDb(), COLLECTIONS.blogPosts, id), data);
  }

  for (const item of FALLBACK_TESTIMONIALS) {
    const { id, ...data } = item;
    batch.set(doc(getDb(), COLLECTIONS.testimonials, id), data);
  }

  for (const plan of FALLBACK_PRICING) {
    const { id, ...data } = plan;
    batch.set(doc(getDb(), COLLECTIONS.pricingPlans, id), data);
  }

  for (const faq of FALLBACK_FAQS) {
    const { id, ...data } = faq;
    batch.set(doc(getDb(), COLLECTIONS.faqs, id), data);
  }

  for (const stat of FALLBACK_SITE_STATS) {
    const { id, ...data } = stat;
    batch.set(doc(getDb(), COLLECTIONS.siteStats, id), data);
  }

  await batch.commit();
  await setDoc(doc(getDb(), COLLECTIONS.siteSettings, "global"), SITE_SETTINGS);

  return {
    services: FALLBACK_SERVICES.length,
    blogPosts: FALLBACK_BLOG_POSTS.length,
    testimonials: FALLBACK_TESTIMONIALS.length,
    pricingPlans: FALLBACK_PRICING.length,
    faqs: FALLBACK_FAQS.length,
    siteStats: FALLBACK_SITE_STATS.length,
    settings: true,
  };
}
