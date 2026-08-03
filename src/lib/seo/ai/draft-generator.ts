import { generateAiText, hasLlmConfigured } from "@/lib/seo/ai/provider";
import type { AiChatMessage } from "@/lib/seo/ai/types";
import { demoteArticleH1 } from "@/lib/seo/blog-utils";
import { SITE_NAME } from "@/lib/site-config";
import type { AiBlogDraftInput, SeoInsight } from "@/types/seo-automation";

/** Preferred internal links for Saudi SEO drafts (match live site routes). */
export const SAUDI_SEO_INTERNAL_LINKS: Array<{ label: string; href: string }> = [
  { label: "خدمات تحسين محركات البحث", href: "/services/seo" },
  { label: "تصميم المواقع", href: "/services/web-design" },
  { label: "خدمات SEO في الرياض", href: "/seo-riyadh" },
  { label: "تواصل معنا", href: "/contact" },
];

type FaqItem = { question: string; answer: string };

type PreparedDraftFields = {
  title: string;
  seoTitle: string;
  slug: string;
  metaDescription: string;
  excerpt: string;
  content: string;
  keywords: string[];
  imagePrompt: string;
  faqSchema: string;
  featuredImageAlt: string;
  category: string;
  tags: string[];
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clampChars(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function ensureMetaDescription(raw: string, keyword: string): string {
  let text = raw.replace(/\s+/g, " ").trim();
  if (!text) {
    text = `${keyword} للشركات في السعودية — دليل عملي من ${SITE_NAME} مع خطوات واضحة للرياض وجدة والقصيم.`;
  }
  if (!/سعود|رياض|جدة|قصيم|Saudi|Riyadh/i.test(text)) {
    text = `${text} مناسب للشركات في السعودية.`;
  }
  if (text.length < 120) {
    text = `${text} اطلب استشارة عبر ${SITE_NAME}.`;
  }
  return clampChars(text, 160);
}

function ensureSeoTitle(raw: string, keyword: string): string {
  let title = raw.replace(/\s+/g, " ").trim() || keyword;
  if (!title.includes(keyword.slice(0, Math.min(12, keyword.length))) && keyword.length <= 40) {
    title = `${keyword} | ${SITE_NAME}`;
  }
  return clampChars(title, 60);
}

/** English-only SEO slug (ASCII). */
export function buildEnglishSeoSlug(keyword: string, hint?: string): string {
  const source = `${hint || ""} ${keyword}`.toLowerCase();
  const parts: string[] = [];

  if (/seo|تحسين محركات|محركات البحث/i.test(source)) parts.push("seo");
  if (/تصميم|مواقع|website|web.?design/i.test(source)) parts.push("web-design");
  if (/متجر|ecommerce|تجارة/i.test(source)) parts.push("ecommerce");
  if (/رياض|riyadh/i.test(source)) parts.push("riyadh");
  if (/جدة|jeddah/i.test(source)) parts.push("jeddah");
  if (/قصيم|qassim/i.test(source)) parts.push("qassim");
  if (/سعود|saudi/i.test(source)) parts.push("saudi-arabia");
  if (/شرك|agency|وكيل/i.test(source)) parts.push("agency");
  if (/خدم|services/i.test(source)) parts.push("services");
  if (/أفضل|best/i.test(source)) parts.push("best");
  if (/دليل|guide/i.test(source)) parts.push("guide");

  let slug = parts.filter(Boolean).join("-");
  if (!slug) {
    slug = source
      .normalize("NFKD")
      .replace(/[^\u0020-\u007E]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (!slug) slug = "saudi-seo-guide";
  slug = slug
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug || "saudi-seo-guide";
}

function pickInternalLinks(keyword: string): Array<{ label: string; href: string }> {
  const hay = keyword.toLowerCase();
  const scored = SAUDI_SEO_INTERNAL_LINKS.map((link) => {
    let score = 1;
    if (/seo|تحسين/i.test(hay) && /seo/i.test(link.href)) score += 3;
    if (/تصميم|مواقع/i.test(hay) && /web-design/i.test(link.href)) score += 3;
    if (/رياض/i.test(hay) && /riyadh/i.test(link.href)) score += 2;
    if (/تواصل|شرك|عرض/i.test(hay) && link.href === "/contact") score += 2;
    return { link, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 3).map((s) => s.link);
  // Always include contact CTA path somewhere in the set.
  if (!top.some((l) => l.href === "/contact")) {
    top[2] = SAUDI_SEO_INTERNAL_LINKS.find((l) => l.href === "/contact")!;
  }
  return top;
}

function buildFaqItems(keyword: string): FaqItem[] {
  return [
    {
      question: `ما أفضل طريقة للبدء في «${keyword}» داخل السعودية؟`,
      answer:
        "ابدأ بتدقيق الصفحة الحالية ونية البحث في google.sa، ثم حسّن العنوان والمحتوى والروابط الداخلية قبل التوسع في صفحات جديدة.",
    },
    {
      question: "هل يختلف الاستهداف بين الرياض وجدة والقصيم؟",
      answer:
        "نعم جزئياً. نية البحث المحلية والإشارات الجغرافية تساعد، لكن جودة المحتوى العربي وتجربة الجوال تبقى أساسية في كل المدن.",
    },
    {
      question: `كيف تساعد ${SITE_NAME} الشركات السعودية؟`,
      answer:
        "نربط تحسين SEO بتصميم الموقع ومسار التحويل، مع مسودات للمراجعة البشرية دون نشر تلقائي، ثم تنفيذ يدوي بعد اعتماد الفريق.",
    },
  ];
}

function buildFaqSchemaJson(faqs: FaqItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  });
}

function buildImagePrompt(keyword: string, title: string): string {
  return [
    "Photorealistic editorial photo for a Saudi B2B marketing blog,",
    `topic: ${keyword},`,
    `article: ${title},`,
    "modern office in Riyadh, Arabic bilingual cues subtle, laptop showing analytics dashboard,",
    "natural daylight, professional corporate mood, no text overlay, no logos, 16:9",
  ].join(" ");
}

function buildDefaultKeywords(keyword: string): string[] {
  const base = [keyword.trim(), "السعودية", "الرياض", "SEO السعودية", SITE_NAME].filter(Boolean);
  return [...new Set(base)].slice(0, 8);
}

/** Deterministic Saudi-market Arabic draft when no LLM key is configured. */
export function buildTemplateBlogHtml(input: {
  title: string;
  keyword: string;
  page?: string;
  issue?: string;
  faqs?: FaqItem[];
}): string {
  const title = escapeHtml(input.title);
  const keyword = escapeHtml(input.keyword);
  const links = pickInternalLinks(input.keyword);
  const faqs = input.faqs ?? buildFaqItems(input.keyword);
  const linkHtml = links
    .map((l) => `<li><a href="${l.href}">${escapeHtml(l.label)}</a></li>`)
    .join("");
  const faqHtml = faqs
    .map((f) => `<h3>${escapeHtml(f.question)}</h3>\n<p>${escapeHtml(f.answer)}</p>`)
    .join("\n");

  return `
<h1>${title}</h1>
<p>تبحث الشركات في المملكة العربية السعودية عن نتائج عملية حول <strong>${keyword}</strong> — في الرياض وجدة والقصيم وغيرها. هذا الدليل من ${escapeHtml(SITE_NAME)} مكتوب بلغة مهنية للشركات السعودية، دون حشو كلمات مفتاحية، مع تركيز على نية البحث وخطوات قابلة للتنفيذ.</p>

<h2>لماذا يهم هذا الموضوع للشركات السعودية؟</h2>
<p>المنافسة على استعلامات مثل «${keyword}» في google.sa تعتمد على محتوى واضح، إشارات ثقة محلية، وتجربة جوال سريعة. ${input.issue ? escapeHtml(input.issue) : "بيانات Search Console تُظهر فرصة تحسين يمكن تحويلها إلى زيارات مؤهلة بعد المراجعة البشرية."}</p>

<h2>ما الذي تبحث عنه الشركات في الرياض وجدة والقصيم؟</h2>
<h3>وضوح العرض والقيمة</h3>
<p>صانع القرار يريد أن يفهم خلال ثوانٍ: هل تناسب الخدمة حجم شركته؟ ما المدة؟ وكيف تُقاس النتائج؟</p>
<h3>خبرة سوق محلي</h3>
<p>المحتوى الذي يذكر سياق السعودية والمدن عند الحاجة يبدو أكثر صلة من النصوص العامة المستوردة.</p>
<h3>تكامل SEO مع الموقع</h3>
<p>أفضل النتائج تأتي عندما يتوافق المحتوى مع صفحات الخدمات ومسار التواصل — وليس مقالات معزولة.</p>

<h2>خطوات عملية لتحسين الظهور حول «${keyword}»</h2>
<ol>
  <li>حدّث Title و Meta Description ليعكسا نية البحث السعودية دون تكرار مبالغ فيه.</li>
  <li>أبقِ H1 واحداً واضحاً، ثم نظّم الأقسام بـ H2/H3.</li>
  <li>أضف FAQ يجيب على اعتراضات الشركات فعلياً.</li>
  <li>اربط المقال بصفحات الخدمات ذات الصلة بروابط طبيعية.</li>
  <li>راجع المسودة بشرياً قبل النشر — لا يُنشر أي محتوى AI تلقائياً.</li>
</ol>

<h2>روابط داخلية مفيدة</h2>
<ul>${linkHtml}</ul>

<h2>الأسئلة الشائعة</h2>
${faqHtml}

<h2>الخلاصة</h2>
<p>المحتوى الجاهز للسوق السعودي يجمع بين نية البحث، لغة الشركات، وإشارات محلية خفيفة. استخدم هذه المسودة كنقطة انطلاق بعد المراجعة من فريقك.</p>

<h2>ابدأ مع ${escapeHtml(SITE_NAME)}</h2>
<p>هل تريد خطة SEO أو تحسين صفحة خدمة لشركتك في السعودية؟ <a href="/contact">تواصل معنا</a> عبر صفحة الاتصال لطلب استشارة — بعد مراجعة المسودة واعتمادها يدوياً.</p>
`.trim();
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const raw = (fenced?.[1] ?? text).trim();
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
      } catch {
        return null;
      }
    }
    return null;
  }
}

function draftMessages(insight: SeoInsight): AiChatMessage[] {
  const title = insight.suggested_title || insight.title || insight.keyword;
  const linksList = SAUDI_SEO_INTERNAL_LINKS.map((l) => `${l.href} (${l.label})`).join("\n- ");

  return [
    {
      role: "system",
      content: `أنت خبير SEO ومحتوى عربي محترف للسوق السعودي (Saudi Arabia).
اكتب مقالات جاهزة لمراجعة بشرية ثم النشر اليدوي فقط — لا تنشر تلقائياً.
القواعد:
- عربية احترافية مناسبة للشركات السعودية (B2B)
- استهدف السعودية، واذكر المدن عند الحاجة فقط (الرياض، جدة، القصيم) دون حشو
- لا تكرر الكلمة المفتاحية بشكل مصطنع
- H1 واحد فقط داخل content
- أعد JSON فقط بدون Markdown خارج JSON`,
    },
    {
      role: "user",
      content: `أنشئ مقال SEO جاهز للمراجعة للكلمة المستهدفة: "${insight.keyword}".
العنوان المقترح: "${title}".
المشكلة/الفرصة: ${insight.issue || insight.description || "فرصة SEO من Google Search Console"}.
الصفحة الحالية: ${insight.page || insight.targetPage || ""}.
التوصية: ${insight.recommended_action || insight.recommendation || ""}.

أعد JSON بالمفاتيح التالية حصراً:
{
  "title": "عنوان المقال العربي",
  "seoTitle": "أقل من 60 حرف ويحتوي الكلمة المستهدفة",
  "slug": "english-only-short-seo-slug",
  "metaDescription": "120 إلى 160 حرف مع keyword ونية سعودية",
  "excerpt": "ملخص قصير",
  "content": "HTML: H1 واحد ثم مقدمة ثم H2/H3 ثم قسم FAQ ثم خلاصة ثم CTA لـ ${SITE_NAME}",
  "keywords": ["..."],
  "imagePrompt": "وصف صورة واقعية بالإنجليزية للمقال",
  "faq": [{"question":"...","answer":"..."}],
  "category": "SEO",
  "tags": ["..."],
  "featuredImageAlt": "وصف بديل للصورة بالعربية"
}

روابط داخلية إلزامية داخل content (استخدم 2–4 منها بشكل طبيعي):
- ${linksList}

ملاحظات:
- slug إنجليزي فقط (a-z0-9-)، قصير وصديق لـ SEO
- CTA يوجّه إلى /contact
- لا Base64 ولا صور مضمّنة
- الحالة النهائية draft للمراجعة البشرية`,
    },
  ];
}

function normalizeFaqs(raw: unknown, keyword: string): FaqItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return buildFaqItems(keyword);
  const items = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const question = String(o.question ?? "").trim();
      const answer = String(o.answer ?? "").trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter(Boolean) as FaqItem[];
  return items.length > 0 ? items.slice(0, 6) : buildFaqItems(keyword);
}

