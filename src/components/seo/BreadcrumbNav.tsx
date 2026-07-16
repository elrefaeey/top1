import { Link } from "@tanstack/react-router";
import type { BreadcrumbItem } from "@/lib/seo";

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  if (items.length < 2) return null;

  return (
    <nav aria-label="مسار التنقل" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden className="opacity-50">
                  /
                </span>
              )}
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-primary transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
