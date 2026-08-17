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
} from "lucide-react";
import { logout } from "@/lib/firebase/auth";
import { useAuth } from "@/providers/AuthProvider";
import { SITE_NAME } from "@/lib/site-config";
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
          "fixed inset-0 z-40 bg-[rgb(21_34_56_/0.4)] transition-opacity md:hidden",
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
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-[var(--admin-border,#dde3ec)] px-4 py-4 sm:px-5 sm:py-5">
          <div className="min-w-0">
            <Link
              to="/admin"
              className="text-lg font-semibold tracking-tight text-[var(--admin-text,#152238)]"
              dir="ltr"
              onClick={onClose}
            >
              {SITE_NAME} <span className="text-[var(--admin-primary,#1149b0)]">Admin</span>
            </Link>
            <p className="mt-1 truncate text-xs text-[var(--admin-muted,#5b6b82)]" dir="ltr">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius,0.625rem)] text-[var(--admin-muted,#5b6b82)] hover:bg-[var(--admin-surface-muted,#eef1f6)] hover:text-[var(--admin-text,#152238)] md:hidden"
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
                      className={cn(
                        "admin-nav-link",
                        active && "admin-nav-link-active",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-[var(--admin-border,#dde3ec)] bg-[var(--admin-surface,#fff)] p-2.5">
          <Link to="/" onClick={onClose} className="admin-nav-link">
            عرض الموقع
          </Link>
          <button type="button" onClick={() => logout()} className="admin-nav-link w-full text-start">
            <LogOut className="h-4 w-4 rtl-flip" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
