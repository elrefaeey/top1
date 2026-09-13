import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Image,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Inbox,
  Settings,
  Search,
  Sparkles,
  LogOut,
  BarChart3,
  X,
  UserRound,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/providers/AuthProvider";
import { useAdminI18n } from "@/providers/LocaleProvider";
import { LanguageSwitch } from "@/components/site/LanguageSwitch";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import type { AdminMessages } from "@/lib/i18n/admin-messages";

function buildNavGroups(a: AdminMessages): Array<{
  label: string;
  items: Array<{ to: string; label: string; icon: LucideIcon; exact?: boolean }>;
}> {
  return [
    {
      label: a.overview,
      items: [
        { to: "/admin", label: a.dashboard, icon: LayoutDashboard, exact: true },
        { to: "/admin/leads", label: a.leads, icon: Inbox },
      ],
    },
    {
      label: a.content,
      items: [
        { to: "/admin/pages", label: a.pages, icon: FileText },
        { to: "/admin/services", label: a.services, icon: Briefcase },
        { to: "/admin/portfolio", label: a.portfolio, icon: Image },
        { to: "/admin/blog", label: a.blog, icon: BookOpen },
        { to: "/admin/authors", label: a.authors, icon: UserRound },
        { to: "/admin/testimonials", label: a.testimonials, icon: MessageSquare },
        { to: "/admin/faqs", label: a.faqs, icon: HelpCircle },
      ],
    },
    {
      label: a.growth,
      items: [
        { to: "/admin/stats", label: a.stats, icon: BarChart3 },
        { to: "/admin/seo", label: a.seo, icon: Search },
        { to: "/admin/seo-ai", label: a.seoAi, icon: Sparkles },
      ],
    },
    {
      label: a.system,
      items: [{ to: "/admin/settings", label: a.settings, icon: Settings }],
    },
  ];
}

function isNavActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === to || pathname === `${to}/`;
  if (to === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function userInitials(email?: string | null, name?: string | null) {
  const source = (name || email || "A").trim();
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  const letters = (parts[0]?.[0] || "A") + (parts[1]?.[0] || "");
  return letters.toUpperCase();
}

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const { user } = useAuth();
  const { a } = useAdminI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navGroups = useMemo(() => buildNavGroups(a), [a]);

  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only pathname
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label={a.closeMenu}
        className={cn(
          "fixed inset-0 z-40 bg-[rgb(2_28_77_/0.48)] transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "admin-sidebar flex w-64 shrink-0 flex-col",
          "md:sticky md:top-0 md:z-auto md:h-dvh md:max-w-none md:translate-x-0",
          "fixed inset-y-0 start-0 z-50 h-dvh max-w-[min(85vw,20rem)] transition-transform duration-200 ease-out",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          open
            ? "translate-x-0"
            : "max-md:ltr:-translate-x-full max-md:rtl:translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--admin-sidebar-border)] px-4 py-4 sm:px-4 sm:py-5">
          <Link to="/admin" className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <img src={SITE_LOGO_URL} alt="" className="h-8 w-8 rounded-lg object-contain ring-1 ring-white/15" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white" dir="ltr">
                {SITE_NAME}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[#8eb6ff]">
                {a.panel}
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius)] text-[var(--admin-sidebar-text)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white md:hidden"
            aria-label={a.closeMenu}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2.5 py-2">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-2">
              <div className="admin-nav-group-label">{group.label}</div>
              <div className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, exact }) => {
                  const active = isNavActive(pathname, to, exact);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={onClose}
                      className={cn("admin-nav-link", active && "admin-nav-link-active")}
                    >
                      <span className="admin-nav-icon" aria-hidden>
                        <Icon className="h-4 w-4" />
                      </span>
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot shrink-0 space-y-2 border-t border-[var(--admin-sidebar-border)] p-2.5">
          <div className="flex items-center justify-between gap-2 rounded-[var(--admin-radius)] bg-white/5 px-2.5 py-2">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--admin-accent)_28%,transparent)] text-[11px] font-bold text-[#c5d9ff]">
                {userInitials(user?.email, user?.displayName)}
              </span>
              <p className="min-w-0 truncate text-xs text-[var(--admin-sidebar-text)]" dir="ltr">
                {user?.email}
              </p>
            </div>
            <LanguageSwitch className="shrink-0" />
          </div>
          <Link to="/" onClick={onClose} className="admin-nav-link">
            <span className="admin-nav-icon" aria-hidden>
              <ExternalLink className="h-4 w-4" />
            </span>
            {a.viewSite}
          </Link>
          <button type="button" onClick={() => logout()} className="admin-nav-link w-full text-start">
            <span className="admin-nav-icon" aria-hidden>
              <LogOut className="h-4 w-4 rtl-flip" />
            </span>
            {a.logout}
          </button>
        </div>
      </aside>
    </>
  );
}