function finalizePrepared(
  partial: Partial<PreparedDraftFields> & { title: string; content: string },
  keyword: string,
): PreparedDraftFields {
  const title = partial.title.trim() || keyword;
  const seoTitle = ensureSeoTitle(partial.seoTitle || partial.title || keyword, keyword);
  const rawSlug = (partial.slug || "").trim().toLowerCase();
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rawSlug)
    ? rawSlug.slice(0, 72)
    : buildEnglishSeoSlug(keyword, partial.slug || title);
  const metaDescription = ensureMetaDescription(
    partial.metaDescription || partial.excerpt || "",
    keyword,
  );
  const keywords =
    partial.keywords && partial.keywords.length > 0
      ? partial.keywords.slice(0, 10)
      : buildDefaultKeywords(keyword);
  const imagePrompt = partial.imagePrompt?.trim() || buildImagePrompt(keyword, title);
  const faqSchema = partial.faqSchema?.trim() || buildFaqSchemaJson(buildFaqItems(keyword));

  return {
    title,
    seoTitle,
    slug,
    metaDescription,
    excerpt: (partial.excerpt || metaDescription).slice(0, 180),
    content: demoteArticleH1(partial.content),
    keywords,
    imagePrompt,
    faqSchema,
    featuredImageAlt: partial.featuredImageAlt?.trim() || title,
    category: partial.category?.trim() || "SEO",
    tags: partial.tags && partial.tags.length > 0 ? partial.tags : keywords.slice(0, 5),
  };
}

