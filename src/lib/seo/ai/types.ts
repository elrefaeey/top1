/** AI SEO provider + opportunity types (server-only). */

import type { SeoInsightPriority, SeoInsightStatus } from "@/types/seo-automation";

export type AiProviderName = "openai" | "anthropic" | "template";

export type AiChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiGenerateResult = {
  text: string;
  provider: AiProviderName;
};

export type OpportunityType = "quick_win" | "content_opportunity" | "page_improvement";

export type SeoOpportunityDraft = {
  id: string;
  type: OpportunityType;
  /** Display title (kept for existing dashboard / schema compatibility). */
  title: string;
  description: string;
  keyword: string;
  /** Canonical page URL or path. */
  page: string;
  targetPage: string;
  issue: string;
  opportunity: string;
  priority: SeoInsightPriority;
  recommended_action: string;
  recommendation: string;
  suggested_title: string;
  suggested_content: string;
  estimated_value: number;
  currentPosition: number;
  impressions: number;
  clicks: number;
  ctr: number;
  status: SeoInsightStatus;
  createdAt: string;
  updatedAt: string;
};
