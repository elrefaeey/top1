import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Link2 } from "lucide-react";
import { AdminField, adminInputClass } from "@/components/admin/AdminUi";
import { uploadMediaImage, type UploadStage } from "@/lib/firebase/upload-image";
import { isSafeExternalUrl } from "@/lib/security/validate";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "@/providers/LocaleProvider";

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

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  onUploaded,
  folder,
  hint,
  required,
}: ImageUploadFieldProps) {
  const { a } = useAdminI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState<UploadStage>("upload");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showUrl, setShowUrl] = useState(Boolean(value));
  const stageLabel: Record<UploadStage, string> = {
    compress: a.imageCompressing,
    upload: a.imageUploading,
  };

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
      setNotice(a.imageNoticeLinking);
      try {
        await onUploaded?.(url);
        setNotice(onUploaded ? a.imageNoticeSaved : a.imageNoticeSaveForm);
      } catch (persistErr) {
        setNotice(a.imageNoticePersistFail);
        setError(persistErr instanceof Error ? persistErr.message : a.imageErrPersist);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : a.imageErrUpload);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleUrlChange(next: string) {
    const value = next.trim();
    if (value.startsWith("data:image/")) {
      setError(a.imageErrBase64);
      return;
    }
    if (value && !isSafeExternalUrl(value) && !value.startsWith("/")) {
      setError(a.imageErrInvalidUrl);
      return;
    }
    setError("");
    onChange(value);
  }

  return (
    <AdminField id={id} label={label ?? a.imageDefaultLabel} hint={hint ?? a.imageHintDefault}>
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
              "admin-btn admin-btn-primary admin-btn-sm cursor-pointer",
              uploading && "pointer-events-none opacity-60",
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {stageLabel[stage]}
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" /> {a.imageUploadBtn}
              </>
            )}
          </label>
          <button
            type="button"
            onClick={() => setShowUrl((v) => !v)}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <Link2 className="h-4 w-4" /> {showUrl ? a.imageHideUrl : a.imageExternalUrl}
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
            {value.startsWith("http") ? a.imageUrlOk : a.imageUrlWarn}
          </p>
        ) : (
          <p className="text-[11px] text-amber-700 leading-relaxed rounded-lg bg-amber-500/10 px-3 py-2">
            {a.imageNoUrl}
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
