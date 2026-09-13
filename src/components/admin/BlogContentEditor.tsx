import { useMemo, useRef, useState } from "react";
import { AlignEndVertical, Link2, Loader2, TextCursorInput } from "lucide-react";
import { AdminField, adminInputClass } from "@/components/admin/AdminUi";
import { CmsExternalLinkTool } from "@/components/admin/CmsExternalLinkTool";
import { uploadMediaImage, type UploadStage } from "@/lib/firebase/upload-image";
import { listArticleAnchors } from "@/lib/seo/blog-utils";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "@/providers/LocaleProvider";

type BlogContentEditorProps = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
};

function buildImageHtml(url: string, alt: string, caption: string): string {
  const safeAlt = alt.replace(/"/g, "&quot;");
  const captionHtml = caption.trim() ? `\n  <figcaption>${caption.trim()}</figcaption>` : "";
  return `\n<figure class="blog-inline-image">\n  <img src="${url}" alt="${safeAlt}" loading="lazy" />${captionHtml}\n</figure>\n`;
}

function insertAtCursor(source: string, insertion: string, start: number, end: number): string {
  const before = source.slice(0, start);
  const after = source.slice(end);
  const needsLeadingNewline = before.length > 0 && !before.endsWith("\n");
  const chunk = `${needsLeadingNewline ? "\n" : ""}${insertion}`;
  return `${before}${chunk}${after}`;
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function insertHtmlSnippet(
  source: string,
  html: string,
  textarea: HTMLTextAreaElement | null,
  onChange: (next: string) => void,
): { leadingNewline: boolean; start: number } {
  if (!textarea) {
    onChange(`${source}${html}`);
    return { leadingNewline: false, start: source.length };
  }

  const start = textarea.selectionStart ?? source.length;
  const end = textarea.selectionEnd ?? source.length;
  const next =
    end > start
      ? `${source.slice(0, start)}${html}${source.slice(end)}`
      : insertAtCursor(source, html, start, end);
  onChange(next);
  const leadingNewline = end <= start && start > 0 && !source.slice(0, start).endsWith("\n");
  return { leadingNewline, start };
}

export function BlogContentEditor({ id = "content", value, onChange }: BlogContentEditorProps) {
  const { a, t } = useAdminI18n();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState<UploadStage>("upload");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [pendingMode, setPendingMode] = useState<"cursor" | "end">("cursor");
  const [linkText, setLinkText] = useState("");
  const [linkTargetId, setLinkTargetId] = useState("");
  const stageLabel: Record<UploadStage, string> = {
    compress: a.imageCompressing,
    upload: a.imageUploading,
  };

  const anchors = useMemo(() => listArticleAnchors(value), [value]);

  function focusAfterInsert(start: number, insertedLength: number, leadingNewline: boolean) {
    const el = textareaRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const pos = start + insertedLength + (leadingNewline ? 1 : 0);
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  }

  function insertImage(url: string, mode: "cursor" | "end") {
    const html = buildImageHtml(url, alt.trim() || a.blogDefaultImgAlt, caption);
    const el = textareaRef.current;
    if (mode === "end" || !el) {
      onChange(`${value.trimEnd()}${html}`);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const leadingNewline = start > 0 && !value.slice(0, start).endsWith("\n");
    onChange(insertAtCursor(value, html, start, end));
    focusAfterInsert(start, html.length, leadingNewline);
  }

  async function handleFile(file: File | undefined, mode: "cursor" | "end") {
    if (!file) return;
    setError("");
    setNotice("");
    setUploading(true);
    setStage("compress");
    try {
      const url = await uploadMediaImage("blog", file, setStage);
      insertImage(url, mode);
      setNotice(mode === "cursor" ? a.blogInsertedAtCursor : a.blogInsertedAtEnd);
      setCaption("");
    } catch (err) {
      setError(err instanceof Error ? err.message : a.imageErrUpload);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function triggerUpload(mode: "cursor" | "end") {
    setPendingMode(mode);
    fileRef.current?.click();
  }

  function insertSectionLink() {
    setError("");
    setNotice("");
    const el = textareaRef.current;
    const selected = el ? value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0) : "";
    const text = linkText.trim() || selected.trim();
    if (!text) {
      setError(a.blogErrSelectText);
      return;
    }
    if (!linkTargetId) {
      setError(a.blogErrSelectSection);
      return;
    }

    const html = `<a href="#${linkTargetId}">${escapeHtmlText(text)}</a>`;
    const { start, leadingNewline } = insertHtmlSnippet(value, html, el, onChange);
    focusAfterInsert(start, html.length, leadingNewline);
    setNotice(
      t(a.blogLinkedSection, {
        title: anchors.find((anchor) => anchor.id === linkTargetId)?.title ?? linkTargetId,
      }),
    );
    setLinkText("");
  }

  return (
    <div className="space-y-4">
      <AdminField label={a.blogContentLabel} id={id} hint={a.blogContentHint}>
        <textarea
          ref={textareaRef}
          id={id}
          rows={14}
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={adminInputClass("font-mono text-xs text-start")}
        />
      </AdminField>

      <CmsExternalLinkTool
        idPrefix={`${id}-external`}
        value={value}
        onChange={onChange}
        textareaRef={textareaRef}
        onNotice={(message) => {
          setError("");
          setNotice(message);
        }}
        onError={(message) => {
          setNotice("");
          setError(message);
        }}
      />

      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{a.blogInternalLinks}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.blogInternalLinksDesc}</p>
        </div>

        {anchors.length === 0 ? (
          <p className="text-xs text-amber-800 leading-relaxed rounded-lg bg-amber-500/10 px-3 py-2">
            {a.blogInternalLinksEmpty}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label={a.blogLinkText} id={`${id}-link-text`}>
              <input
                id={`${id}-link-text`}
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder={a.blogLinkTextPh}
                className={adminInputClass()}
              />
            </AdminField>
            <AdminField label={a.blogLinkTarget} id={`${id}-link-target`}>
              <select
                id={`${id}-link-target`}
                value={linkTargetId}
                onChange={(e) => setLinkTargetId(e.target.value)}
                className={adminInputClass()}
              >
                <option value="">{a.blogLinkTargetPh}</option>
                {anchors.map((anchor) => (
                  <option key={anchor.id} value={anchor.id}>
                    {anchor.title} (#{anchor.id})
                  </option>
                ))}
              </select>
            </AdminField>
          </div>
        )}

        {anchors.length > 0 && (
          <button
            type="button"
            onClick={insertSectionLink}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <Link2 className="h-4 w-4" /> {a.blogInsertSectionLink}
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{a.blogInlineImages}</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{a.blogInlineImagesDesc}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label={a.blogImageAlt} id={`${id}-alt`}>
            <input
              id={`${id}-alt`}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder={a.blogImageAltPh}
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label={a.blogImageCaption} id={`${id}-caption`}>
            <input
              id={`${id}-caption`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={a.blogImageCaptionPh}
              className={adminInputClass()}
            />
          </AdminField>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          disabled={uploading}
          onChange={(e) => void handleFile(e.target.files?.[0], pendingMode)}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => triggerUpload("cursor")}
            className={cn("admin-btn admin-btn-primary admin-btn-sm", uploading && "opacity-60")}
          >
            {uploading && pendingMode === "cursor" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {stageLabel[stage]}
              </>
            ) : (
              <>
                <TextCursorInput className="h-4 w-4" /> {a.blogInsertAtCursor}
              </>
            )}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => triggerUpload("end")}
            className={cn("admin-btn admin-btn-ghost admin-btn-sm", uploading && "opacity-60")}
          >
            {uploading && pendingMode === "end" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {stageLabel[stage]}
              </>
            ) : (
              <>
                <AlignEndVertical className="h-4 w-4" /> {a.blogInsertAtEnd}
              </>
            )}
          </button>
        </div>
      </div>

      {notice && !error && (
        <p className="text-xs text-emerald-700 leading-relaxed rounded-lg bg-emerald-500/10 px-3 py-2">
          {notice}
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive leading-relaxed rounded-lg bg-destructive/10 px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