function toAiBlogDraftInput(prepared: PreparedDraftFields): AiBlogDraftInput {
  return {
    title: prepared.title,
    slug: prepared.slug,
    excerpt: prepared.excerpt,
    content: prepared.content,
    category: prepared.category,
    tags: prepared.tags,
    author: SITE_NAME,
    metaTitle: prepared.seoTitle,
    metaDescription: prepared.metaDescription,
    seoTitle: prepared.seoTitle,
    keywords: prepared.keywords,
    imagePrompt: prepared.imagePrompt,
    faqSchema: prepared.faqSchema,
    featuredImageAlt: prepared.featuredImageAlt,
    status: "draft",
  };
}

/**
 * Build blog draft input from an insight. Uses LLM when configured; otherwise Saudi template.
 * Caller must persist via createAiBlogDraft (always draft — never auto-publish).
 */
export async function generateBlogDraftFromInsight(
  insight: SeoInsight,
): Promise<{ input: AiBlogDraftInput; provider: string }> {
  const keyword = insight.keyword.trim() || "خدمات SEO";
  const fallbackTitle =
    insight.suggested_title?.trim() || insight.title?.trim() || `${keyword} للشركات في السعودية`;

  if (!hasLlmConfigured()) {
    const faqs = buildFaqItems(keyword);
    const content = buildTemplateBlogHtml({
      title: fallbackTitle,
      keyword,
      page: insight.page || insight.targetPage,
      issue: insight.issue || insight.description,
      faqs,
    });
    const prepared = finalizePrepared(
      {
        title: fallbackTitle,
        seoTitle: ensureSeoTitle(fallbackTitle, keyword),
        slug: buildEnglishSeoSlug(keyword, fallbackTitle),
        metaDescription: "",
        excerpt: "",
        content,
        keywords: buildDefaultKeywords(keyword),
        imagePrompt: buildImagePrompt(keyword, fallbackTitle),
        faqSchema: buildFaqSchemaJson(faqs),
        featuredImageAlt: fallbackTitle,
        category: /seo|تحسين|مواقع|تصميم/i.test(keyword) ? "SEO" : "تسويق",
        tags: buildDefaultKeywords(keyword).slice(0, 5),
      },
      keyword,
    );
    return { provider: "template", input: toAiBlogDraftInput(prepared) };
  }

  const { text, provider } = await generateAiText(draftMessages(insight));
  const parsed = parseJsonObject(text);

  if (!parsed) {
    const faqs = buildFaqItems(keyword);
    const content = text.includes("<h1")
      ? text
      : buildTemplateBlogHtml({
          title: fallbackTitle,
          keyword,
          page: insight.page || insight.targetPage,
          issue: insight.issue,
          faqs,
        });
    const prepared = finalizePrepared(
      {
        title: fallbackTitle,
        content,
        faqSchema: buildFaqSchemaJson(faqs),
        imagePrompt: buildImagePrompt(keyword, fallbackTitle),
      },
      keyword,
    );
    return { provider, input: toAiBlogDraftInput(prepared) };
  }

  const title = String(parsed.title ?? fallbackTitle).trim() || fallbackTitle;
  let content = String(parsed.content ?? "").trim();
  if (!content) {
    throw new Error("الذكاء الاصطناعي لم يُرجع محتوى المقال");
  }

  // Enforce single H1 if model returned extras — keep first only visually by not rewriting aggressively.
  const faqs = normalizeFaqs(parsed.faq, keyword);
  if (!/<h2[^>]*>\s*الأسئلة الشائعة/i.test(content) && !/FAQ/i.test(content)) {
    const faqHtml = faqs
      .map((f) => `<h3>${escapeHtml(f.question)}</h3>\n<p>${escapeHtml(f.answer)}</p>`)
      .join("\n");
    content += `\n<h2>الأسئلة الشائعة</h2>\n${faqHtml}`;
  }

  const keywords = Array.isArray(parsed.keywords)
    ? parsed.keywords.map((k) => String(k).trim()).filter(Boolean)
    : buildDefaultKeywords(keyword);
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t) => String(t).trim()).filter(Boolean)
    : keywords.slice(0, 5);

  const prepared = finalizePrepared(
    {
      title,
      seoTitle: String(parsed.seoTitle ?? parsed.metaTitle ?? title),
      slug: String(parsed.slug ?? ""),
      metaDescription: String(parsed.metaDescription ?? ""),
      excerpt: parsed.excerpt != null ? String(parsed.excerpt) : undefined,
      content,
      keywords,
      imagePrompt: String(parsed.imagePrompt ?? ""),
      faqSchema: buildFaqSchemaJson(faqs),
      featuredImageAlt: String(parsed.featuredImageAlt ?? title),
      category: String(parsed.category ?? "SEO"),
      tags,
    },
    keyword,
  );

  return { provider, input: toAiBlogDraftInput(prepared) };
}
