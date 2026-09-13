import { Link } from "@tanstack/react-router";
import type { InternalLink } from "@/lib/seo/internal-links";
import { useLocale } from "@/providers/LocaleProvider";

type InternalLinksBlockProps = {
  title: string;
  links: InternalLink[];
  className?: string;
};

export function InternalLinksBlock({ title, links, className = "" }: InternalLinksBlockProps) {
  const { labelForHref } = useLocale();
  if (links.length === 0) return null;

  return (
    <section className={className} aria-labelledby="internal-links-title">
      <h2 id="internal-links-title" className="text-lg font-bold">
        {title}
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              {labelForHref(link.href, link.label)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
