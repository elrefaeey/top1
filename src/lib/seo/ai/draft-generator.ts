import { LANDING_LINKS, SEO_LOCATION_LINKS, SERVICE_LINKS } from "@/lib/seo/internal-links";
import { generateAiText, hasLlmConfigured } from "@/lib/seo/ai/provider";
import type { AiChatMessage } from "@/lib/seo/ai/types";
import { demoteArticleH1 } from "@/lib/seo/blog-utils";
import { SITE_NAME } from "@/lib/site-config";
import type { AiBlogDraftInput, SeoInsight } from "@/types/seo-automation";

function pickInternalLinks(keyword: string): Array<{ label: string; href: string }> {
  const hay = keyword.toLowerCase();
  const pool = [...SERVICE_LINKS, ...LANDING_LINKS, ...SEO_LOCATION_LINKS];
  const scored = pool.map((link) => {
    let score = 0;
    if (/seo|تحسين/i.test(hay) && /seo/i.test(link.href + link.label)) score += 3;
    if (/تصميم|مواقع|موقع/i.test(hay) && /web-design|تصميم/i.test(link.href + link.label))
      score += 3;
    if (/رياض/i.test(hay) && /riyadh|رياض/i.test(link.href + link.label)) score += 2;
    if (/متجر|تجارة/i.test(hay) && /ecommerce|متاجر/i.test(link.href + link.label)) score += 2;
    return { link, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const chosen = scored
    .filter((s) => s.score > 0)
    .slice(0, 3)
    .map((s) => s.link);
  if (chosen.length >= 3) return chosen;
  return [
    ...chosen,
    { label: "خدمات SEO", href: "/seo-services" },
    { label: "تصميم مواقع الرياض", href: "/web-design-riyadh" },
    { label: "تواصل معنا", href: "/contact" },
  ].slice(0, 3);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Deterministic Arabic SEO draft when no LLM key is configured. Always draft-ready HTML. */
export function buildTemplateBlogHtml(input: {
  title: string;
  keyword: string;
  page?: string;
  issue?: string;
}): string {
  const keyword = escapeHtml(input.keyword);
  const links = pickInternalLinks(input.keyword);
  const linkHtml = links
    .map((l) => `<li><a href="${l.href}">${escapeHtml(l.label)}</a></li>`)
    .join("");

  // No <h1> here — the public blog template already renders post.title as the page H1.
  return `
<p>تبحث الشركات في السعودية عن حلول موثوقة حول <strong>${keyword}</strong>. في هذا الدليل من ${escapeHtml(SITE_NAME)} نوضح كيف تختار الخدمة المناسبة، وما الذي يرفع ظهورك في Google، وكيف تربط المحتوى بأهدافك التجارية في الرياض والسوق السعودي.</p>

<h2>لماذا يهم هذا الموضوع للشركات في السعودية؟</h2>
<p>المنافسة على الكلمات المرتبطة بـ «${keyword}» تزداد، والظهور في الصفحة الأولى يعتمد على محتوى واضح، تجربة مستخدم قوية، وروابط داخلية ذكية. ${input.issue ? escapeHtml(input.issue) : "البيانات من Search Console تُظهر فرصة تحسين واضحة."}</p>

<h2>كيف تختار الشريك المناسب؟</h2>
<h3>خبرة السوق المحلي</h3>
<p>اختر فريقاً يفهم نية البحث بالعربية، ولهجة الجمهور في الرياض والمناطق الأخرى، ويقدّم أمثلة أعمال حقيقية.</p>
<h3>منهجية قياس النتائج</h3>
<p>اطلب تقارير شهرية تشمل الظهور، النقرات، ومواضع الكلمات المستهدفة — وليس وعوداً عامة.</p>
<h3>تكامل الخدمات</h3>
<p>أفضل النتائج تأتي عندما يتكامل تصميم الموقع مع SEO والتسويق الرقمي ضمن خطة واحدة.</p>

<h2>خطوات عملية لتحسين ظهور «${keyword}»</h2>
<ol>
  <li>تحسين العنوان والوصف التعريفي ليعكسا نية البحث بدقة.</li>
  <li>تعزيز H1 والمقدمة بكلمات سعودية طبيعية دون حشو.</li>
  <li>إضافة قسم أسئلة شائعة مع إجابات مفيدة.</li>
  <li>بناء روابط داخلية نحو صفحات الخدمات ذات الصلة.</li>
  <li>تحسين السرعة وتجربة الجوال.</li>
</ol>

<h2>روابط مفيدة داخل موقعنا</h2>
<ul>${linkHtml}</ul>

<h2>الأسئلة الشائعة</h2>
<h3>كم يستغرق تحسين الظهور في Google؟</h3>
<p>غالباً من أسابيع إلى بضعة أشهر حسب المنافسة وجودة الصفحة الحالية.</p>
<h3>هل تحتاج الشركات في الرياض استراتيجية مختلفة؟</h3>
<p>نعم جزئياً — استهداف محلي (الرياض / السعودية) مع محتوى عربي واضح يزيد الصلة.</p>
<h3>هل تنشرون المحتوى تلقائياً؟</h3>
<p>لا. مسودات SEO AI تُحفظ كـ draft للمراجعة والنشر اليدوي من لوحة التحكم.</p>

<h2>الخلاصة</h2>
<p>التركيز على نية البحث، جودة الصفحة، والروابط الداخلية يحوّل فرص Search Console إلى زيارات مؤهلة. ابدأ بتحسين الصفحة أو بنشر محتوى موجّه بعد المراجعة البشرية.</p>

<h2>ابدأ مع ${escapeHtml(SITE_NAME)}</h2>
<p>هل تريد خطة SEO أو تصميم موقع يخدم نموك في السعودية؟ <a href="/contact">تواصل معنا</a> عبر صفحة الاتصال لطلب استشارة.</p>
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
  return [
    {
      role: "system",
      content:
        "أنت خبير SEO للسوق السعودي. اكتب محتوى عربياً احترافياً لمسودة مدونة فقط. لا تنشر. أعد JSON فقط.",
    },
    {
      role: "user",
      content: `أنشئ مسودة مقال SEO بالعربية للكلمة: "${insight.keyword}".
العنوان المقترح: "${title}".
المشكلة: ${insight.issue || insight.description || "فرصة SEO من Search Console"}.
الصفحة الحالية: ${insight.page || insight.targetPage || ""}.
التوصية: ${insight.recommended_action || insight.recommendation || ""}.

أعد JSON بالمفاتيح:
title, excerpt, content (HTML: مقدمة ثم H2/H3 ثم FAQ ثم خلاصة ثم CTA — بدون أي H1 لأن العنوان يُعرض منفصلاً),
metaTitle, metaDescription, category, tags (مصفوفة), featuredImageAlt.
ضمن روابط داخلية حقيقية مثل /seo-services و /web-design-riyadh و /contact.
استهدف السعودية والرياض عند الصلة. لا تستخدم Base64 للصور. لا تُدرج وسم H1 داخل content.`,
    },
  ];
}

/**
 * Build blog draft input from an insight. Uses LLM when configured; otherwise template HTML.
 * Caller must persist via createAiBlogDraft (always draft).
 */
export async function generateBlogDraftFromInsight(
  insight: SeoInsight,
): Promise<{ input: AiBlogDraftInput; provider: string }> {
  const fallbackTitle =
    insight.suggested_title?.trim() || insight.title?.trim() || `دليل: ${insight.keyword}`.trim();

  if (!hasLlmConfigured()) {
    const content = demoteArticleH1(
      buildTemplateBlogHtml({
        title: fallbackTitle,
        keyword: insight.keyword,
        page: insight.page || insight.targetPage,
        issue: insight.issue || insight.description,
      }),
    );
    return {
      provider: "template",
      input: {
        title: fallbackTitle,
        excerpt: `${insight.keyword} — دليل عملي من ${SITE_NAME} للسوق السعودي.`.slice(0, 180),
        content,
        category: /seo|تحسين/i.test(insight.keyword) ? "SEO" : "تصميم",
        tags: [insight.keyword.slice(0, 40), "السعودية", "الرياض"].filter(Boolean),
        author: SITE_NAME,
        metaTitle: fallbackTitle.slice(0, 60),
        metaDescription: (insight.opportunity || insight.description || fallbackTitle).slice(
          0,
          160,
        ),
        featuredImageAlt: fallbackTitle,
        status: "draft",
      },
    };
  }

  const { text, provider } = await generateAiText(draftMessages(insight));
  const parsed = parseJsonObject(text);
  if (!parsed) {
    // LLM returned prose — wrap as content (never keep body H1; page template owns H1)
    const content = demoteArticleH1(
      /<h[1-6]\b/i.test(text)
        ? text
        : buildTemplateBlogHtml({
            title: fallbackTitle,
            keyword: insight.keyword,
            page: insight.page || insight.targetPage,
            issue: insight.issue,
          }),
    );
    return {
      provider,
      input: {
        title: fallbackTitle,
        content,
        excerpt: fallbackTitle.slice(0, 160),
        category: "SEO",
        tags: [insight.keyword.slice(0, 40), "السعودية"],
        author: SITE_NAME,
        metaTitle: fallbackTitle.slice(0, 60),
        metaDescription: fallbackTitle.slice(0, 160),
        featuredImageAlt: fallbackTitle,
        status: "draft",
      },
    };
  }

  const title = String(parsed.title ?? fallbackTitle).trim() || fallbackTitle;
  const content = demoteArticleH1(String(parsed.content ?? "").trim());
  if (!content) {
    throw new Error("الذكاء الاصطناعي لم يُرجع محتوى المقال");
  }

  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.map((t) => String(t).trim()).filter(Boolean)
    : undefined;

  return {
    provider,
    input: {
      title,
      excerpt: parsed.excerpt != null ? String(parsed.excerpt) : undefined,
      content,
      category: parsed.category != null ? String(parsed.category) : "SEO",
      tags,
      author: SITE_NAME,
      metaTitle: parsed.metaTitle != null ? String(parsed.metaTitle) : title,
      metaDescription: parsed.metaDescription != null ? String(parsed.metaDescription) : undefined,
      featuredImageAlt: parsed.featuredImageAlt != null ? String(parsed.featuredImageAlt) : title,
      status: "draft",
    },
  };
}
