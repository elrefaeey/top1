import { Link, useRouterState } from "@tanstack/react-router";
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

export function AdminSidebar() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-64 flex-col border-e border-border bg-surface">
      <div className="border-b border-border px-5 py-5">
        <Link to="/admin" className="text-lg font-semibold tracking-tight" dir="ltr">
          {SITE_NAME} <span className="text-primary">Admin</span>
        </Link>
        <p className="mt-1 text-xs text-muted-foreground truncate" dir="ltr">{user?.email}</p>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const active = isNavActive(pathname, to, exact);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-1">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground">
          عرض الموقع
        </Link>
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        >
          <LogOut className="h-4 w-4 rtl-flip" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
