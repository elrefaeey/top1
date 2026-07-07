import type { KeywordGroup } from "@/lib/seo/admin-seo-rules";

/** Arabic + English normalization for fuzzy keyword matching */
export function normalizeSeoText(text: string): string {
  return text
    .toLowerCase()
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^\p{L}\p{N}\s/+.-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandTermVariants(term: string): string[] {
  const base = normalizeSeoText(term);
  if (!base) return [];

  const variants = new Set<string>([base]);

  if (base.startsWith("ال") && base.length > 3) variants.add(base.slice(2));
  if (base.endsWith("ات") && base.length > 4) variants.add(base.slice(0, -2));
  if (base.endsWith("ه") && base.length > 3) variants.add(`${base.slice(0, -1)}ة`);
  if (base.endsWith("ة") && base.length > 3) variants.add(`${base.slice(0, -1)}ه`);

  if (base.includes("website")) variants.add(base.replace(/website/g, "web site"));
  if (base.includes("web site")) variants.add(base.replace(/web site/g, "website"));
  if (base === "web design") variants.add("website design");
  if (base === "website design") variants.add("web design");

  return [...variants].filter((v) => v.length >= 2);
}

export function textContainsTerm(text: string, term: string): boolean {
  const haystack = normalizeSeoText(text);
  return expandTermVariants(term).some((variant) => {
    if (variant.length <= 3) return haystack.split(" ").includes(variant);
    return haystack.includes(variant);
  });
}

export function matchKeywordGroups(
  text: string,
  groups: KeywordGroup[],
): { matched: KeywordGroup[]; ratio: number } {
  const matched = groups.filter((group) =>
    group.terms.some((term) => textContainsTerm(text, term)),
  );
  const ratio = groups.length === 0 ? 0 : matched.length / groups.length;
  return { matched, ratio };
}

export function matchKeywordGroupsCombined(
  title: string,
  description: string,
  groups: KeywordGroup[],
): { titleMatches: number; descMatches: number; totalGroups: number } {
  const titleMatched = matchKeywordGroups(title, groups).matched.length;
  const descMatched = matchKeywordGroups(description, groups).matched.length;
  return { titleMatches: titleMatched, descMatches: descMatched, totalGroups: groups.length };
}

export function groupMatchesText(text: string, group: KeywordGroup): boolean {
  return group.terms.some((term) => textContainsTerm(text, term));
}

export function containsBrand(text: string, brand = "Top1Markting"): boolean {
  return textContainsTerm(text, brand);
}

export function containsCta(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => textContainsTerm(text, phrase));
}
