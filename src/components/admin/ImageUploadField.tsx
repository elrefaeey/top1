import { useRef, useState } from "react";
import { ImagePlus, Loader2, Link2 } from "lucide-react";
import { AdminField, adminInputClass } from "@/components/admin/AdminUi";
import { uploadMediaImage, type UploadStage } from "@/lib/firebase/upload-image";
import { isSafeExternalUrl } from "@/lib/security/validate";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  id: string;
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  hint?: string;
  required?: boolean;
};

const STAGE_LABEL: Record<UploadStage, string> = {
  compress: "جاري تحضير الصورة…",
  upload: "جاري الرفع…",
};

export function ImageUploadField({
  id,
  label = "الصورة",
  value,
  onChange,
  folder,
  hint,
  required,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState<UploadStage>("upload");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showUrl, setShowUrl] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setNotice("");
    setUploading(true);
    setStage("compress");
    try {
      const url = await uploadMediaImage(folder, file, setStage);
      onChange(url);
      setNotice("تم رفع الصورة بنجاح");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleUrlChange(next: string) {
    const value = next.trim();
    if (value.startsWith("data:image/")) {
      setError("لا يُسمح بروابط Base64 — ارفع الملف أو الصق رابط https://");
      return;
    }
    if (value && !isSafeExternalUrl(value) && !value.startsWith("/")) {
      setError("رابط غير صالح — استخدم https://");
      return;
    }
    setError("");
    onChange(value);
  }

  return (
    <AdminField
      id={id}
      label={label}
      hint={hint ?? "ارفع JPG/PNG/WebP من جهازك — تُحفظ في Firebase تلقائياً."}
    >
      <div className="space-y-3">
        {value && (
          <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
            <img src={value} alt="" className="max-h-48 w-full object-contain" />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            id={`${id}-file`}
            disabled={uploading}
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <label
            htmlFor={`${id}-file`}
            className={cn(
              "btn-primary !py-2 !px-4 !text-sm cursor-pointer",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {STAGE_LABEL[stage]}
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" /> رفع صورة
              </>
            )}
          </label>
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="btn-ghost !py-2 !px-3 !text-sm"
          >
            <Link2 className="h-4 w-4" /> {showUrl ? "إخفاء الرابط" : "رابط خارجي"}
          </button>
        </div>

        {(showUrl || !value) && (
          <input
            id={id}
            dir="ltr"
            required={required && !value}
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://…"
            className={adminInputClass("text-start")}
          />
        )}

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
    </AdminField>
  );
}
