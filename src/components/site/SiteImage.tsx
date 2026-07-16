import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type SiteImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  overlay?: boolean;
  fetchPriority?: "high" | "low" | "auto";
};

/** When the host supports format negotiation (e.g. Unsplash), prefer AVIF/WebP. */
function optimizedFormats(src: string | undefined): { avif?: string; webp?: string } | null {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return null;
  try {
    if (!src.includes("images.unsplash.com")) return null;
    const webp = new URL(src);
    webp.searchParams.set("auto", "format");
    webp.searchParams.set("fm", "webp");
    const avif = new URL(src);
    avif.searchParams.set("auto", "format");
    avif.searchParams.set("fm", "avif");
    return { avif: avif.toString(), webp: webp.toString() };
  } catch {
    return null;
  }
}

function readImgStatus(img: HTMLImageElement): "loading" | "ready" | "error" {
  if (!img.src) return "error";
  if (!img.complete) return "loading";
  return img.naturalWidth > 0 ? "ready" : "error";
}

export function SiteImage({
  className,
  wrapperClassName,
  overlay,
  alt,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  width,
  height,
  sizes,
  src,
  onLoad,
  onError,
  ...props
}: SiteImageProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(src ? "loading" : "error");
  const formats = optimizedFormats(typeof src === "string" ? src : undefined);
  const imgClassName = cn(
    "h-full w-full max-w-full object-cover transition-opacity duration-300",
    status === "ready" ? "opacity-100" : "opacity-0",
    className,
  );
  const resolvedSizes =
    sizes ?? (loading === "eager" ? undefined : "(max-width: 768px) 100vw, 50vw");

  useEffect(() => {
    if (!src) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    // Cached / SSR-hydrated images often skip `onLoad` — sync from DOM.
    const img = imgRef.current;
    if (img) {
      const next = readImgStatus(img);
      if (next !== "loading") setStatus(next);
    }
  }, [src]);

  const imgProps = {
    ref: imgRef,
    src,
    alt: alt ?? "",
    loading,
    decoding,
    fetchPriority,
    width,
    height,
    sizes: resolvedSizes,
    className: imgClassName,
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("ready");
      onLoad?.(e);
    },
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("error");
      onError?.(e);
    },
    ...props,
  };

  return (
    <div className={cn("relative overflow-hidden bg-muted max-w-full", wrapperClassName)}>
      {status === "loading" ? (
        <div className="skeleton-block absolute inset-0" aria-hidden />
      ) : null}
      {status === "error" ? (
        <div
          className="absolute inset-0 grid place-items-center text-xs text-muted-foreground px-2 text-center"
          role="img"
          aria-label={alt || "تعذّر تحميل الصورة"}
        >
          لا تتوفر صورة
        </div>
      ) : null}
      {src && status !== "error" ? (
        formats ? (
          <picture>
            {formats.avif ? <source type="image/avif" srcSet={formats.avif} /> : null}
            {formats.webp ? <source type="image/webp" srcSet={formats.webp} /> : null}
            <img {...imgProps} />
          </picture>
        ) : (
          <img {...imgProps} />
        )
      ) : null}
      {overlay && status === "ready" ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent"
        />
      ) : null}
    </div>
  );
}
