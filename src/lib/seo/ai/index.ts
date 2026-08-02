export { resolveAiProviderName, hasLlmConfigured, generateAiText } from "@/lib/seo/ai/provider";
export {
  analyzeGscSnapshotsForOpportunities,
  persistSeoOpportunities,
  runOpportunityEngineFromSnapshots,
} from "@/lib/seo/ai/opportunity-engine";
export { generateBlogDraftFromInsight, buildTemplateBlogHtml } from "@/lib/seo/ai/draft-generator";
export type {
  AiProviderName,
  AiChatMessage,
  AiGenerateResult,
  OpportunityType,
  SeoOpportunityDraft,
} from "@/lib/seo/ai/types";
