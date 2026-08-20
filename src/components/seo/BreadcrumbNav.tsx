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
            <li key={item.path} className={`flex items-center gap-1.5 ${isLast ? "min-w-0" : ""}`}>
              {i > 0 && (
                <span aria-hidden className="opacity-50 shrink-0">
                  /
                </span>
              )}
              {isLast ? (
                <span
                  className="text-foreground font-medium truncate max-w-[32ch] sm:max-w-[48ch]"
                  aria-current="page"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-primary transition-colors shrink-0">
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
