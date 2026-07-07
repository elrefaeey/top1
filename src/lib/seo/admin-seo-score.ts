import { absoluteUrl, DEFAULT_OG_IMAGE, STATIC_PAGE_SEO } from "@/lib/seo";
import {
  containsBrand,
  containsCta,
  groupMatchesText,
  matchKeywordGroups,
  matchKeywordGroupsCombined,
} from "@/lib/seo/admin-seo-keywords";
import {
  CUSTOM_META_WARNING,
  DEFAULT_META_MULTIPLIER,
  DEFAULT_META_SCORE_CAP,
  SEO_CTA_PHRASES,
  SEO_PAGE_RULES,
  SEO_SCORE_WEIGHTS,
  STATIC_PAGE_HERO_ALT,
  STATIC_PAGE_IDS,
  type SeoScoreCategory,
  type StaticPageSeoId,
} from "@/lib/seo/admin-seo-rules";
import type { CmsPage, SiteSettings } from "@/types/cms";

export type { StaticPageSeoId } from "@/lib/seo/admin-seo-rules";
export { SEO_PAGE_RULES, SEO_SCORE_WEIGHTS } from "@/lib/seo/admin-seo-rules";

export type SeoCheckStatus = "pass" | "warn" | "fail";

export type SeoCheckItem = {
  id: string;
  label: string;
  category: SeoScoreCategory | "customization";
  status: SeoCheckStatus;
  points: number;
  maxPoints: number;
  summary?: boolean;
};

export type AdminSeoScoreResult = {
  score: number;
  label: string;
  labelClassName: string;
  checks: SeoCheckItem[];
  passed: SeoCheckItem[];
  warnings: SeoCheckItem[];
  errors: SeoCheckItem[];
  usesDefaultMeta: boolean;
};

export type AdminSeoScoreInput = {
  pageId: StaticPageSeoId;
  cms?: Pick<
    CmsPage,
    "metaTitle" | "metaDescription" | "ogImage" | "canonicalUrl" | "noIndex" | "status"
  > | null;
  settings?: Pick<SiteSettings, "heroImageAlt" | "heroImageUrl"> | null;
};

type ResolvedMeta = {
  title: string;
  description: string;
  titleFromCms: boolean;
  descriptionFromCms: boolean;
  usesDefaultMeta: boolean;
};

function resolveMeta(pageId: StaticPageSeoId, cms?: AdminSeoScoreInput["cms"]): ResolvedMeta {
  const defaults = STATIC_PAGE_SEO[pageId];
  const titleFromCms = Boolean(cms?.metaTitle?.trim());
  const descriptionFromCms = Boolean(cms?.metaDescription?.trim());
  return {
    title: cms?.metaTitle?.trim() || defaults.title,
    description: cms?.metaDescription?.trim() || defaults.description,
    titleFromCms,
    descriptionFromCms,
    usesDefaultMeta: !titleFromCms && !descriptionFromCms,
  };
}

function lengthPoints(
  length: number,
  idealMin: number,
  idealMax: number,
  softMin: number,
  softMax: number,
  max: number,
): number {
  if (length === 0) return 0;
  if (length >= idealMin && length <= idealMax) return max;
  if (length >= softMin && length <= softMax) return Math.round(max * 0.6);
  return Math.round(max * 0.25);
}

function applyDefaultMetaPenalty(points: number, fromCms: boolean): number {
  return fromCms ? points : Math.round(points * DEFAULT_META_MULTIPLIER);
}

function isValidCanonical(path: string, cmsCanonical?: string): boolean {
  const custom = cmsCanonical?.trim();
  if (custom) {
    try {
      const parsed = new URL(custom);
      return parsed.protocol === "https:" && Boolean(parsed.pathname);
    } catch {
      return false;
    }
  }
  const auto = absoluteUrl(path);
  return auto.startsWith("https://") && auto.length > 12;
}

