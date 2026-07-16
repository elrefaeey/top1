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
  LogOut,
  BarChart3,
  X,
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
  { to: "/admin/blog", label: "المدونة", icon: BookOpen },
  { to: "/admin/testimonials", label: "آراء العملاء", icon: MessageSquare },
  { to: "/admin/stats", label: "الإحصائيات", icon: BarChart3 },
  { to: "/admin/faqs", label: "الأسئلة الشائعة", icon: HelpCircle },
  { to: "/admin/seo", label: "SEO", icon: Search },
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

  useEffect(() => {
    onClose?.();
    // Close drawer on route change (mobile)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only pathname
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="إغلاق القائمة"
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "flex h-full w-64 max-w-[85vw] flex-col border-e border-border bg-surface",
          "fixed inset-y-0 start-0 z-50 transition-transform duration-200 ease-out lg:static lg:z-auto lg:max-w-none lg:translate-x-0",
          open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-start justify-between gap-2 border-b border-border px-5 py-5">
          <div className="min-w-0">
            <Link to="/admin" className="text-lg font-semibold tracking-tight" dir="ltr" onClick={onClose}>
              {SITE_NAME} <span className="text-primary">Admin</span>
            </Link>
            <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent/60 hover:text-foreground lg:hidden"
            aria-label="إغلاق القائمة"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map(({ to, label, icon: Icon, exact }) => {
            const active = isNavActive(pathname, to, exact);
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
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

        <div className="space-y-1 border-t border-border p-3">
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
