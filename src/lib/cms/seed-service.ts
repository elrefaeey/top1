import { doc, setDoc, writeBatch } from "firebase/firestore";
import { db, COLLECTIONS } from "@/lib/firebase/firestore";
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_FAQS,
  FALLBACK_PRICING,
  FALLBACK_SERVICES,
  FALLBACK_SITE_STATS,
  FALLBACK_TESTIMONIALS,
} from "./fallback-data";
import type { SiteSettings } from "@/types/cms";

import { SITE_NAME, SITE_LOGO_URL } from "@/lib/site-config";
import { siteImages } from "@/lib/site-images";

const SITE_SETTINGS: SiteSettings = {
  siteName: SITE_NAME,
  tagline: "تصميم مواقع وتطبيقات وSEO احترافي",
  logoUrl: SITE_LOGO_URL,
  faviconUrl: SITE_LOGO_URL,
  heroImageUrl: siteImages.hero.main,
  heroImageAlt: siteImages.hero.mainAlt,
  contactEmail: "hello@top1markting.com",
  contactPhone: "0549881368",
  whatsappNumber: "966549881368",
  address: "الرياض، المملكة العربية السعودية",
  socialLinks: {
    facebook: "https://www.facebook.com/Top1Markting",
    instagram: "https://www.instagram.com/top1markting/",
    twitter: "https://twitter.com/Top1Markting",
    linkedin: "https://www.linkedin.com/company/top1markting",
  },
  integrations: {
    googleAnalyticsId: "G-09WBWML921",
  },
  robotsTxt: "User-agent: *\nAllow: /\n\nSitemap: https://top1markting.com/sitemap.xml",
  headerNav: [
    { label: "Services", href: "/services", order: 1 },
    { label: "Portfolio", href: "/portfolio", order: 2 },
    { label: "Blog", href: "/blog", order: 3 },
    { label: "About", href: "/about", order: 4 },
  ],
  footerNav: [
    { label: "Contact", href: "/contact", order: 1 },
    { label: "Privacy", href: "/privacy", order: 2 },
    { label: "Terms", href: "/terms", order: 3 },
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
  const batch = writeBatch(db);

  for (const service of FALLBACK_SERVICES) {
    const { id, ...data } = service;
    batch.set(doc(db, COLLECTIONS.services, id), data);
  }

  for (const post of FALLBACK_BLOG_POSTS) {
    const { id, ...data } = post;
    batch.set(doc(db, COLLECTIONS.blogPosts, id), data);
  }

  for (const item of FALLBACK_TESTIMONIALS) {
    const { id, ...data } = item;
    batch.set(doc(db, COLLECTIONS.testimonials, id), data);
  }

  for (const plan of FALLBACK_PRICING) {
    const { id, ...data } = plan;
    batch.set(doc(db, COLLECTIONS.pricingPlans, id), data);
  }

  for (const faq of FALLBACK_FAQS) {
    const { id, ...data } = faq;
    batch.set(doc(db, COLLECTIONS.faqs, id), data);
  }

  for (const stat of FALLBACK_SITE_STATS) {
    const { id, ...data } = stat;
    batch.set(doc(db, COLLECTIONS.siteStats, id), data);
  }

  await batch.commit();
  await setDoc(doc(db, COLLECTIONS.siteSettings, "global"), SITE_SETTINGS);

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
