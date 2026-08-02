/** Types for AI SEO Growth Automation collections (Firestore). */

export type SeoInsightStatus = "pending" | "reviewed" | "completed";

export type SeoInsightPriority = "low" | "medium" | "high";

export type SeoInsightType =
  | "quick_win"
  | "content_opportunity"
  | "page_improvement"
  | "gsc_opportunity"
  | string;

export interface SeoInsight {
  id: string;
  type: SeoInsightType;
  title: string;
  description: string;
  keyword: string;
  /** Page URL (preferred). Falls back to targetPage for older docs. */
  page: string;
  targetPage: string;
  issue: string;
  opportunity: string;
  recommended_action: string;
  suggested_title: string;
  suggested_content: string;
  estimated_value: number;
  currentPosition: number;
  impressions: number;
  clicks: number;
  ctr: number;
  priority: SeoInsightPriority;
  status: SeoInsightStatus;
  /** Alias / legacy field for recommended_action. */
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
