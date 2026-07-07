type SeoScreenReaderCopyProps = {
  children: React.ReactNode;
};

/** محتوى هيكلي لتحسين SEO دون تأثير على التصميم المرئي */
export function SeoScreenReaderCopy({ children }: SeoScreenReaderCopyProps) {
  return <div className="sr-only">{children}</div>;
}
