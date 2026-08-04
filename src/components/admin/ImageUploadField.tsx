import { useEffect, useRef, useState } from "react";
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
  /** Called after a successful file upload (not for manual URL paste). */
  onUploaded?: (url: string) => void | Promise<void>;
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
  onUploaded,
  folder,
  hint,
  required,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState<UploadStage>("upload");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showUrl, setShowUrl] = useState(Boolean(value));

  useEffect(() => {
    if (value) setShowUrl(true);
  }, [value]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    setNotice("");
    setUploading(true);
    setStage("compress");
    try {
      const url = await uploadMediaImage(folder, file, setStage);
      onChange(url);
      setShowUrl(true);
      setNotice("تم رفع الصورة بنجاح — جاري ربطها بالمشروع…");
      try {
        await onUploaded?.(url);
        setNotice(
          onUploaded
            ? "تم رفع الصورة وحفظ الرابط. حدّث الصفحة الرئيسية إن لم تظهر فوراً."
            : "تم رفع الصورة — اضغط «حفظ» أسفل الصفحة حتى تظهر في الموقع.",
        );
      } catch (persistErr) {
        setNotice("تم الرفع، لكن الحفظ التلقائي فشل — اضغط «حفظ» أسفل الصفحة.");
        setError(persistErr instanceof Error ? persistErr.message : "فشل حفظ رابط الصورة");
      }
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
      hint={
        hint ??
        "ارفع JPG/PNG/WebP — تُحفظ في Firebase Storage. يجب أن يظهر الرابط https://firebasestorage… ثم اضغط حفظ إن لم يُحفظ تلقائياً."
      }
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
            placeholder="https://firebasestorage.googleapis.com/…"
            className={adminInputClass("text-start")}
          />
        )}

        {value ? (
          <p className="text-[11px] text-muted-foreground break-all" dir="ltr">
            {value.startsWith("http") ? "رابط الصورة مربوط ✓" : "تحذير: الرابط غير صالح"}
          </p>
        ) : (
          <p className="text-[11px] text-amber-700 leading-relaxed rounded-lg bg-amber-500/10 px-3 py-2">
            لا يوجد رابط صورة محفوظ لهذا العنصر — ارفع صورة من الزر أعلاه (رفع من Storage Console وحده لا يكفي).
          </p>
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
