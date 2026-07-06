/** روابط التواصل الاجتماعي الرسمية — تُستخدم في الفوتر، التواصل، و Schema.org */
export const SITE_SOCIAL = {
  facebook: "https://www.facebook.com/Top1Markting",
  instagram: "https://www.instagram.com/top1markting/",
  twitter: "https://twitter.com/Top1Markting",
  linkedin: "https://www.linkedin.com/company/top1markting",
} as const;

/** قائمة sameAs لـ JSON-LD (SEO) */
export const SITE_SOCIAL_SAME_AS = [
  SITE_SOCIAL.facebook,
  SITE_SOCIAL.instagram,
  SITE_SOCIAL.twitter,
  SITE_SOCIAL.linkedin,
] as const;
