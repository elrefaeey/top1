import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { SiteLogo } from "@/components/site/SiteLogo";
import { useSiteSettings } from "@/hooks/use-cms";
import { cn } from "@/lib/utils";

const DEFAULT_NAV = [
  { label: "الرئيسية", href: "/", order: 0 },
  { label: "الخدمات", href: "/services", order: 1 },
  { label: "أعمالنا", href: "/portfolio", order: 2 },
  { label: "من نحن", href: "/about", order: 3 },
  { label: "المدونة", href: "/blog", order: 4 },
  { label: "تواصل", href: "/contact", order: 5 },
];

export function SiteHeader() {
  const { data: settings } = useSiteSettings();
  const navLinks = (settings?.headerNav?.length ? settings.headerNav : DEFAULT_NAV)
    .slice()
    .sort((a, b) => a.order - b.order);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const menuId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      const list = Array.from(focusables);
      const current = document.activeElement as HTMLElement | null;
      const idx = list.indexOf(current ?? list[0]!);
      if (e.shiftKey) {
        if (idx <= 0) {
          e.preventDefault();
          list[list.length - 1]?.focus();
        }
      } else if (idx === list.length - 1) {
        e.preventDefault();
        list[0]?.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);
    const menuButton = menuBtnRef.current;
    return () => {
      panel.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="site-header relative z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="container-page flex h-[3.75rem] lg:h-[4.25rem] items-center justify-between gap-3">
          <Link
            to="/"
            className="group flex items-center min-w-0 shrink-0"
            aria-label={`${settings?.siteName ?? "Top1Markting"} — الصفحة الرئيسية`}
          >
            <SiteLogo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="التنقل الرئيسي">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={cn("nav-link", isActive(l.href) && "nav-link-active")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 !text-[0.9375rem] min-h-11"
            >
              تواصل معنا
            </Link>
            <button
              ref={menuBtnRef}
              type="button"
              aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={open}
              aria-controls={menuId}
              className="lg:hidden grid h-11 w-11 place-items-center rounded-full border border-border bg-surface"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="h-4 w-4" aria-hidden />
              ) : (
                <Menu className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/15 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <div
        ref={panelRef}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label="قائمة التنقل"
        className={cn(
          "fixed top-[3.75rem] lg:top-[4.25rem] inset-x-0 z-40 lg:hidden transition-all duration-300",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <nav
          className="mx-4 rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-card-hover)]"
          aria-label="التنقل الرئيسي"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive(l.href)
                  ? "bg-accent text-primary font-semibold"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 w-full justify-center !text-sm min-h-11"
          >
            تواصل معنا
          </Link>
        </nav>
      </div>
    </>
  );
}
