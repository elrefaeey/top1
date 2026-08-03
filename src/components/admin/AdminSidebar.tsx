import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Image,
  BookOpen,
  MessageSquare,
  DollarSign,
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

const navItems = [
  { to: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "الرسائل", icon: Inbox },
  { to: "/admin/pages", label: "الصفحات", icon: FileText },
  { to: "/admin/services", label: "الخدمات", icon: Briefcase },
  { to: "/admin/portfolio", label: "أعمالنا", icon: Image },
  { to: "/admin/authors", label: "الكتّاب", icon: UserRound },
  { to: "/admin/blog", label: "المدونة", icon: BookOpen },
  { to: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquare },
  { to: "/admin/pricing", label: "الأسعار", icon: DollarSign },
  { to: "/admin/stats", label: "الإحصائيات", icon: BarChart3 },
  { to: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/seo-ai", label: "SEO AI", icon: Sparkles },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings },
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

  const items = navItems;

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
      {/* Mobile/tablet backdrop — hidden from md up */}
      <button
        type="button"
        aria-label="إغلاق القائمة"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "flex w-64 shrink-0 flex-col border-e border-border bg-surface",
          // Desktop/laptop: sticky full-height column so footer stays visible
          "md:sticky md:top-0 md:z-auto md:h-dvh md:max-w-none md:translate-x-0",
          // Mobile: off-canvas drawer (transforms ONLY below md — avoids RTL conflict)
          "fixed inset-y-0 start-0 z-50 h-dvh max-w-[min(85vw,20rem)] transition-transform duration-200 ease-out",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          open
            ? "translate-x-0"
            : "max-md:ltr:-translate-x-full max-md:rtl:translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-4 py-4 sm:px-5 sm:py-5">
          <div className="min-w-0">
            <Link
              to="/admin"
              className="text-lg font-semibold tracking-tight"
              dir="ltr"
              onClick={onClose}
            >
              {SITE_NAME} <span className="text-primary">Admin</span>
            </Link>
            <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-lg text-muted-foreground hover:bg-accent/60 hover:text-foreground md:hidden"
            aria-label="إغلاق القائمة"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-3">
          {items.map(({ to, label, icon: Icon, exact }) => {
            const active = isNavActive(pathname, to, exact);
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-border bg-surface p-3">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          >
            عرض الموقع
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4 rtl-flip" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
