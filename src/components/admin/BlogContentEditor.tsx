import { useRef, useState } from "react";
import { AlignEndVertical, Loader2, TextCursorInput } from "lucide-react";
import { AdminField, adminInputClass } from "@/components/admin/AdminUi";
import { uploadMediaImage, type UploadStage } from "@/lib/firebase/upload-image";
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

  function insertImage(url: string, mode: "cursor" | "end") {
    const html = buildImageHtml(url, alt.trim() || "صورة من المقال", caption);
    const el = textareaRef.current;
    if (mode === "end" || !el) {
      onChange(`${value.trimEnd()}${html}`);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = insertAtCursor(value, html, start, end);
    onChange(next);
    requestAnimationFrame(() => {
      const pos = start + html.length + (start > 0 && !value.slice(0, start).endsWith("\n") ? 1 : 0);
      el.focus();
      el.setSelectionRange(pos, pos);
    });
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

  return (
    <div className="space-y-4">
      <AdminField
        label="المحتوى (HTML)"
        id={id}
        hint="ضع المؤشر في المكان المطلوب داخل النص، ثم اضغط «إدراج عند المؤشر» لوضع الصورة هناك."
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
    </div>
  );
}