function scorePageSchema(pageRequired: string[], implemented: string[]): {
  points: number;
  missing: string[];
  status: SeoCheckStatus;
} {
  if (pageRequired.length === 0) {
    return { points: SEO_SCORE_WEIGHTS.schema, missing: [], status: "pass" };
  }
  const set = new Set(implemented);
  const missing = pageRequired.filter((type) => !set.has(type));
  const ratio = (pageRequired.length - missing.length) / pageRequired.length;
  const points = Math.round(ratio * SEO_SCORE_WEIGHTS.schema);
  const status: SeoCheckStatus =
    missing.length === 0 ? "pass" : ratio >= 0.5 ? "warn" : "fail";
  return { points, missing, status };
}

function makeCheck(
  id: string,
  label: string,
  category: SeoCheckItem["category"],
  points: number,
  maxPoints: number,
  status: SeoCheckStatus,
  summary = true,
): SeoCheckItem {
  return { id, label, category, points, maxPoints, status, summary };
}

function partitionChecks(checks: SeoCheckItem[]): Pick<AdminSeoScoreResult, "passed" | "warnings" | "errors"> {
  return {
    passed: checks.filter((c) => c.status === "pass"),
    warnings: checks.filter((c) => c.status === "warn"),
    errors: checks.filter((c) => c.status === "fail"),
  };
}

export function scoreLabelFromPoints(score: number): Pick<AdminSeoScoreResult, "label" | "labelClassName"> {
  if (score >= 90) return { label: "ممتاز", labelClassName: "text-emerald-700" };
  if (score >= 70) return { label: "جيد", labelClassName: "text-emerald-600" };
  if (score >= 50) return { label: "يحتاج تحسين", labelClassName: "text-amber-600" };
  return { label: "ناقص", labelClassName: "text-destructive" };
}

export function checkIcon(status: SeoCheckStatus): string {
  if (status === "pass") return "✅";
  if (status === "warn") return "⚠️";
  return "❌";
}

export function getSummaryChecks(checks: SeoCheckItem[]): SeoCheckItem[] {
  const rank = { fail: 0, warn: 1, pass: 2 };
  return [...checks.filter((c) => c.summary)].sort((a, b) => rank[a.status] - rank[b.status]);
}

/**
 * تقييم SEO احترافي (0–100) لصفحات الموقع الثابتة.
 * الأوزان معرّفة في SEO_SCORE_WEIGHTS — المحتوى الافتراضي لا يحصل على الدرجة الكاملة.
 */
