import { useMemo, useRef, useState } from "react";
import { AlignEndVertical, Link2, Loader2, TextCursorInput } from "lucide-react";
import { AdminField, adminInputClass } from "@/components/admin/AdminUi";
import { uploadMediaImage, type UploadStage } from "@/lib/firebase/upload-image";
import { listArticleAnchors } from "@/lib/seo/blog-utils";
import { cn } from "@/lib/utils";

type BlogContentEditorProps = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
};

const STAGE_LABEL: Record<UploadStage, string> = {
  compress: "جاري تحضير الصورة…",
  upload: "جاري الرفع…",
};

function buildImageHtml(url: string, alt: string, caption: string): string {
  const safeAlt = alt.replace(/"/g, "&quot;");
  const captionHtml = caption.trim()
    ? `\n  <figcaption>${caption.trim()}</figcaption>`
    : "";
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

export function BlogContentEditor({ id = "content", value, onChange }: BlogContentEditorProps) {
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
    const html = buildImageHtml(url, alt.trim() || "صورة من المقال", caption);
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
      setNotice(mode === "cursor" ? "تم إدراج الصورة عند موضع المؤشر" : "تم إدراج الصورة في نهاية المقال");
      setCaption("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل رفع الصورة");
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
    const selected = el
      ? value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0)
      : "";
    const text = (linkText.trim() || selected.trim());
    if (!text) {
      setError("حدّد نصاً في المحرر أو اكتب نص الرابط أولاً.");
      return;
    }
    if (!linkTargetId) {
      setError("اختر القسم المستهدف داخل المقال.");
      return;
    }

    const html = `<a href="#${linkTargetId}">${escapeHtmlText(text)}</a>`;
    if (!el) {
      onChange(`${value}${html}`);
      setNotice("تم إدراج رابط القسم");
      return;
    }

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    // Wrap selection when present; otherwise insert at cursor.
    const next =
      end > start
        ? `${value.slice(0, start)}${html}${value.slice(end)}`
        : insertAtCursor(value, html, start, end);
    onChange(next);
    const leadingNewline = end <= start && start > 0 && !value.slice(0, start).endsWith("\n");
    focusAfterInsert(start, html.length, leadingNewline);
    setNotice(`تم ربط النص بالقسم: ${anchors.find((a) => a.id === linkTargetId)?.title ?? linkTargetId}`);
    setLinkText("");
  }

  return (
    <div className="space-y-4">
      <AdminField
        label="المحتوى (HTML)"
        id={id}
        hint="استخدم عناوين h2/h3 لأقسام المقال، ثم اربط أي نص بقسم عبر أداة الروابط أدناه."
      >
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

      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">روابط داخل المقال</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            اربط جملة أو كلمة بقسم معيّن (عنوان h2 أو h3). يمكنك تحديد النص في المحرر ثم اختيار القسم، أو كتابة نص الرابط يدوياً.
          </p>
        </div>

        {anchors.length === 0 ? (
          <p className="text-xs text-amber-800 leading-relaxed rounded-lg bg-amber-500/10 px-3 py-2">
            أضف عناوين مثل {"<h2>عنوان القسم</h2>"} داخل المحتوى حتى تظهر هنا كأهداف للروابط.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="نص الرابط" id={`${id}-link-text`}>
              <input
                id={`${id}-link-text`}
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="اتركه فارغاً لاستخدام النص المحدد"
                className={adminInputClass()}
              />
            </AdminField>
            <AdminField label="القسم المستهدف" id={`${id}-link-target`}>
              <select
                id={`${id}-link-target`}
                value={linkTargetId}
                onChange={(e) => setLinkTargetId(e.target.value)}
                className={adminInputClass()}
              >
                <option value="">اختر قسماً…</option>
                {anchors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} (#{a.id})
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
            className="btn-ghost !py-2 !px-4 !text-sm"
          >
            <Link2 className="h-4 w-4" /> إدراج رابط إلى القسم
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">صور داخل المقال</p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            ارفع أكثر من صورة وحدد مكان كل واحدة: عند المؤشر في المحرر، أو في نهاية المقال.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <AdminField label="وصف الصورة (Alt)" id={`${id}-alt`}>
            <input
              id={`${id}-alt`}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="وصف مختصر للصورة"
              className={adminInputClass()}
            />
          </AdminField>
          <AdminField label="تعليق تحت الصورة (اختياري)" id={`${id}-caption`}>
            <input
              id={`${id}-caption`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="نص يظهر تحت الصورة"
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
            className={cn("btn-primary !py-2 !px-4 !text-sm", uploading && "opacity-60")}
          >
            {uploading && pendingMode === "cursor" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {STAGE_LABEL[stage]}
              </>
            ) : (
              <>
                <TextCursorInput className="h-4 w-4" /> إدراج عند المؤشر
              </>
            )}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={() => triggerUpload("end")}
            className={cn("btn-ghost !py-2 !px-4 !text-sm", uploading && "opacity-60")}
          >
            {uploading && pendingMode === "end" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {STAGE_LABEL[stage]}
              </>
            ) : (
              <>
                <AlignEndVertical className="h-4 w-4" /> إدراج في نهاية المقال
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
