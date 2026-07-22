import { useState } from "react";
import { Link2 } from "lucide-react";
import { AdminField, adminInputClass } from "@/components/admin/AdminUi";

type CmsExternalLinkToolProps = {
  idPrefix?: string;
  value: string;
  onChange: (html: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onNotice?: (message: string) => void;
  onError?: (message: string) => void;
};

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function normalizeExternalUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^(https?|mailto|tel):/i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(trimmed)) return `https://${trimmed}`;
  return null;
}

function insertAtCursor(source: string, insertion: string, start: number, end: number): string {
  const before = source.slice(0, start);
  const after = source.slice(end);
  const needsLeadingNewline = before.length > 0 && !before.endsWith("\n");
  const chunk = `${needsLeadingNewline ? "\n" : ""}${insertion}`;
  return `${before}${chunk}${after}`;
}

export function CmsExternalLinkTool({
  idPrefix = "cms-link",
  value,
  onChange,
  textareaRef,
  onNotice,
  onError,
}: CmsExternalLinkToolProps) {
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  function insertExternalLink() {
    const el = textareaRef.current;
    const selected = el ? value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0) : "";
    const text = linkText.trim() || selected.trim();
    const url = normalizeExternalUrl(linkUrl);

    if (!text) {
      onError?.("حدّد كلمة أو جملة في المحرر، أو اكتب نص الرابط أولاً.");
      return;
    }
    if (!url) {
      onError?.("أدخل رابطاً صالحاً (مثل https://example.com).");
      return;
    }

    const html = `<a href="${escapeHtmlAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtmlText(text)}</a>`;
    if (!el) {
      onChange(`${value}${html}`);
      onNotice?.(`تم ربط «${text}» بالرابط الخارجي`);
      setLinkText("");
      setLinkUrl("");
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next =
      end > start
        ? `${value.slice(0, start)}${html}${value.slice(end)}`
        : insertAtCursor(value, html, start, end);
    onChange(next);

    requestAnimationFrame(() => {
      const pos = start + html.length;
      el.focus();
      el.setSelectionRange(pos, pos);
    });

    onNotice?.(`تم ربط «${text}» بالرابط الخارجي`);
    setLinkText("");
    setLinkUrl("");
  }

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">روابط خارجية (كلمات قابلة للنقر)</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          حدّد كلمة في النص، الصق الرابط، ثم اضغط إدراج — ستظهر بلون مختلف وتفتح عند الضغط.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminField label="نص الرابط" id={`${idPrefix}-text`}>
          <input
            id={`${idPrefix}-text`}
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="اتركه فارغاً لاستخدام النص المحدد"
            className={adminInputClass()}
          />
        </AdminField>
        <AdminField label="الرابط (URL)" id={`${idPrefix}-url`}>
          <input
            id={`${idPrefix}-url`}
            dir="ltr"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://www.example.com"
            className={adminInputClass("text-start")}
          />
        </AdminField>
      </div>

      <button type="button" onClick={insertExternalLink} className="btn-primary !py-2 !px-4 !text-sm">
        <Link2 className="h-4 w-4" /> إدراج رابط خارجي
      </button>
    </div>
  );
}
