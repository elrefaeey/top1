import { cn } from "@/lib/utils";

type SiteImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  overlay?: boolean;
};

export function SiteImage({
  className,
  wrapperClassName,
  overlay,
  alt,
  loading = "lazy",
  decoding = "async",
  ...props
}: SiteImageProps) {
  return (
    <div className={cn("relative overflow-hidden bg-muted max-w-full", wrapperClassName)}>
      <img
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={cn("h-full w-full max-w-full object-cover", className)}
        {...props}
      />
      {overlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent"
        />
      )}
    </div>
  );
}
