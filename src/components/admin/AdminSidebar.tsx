import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
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
} from "lucide-react";
import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/providers/AuthProvider";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navGroups: Array<{
  label: string;
  items: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }>;
}> = [
  {
    label: "نظرة عامة",
    items: [
      { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
      { to: "/admin/leads", label: "الرسائل", icon: Inbox },
    ],
  },
  {
    label: "المحتوى",
    items: [
      { to: "/admin/pages", label: "الصفحات", icon: FileText },
      { to: "/admin/services", label: "الخدمات", icon: Briefcase },
      { to: "/admin/portfolio", label: "أعمالنا", icon: Image },
      { to: "/admin/blog", label: "المدونة", icon: BookOpen },
      { to: "/admin/authors", label: "الكتّاب", icon: UserRound },
      { to: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquare },
      { to: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
    ],
  },
  {
    label: "النمو",
    items: [
      { to: "/admin/stats", label: "الإحصائيات", icon: BarChart3 },
      { to: "/admin/seo", label: "SEO", icon: Search },
      { to: "/admin/seo-ai", label: "SEO AI", icon: Sparkles },
    ],
  },
  {
    label: "النظام",
    items: [{ to: "/admin/settings", label: "الإعدادات", icon: Settings }],
  },
];

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    onClose?.();
    // Close drawer on route change (mobile only)
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
        aria-label="إغلاق القائمة"
        className={cn(
          "fixed inset-0 z-40 bg-[rgb(8_14_24_/0.55)] transition-opacity md:hidden",
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
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--admin-sidebar-border,#1c2d45)] px-4 py-4 sm:px-4 sm:py-5">
          <Link to="/admin" className="flex min-w-0 items-center gap-2.5" onClick={onClose}>
            <img src={SITE_LOGO_URL} alt="" className="h-8 w-8 rounded-lg object-contain" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-white" dir="ltr">
                {SITE_NAME}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-[var(--admin-accent,#c4a035)]">
                لوحة التحكم
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius,0.75rem)] text-[var(--admin-sidebar-text,#9aabbf)] hover:bg-[var(--admin-sidebar-hover,#152338)] hover:text-white md:hidden"
            aria-label="إغلاق القائمة"
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

        <div className="admin-sidebar-foot shrink-0 space-y-2 border-t border-[var(--admin-sidebar-border,#1c2d45)] p-2.5">
          <div className="flex items-center gap-2.5 rounded-[var(--admin-radius,0.75rem)] bg-[rgb(255_255_255_/0.04)] px-2.5 py-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--admin-accent,#c4a035)_22%,transparent)] text-[11px] font-bold text-[var(--admin-accent,#c4a035)]">
              {userInitials(user?.email, user?.displayName)}
            </span>
            <p className="min-w-0 truncate text-xs text-[var(--admin-sidebar-text,#9aabbf)]" dir="ltr">
              {user?.email}
            </p>
          </div>
          <Link to="/" onClick={onClose} className="admin-nav-link">
            <span className="admin-nav-icon" aria-hidden>
              <ExternalLink className="h-4 w-4" />
            </span>
            عرض الموقع
          </Link>
          <button type="button" onClick={() => logout()} className="admin-nav-link w-full text-start">
            <span className="admin-nav-icon" aria-hidden>
              <LogOut className="h-4 w-4 rtl-flip" />
            </span>
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