export function evaluateStaticPageSeo(input: AdminSeoScoreInput): AdminSeoScoreResult {
  const { pageId, cms, settings } = input;
  const rule = SEO_PAGE_RULES[pageId];
  const meta = resolveMeta(pageId, cms);
  const checks: SeoCheckItem[] = [];
  let score = 0;

  const W = SEO_SCORE_WEIGHTS;

  // ── Meta Title (25) ───────────────────────────────────────────────
  let titlePts = 0;
  titlePts += meta.title ? 5 : 0;
  titlePts += lengthPoints(meta.title.length, 30, 60, 20, 70, 10);
  titlePts += containsBrand(meta.title) ? 5 : 0;
  titlePts += matchKeywordGroups(meta.title, rule.keywords).matched.length > 0 ? 5 : 0;
  titlePts = applyDefaultMetaPenalty(titlePts, meta.titleFromCms);
  titlePts = Math.min(W.metaTitle, titlePts);

  const titleStatus: SeoCheckStatus = !meta.title
    ? "fail"
    : !meta.titleFromCms
      ? "warn"
      : titlePts >= 20
        ? "pass"
        : titlePts >= 12
          ? "warn"
          : "fail";

  checks.push(
    makeCheck(
      "meta-title",
      meta.titleFromCms ? "Meta Title مخصص" : "Meta Title (افتراضي)",
      "metaTitle",
      titlePts,
      W.metaTitle,
      titleStatus,
    ),
  );
  score += titlePts;

  // ── Meta Description (25) ─────────────────────────────────────────
  let descPts = 0;
  descPts += meta.description ? 5 : 0;
  descPts += lengthPoints(meta.description.length, 120, 160, 90, 175, 10);
  descPts += containsCta(meta.description, SEO_CTA_PHRASES) ? 5 : 0;
  descPts += matchKeywordGroups(meta.description, rule.keywords).matched.length > 0 ? 5 : 0;
  descPts = applyDefaultMetaPenalty(descPts, meta.descriptionFromCms);
  descPts = Math.min(W.metaDescription, descPts);

  const descStatus: SeoCheckStatus = !meta.description
    ? "fail"
    : !meta.descriptionFromCms
      ? "warn"
      : descPts >= 20
        ? "pass"
        : descPts >= 12
          ? "warn"
          : "fail";

  checks.push(
    makeCheck(
      "meta-description",
      meta.descriptionFromCms ? "Meta Description مخصص" : "Meta Description (افتراضي)",
      "metaDescription",
      descPts,
      W.metaDescription,
      descStatus,
    ),
  );
  score += descPts;

  // ── تحذير المحتوى الافتراضي ───────────────────────────────────────
  if (meta.usesDefaultMeta) {
    checks.push(
      makeCheck(
        "custom-meta",
        CUSTOM_META_WARNING,
        "customization",
        0,
        0,
        "warn",
      ),
    );
  }

  // ── Keywords (10) — يجب تغطية مجموعات متعددة في العنوان والوصف ───
  const kw = matchKeywordGroupsCombined(meta.title, meta.description, rule.keywords);
  const groupsInBoth = rule.keywords.filter(
    (g) => groupMatchesText(meta.title, g) && groupMatchesText(meta.description, g),
  ).length;
  const totalMatched = matchKeywordGroups(
    `${meta.title} ${meta.description}`,
    rule.keywords,
  ).matched.length;

  let kwPts = 0;
  if (totalMatched >= 3 && kw.titleMatches > 0 && kw.descMatches > 0) kwPts = W.keywords;
  else if (totalMatched >= 2 && kw.titleMatches > 0 && kw.descMatches > 0) kwPts = 7;
  else if (totalMatched >= 1) kwPts = 4;
  if (groupsInBoth >= 2) kwPts = Math.min(W.keywords, kwPts + 1);

  const kwStatus: SeoCheckStatus =
    kwPts >= 9 ? "pass" : kwPts >= 5 ? "warn" : totalMatched > 0 ? "warn" : "fail";

  checks.push(
    makeCheck(
      "keywords",
      kwPts >= 9
        ? "Keywords متنوعة في العنوان والوصف"
        : `Keywords (${totalMatched}/${rule.keywords.length} مجموعات)`,
      "keywords",
      kwPts,
      W.keywords,
      kwStatus,
    ),
  );
  score += kwPts;

  // ── Schema (15) — حسب نوع الصفحة فقط ─────────────────────────────
  const schema = scorePageSchema(rule.schemas.pageRequired, rule.schemas.implemented);
  checks.push(
    makeCheck(
      "schema",
      schema.missing.length === 0
        ? `Schema مناسب (${rule.schemas.pageRequired.join(", ")})`
        : `Schema ناقص: ${schema.missing.join(", ")}`,
      "schema",
      schema.points,
      W.schema,
      schema.status,
    ),
  );
  score += schema.points;

  // ── Canonical (5) ─────────────────────────────────────────────────
  const canonicalOk = isValidCanonical(rule.path, cms?.canonicalUrl);
  const canonicalPts = canonicalOk ? W.canonical : 0;
  checks.push(
    makeCheck(
      "canonical",
      canonicalOk ? "Canonical URL صحيح" : "Canonical URL غير صالح",
      "canonical",
      canonicalPts,
      W.canonical,
      canonicalOk ? "pass" : "fail",
    ),
  );
  score += canonicalPts;

  // ── OG Image (5) ──────────────────────────────────────────────────
  const hasCustomOg = Boolean(cms?.ogImage?.trim());
  const ogPts = hasCustomOg ? W.ogImage : DEFAULT_OG_IMAGE ? 2 : 0;
  checks.push(
    makeCheck(
      "og-image",
      hasCustomOg ? "OG Image مخصصة" : "OG Image افتراضية",
      "ogImage",
      ogPts,
      W.ogImage,
      hasCustomOg ? "pass" : DEFAULT_OG_IMAGE ? "warn" : "fail",
    ),
  );
  score += ogPts;

  // ── Images (5) — Alt + أبعاد + lazy ───────────────────────────────
  const heroAlt =
    pageId === "home"
      ? settings?.heroImageAlt?.trim() || STATIC_PAGE_HERO_ALT.home || ""
      : STATIC_PAGE_HERO_ALT[pageId] ?? "";
  const customAlt = pageId === "home" && Boolean(settings?.heroImageAlt?.trim());

  let imgPts = 0;
  if (heroAlt.length >= 8) imgPts += customAlt ? 2 : 1.5;
  if (rule.images.heroHasDimensions) imgPts += 1.5;
  if (rule.images.usesLazyLoading) imgPts += 1.5;
  imgPts = Math.min(W.images, Math.round(imgPts));

  const imgStatus: SeoCheckStatus =
    imgPts >= 4 ? "pass" : imgPts >= 2 ? "warn" : "fail";

  checks.push(
    makeCheck(
      "images",
      customAlt ? "Alt text مخصص" : "Alt text (افتراضي)",
      "images",
      imgPts,
      W.images,
      imgStatus,
    ),
  );
  score += imgPts;

  // ── Content (10) — H1، 300+ كلمة، روابط، CTA ─────────────────────
  const { content } = rule;
  let contentPts = 0;
  if (content.hasH1) contentPts += 2.5;
  if (content.estimatedWords >= content.minRecommendedWords) contentPts += 3;
  else if (content.estimatedWords >= content.minRecommendedWords * 0.65) contentPts += 1.5;
  if (content.hasInternalLinks) contentPts += 2.5;
  if (content.hasPageCta) contentPts += 2;
  contentPts = Math.min(W.content, Math.round(contentPts));

  const contentStatus: SeoCheckStatus =
    contentPts >= 8 ? "pass" : contentPts >= 5 ? "warn" : "fail";

  checks.push(
    makeCheck(
      "content",
      content.estimatedWords >= content.minRecommendedWords
        ? "محتوى الصفحة كافٍ"
        : `محتوى قصير (~${content.estimatedWords} كلمة، المطلوب ${content.minRecommendedWords}+)`,
      "content",
      contentPts,
      W.content,
      contentStatus,
    ),
  );
  score += contentPts;

  // ── سقوف واقعية ───────────────────────────────────────────────────
  if (meta.usesDefaultMeta) {
    score = Math.min(score, DEFAULT_META_SCORE_CAP);
  }
  if (!meta.titleFromCms || !meta.descriptionFromCms) {
    score = Math.min(score, 88);
  }
  if (!hasCustomOg) {
    score = Math.min(score, 94);
  }
  if (schema.missing.length > 0) {
    score = Math.min(score, 85);
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  const parts = partitionChecks(checks);

  return {
    score: finalScore,
    checks,
    ...parts,
    usesDefaultMeta: meta.usesDefaultMeta,
    ...scoreLabelFromPoints(finalScore),
  };
}

/** تقرير SEO لكل الصفحات الثابتة */
export function auditAllStaticPagesSeo(
  cmsPages: Array<Pick<CmsPage, "id" | "slug" | "metaTitle" | "metaDescription" | "ogImage" | "canonicalUrl" | "noIndex" | "status">> = [],
  settings?: AdminSeoScoreInput["settings"],
): Record<StaticPageSeoId, AdminSeoScoreResult> {
  const report = {} as Record<StaticPageSeoId, AdminSeoScoreResult>;
  for (const pageId of STATIC_PAGE_IDS) {
    const cms = cmsPages.find((c) => c.id === pageId || c.slug === pageId) ?? null;
    report[pageId] = evaluateStaticPageSeo({ pageId, cms, settings });
  }
  return report;
}
