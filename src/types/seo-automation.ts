/** Types for AI SEO Growth Automation collections (Firestore). */

export type SeoInsightStatus = "pending" | "reviewed" | "completed";

export type SeoInsightPriority = "low" | "medium" | "high";

export interface SeoInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  keyword: string;
  targetPage: string;
  currentPosition: number;
  impressions: number;
  clicks: number;
  ctr: number;
  priority: SeoInsightPriority;
  status: SeoInsightStatus;
  recommendation: string;
  createdAt: string;
  updatedAt: string;
}

export interface GscSnapshot {
  id: string;
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: string;
  country?: string;
  device?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface GscCredentialDoc {
  id: string;
  userId: string;
  refreshToken: string;
  connectedEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiLog {
  id: string;
  action: string;
  description: string;
  relatedCollection?: string;
  relatedId?: string;
  createdAt: string;
}

/** Input for POST /api/seo/create-draft (status is always forced to draft server-side). */
export type AiBlogDraftInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  category?: string;
  tags?: string[];
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  /** Rejected if present and not "draft". */
  status?: string;
};
