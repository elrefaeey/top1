/** Strip dangerous HTML while preserving CMS formatting tags. */
export function sanitizeCmsHtml(html: string): string {
  if (!html) return "";

  let out = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<\/(iframe|object|embed|form|input|button|meta|link|base|svg|math)\b[^>]*>/gi, "")
    .replace(/<(iframe|object|embed|form|input|button|meta|link|base|svg|math)\b[^>]*>/gi, "")
    .replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "")
    .replace(/data:text\/html/gi, "");

  out = out.replace(
    /<a\b([^>]*?)href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))([^>]*)>/gi,
    (_match, before, _hrefFull, dbl, sgl, bare, after) => {
      const href = (dbl || sgl || bare || "").trim();
      if (!href || href.toLowerCase().startsWith("javascript:")) return "";
      const safeBefore = String(before).replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
      const safeAfter = String(after).replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
      return `<a${safeBefore}href="${href}" rel="noopener noreferrer"${safeAfter}>`;
    },
  );

  return out;
}
