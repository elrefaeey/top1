import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFirestoreBanner } from "@/components/admin/AdminFirestoreBanner";
import { AdminProviders } from "@/providers/AdminProviders";
import { useAuth } from "@/providers/AuthProvider";
import { SITE_NAME } from "@/lib/site-config";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () =>
    buildPageHead({
      title: "لوحة التحكم",
      description: "إدارة محتوى الموقع",
      path: "/admin",
      noIndex: true,
    }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminProviders>
      <AdminGate />
    </AdminProviders>
  );
}

function AdminGate() {
  const { user, loading, isEditor, refreshUser } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname === "/admin/login";
  const [retrying, setRetrying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      navigate({ to: "/admin/login" });
    }
  }, [user, loading, isLoginPage, navigate]);

  if (isLoginPage) {
    return (
      <div className="admin-shell min-h-dvh">
        <Outlet />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-shell flex min-h-screen flex-col items-center justify-center gap-3">
        <div className="admin-spinner" aria-hidden />
        <div className="text-sm text-[var(--admin-muted)]">جاري التحميل…</div>
      </div>
    );
  }

  if (!user) return null;

  if (!isEditor) {
    async function handleRetry() {
      setRetrying(true);
      try {
        await refreshUser();
      } finally {
        setRetrying(false);
      }
    }

    return (
      <div className="admin-shell flex min-h-screen items-center justify-center p-6">
        <div className="admin-card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold">لا تملك صلاحية الدخول</h1>
          <p className="mt-2 text-sm text-[var(--admin-muted)]">
            حسابك مسجّل في Firebase Auth لكن بدون دور في Firestore. اطلب من مدير النظام إنشاء مستند{" "}
            <code className="rounded bg-[var(--admin-surface-muted)] px-1">users/{"{uid}"}</code>{" "}
            مع الحقل{" "}
            <code className="rounded bg-[var(--admin-surface-muted)] px-1">role: admin</code> أو{" "}
            <code className="rounded bg-[var(--admin-surface-muted)] px-1">editor</code>.
          </p>
          <p className="mt-3 text-xs text-[var(--admin-muted)]">
            إذا استمرت المشكلة: انشر{" "}
            <code className="rounded bg-[var(--admin-surface-muted)] px-1">firestore.rules</code> من
            Firebase Console.
          </p>
          {user && (
            <p className="mt-3 break-all text-xs text-[var(--admin-muted)]" dir="ltr">
              UID: {user.uid}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              disabled={retrying}
              onClick={() => void handleRetry()}
              className="admin-btn admin-btn-primary"
            >
              {retrying ? "جاري التحقق…" : "إعادة التحقق من الصلاحية"}
            </button>
            <button type="button" onClick={() => navigate({ to: "/" })} className="admin-btn admin-btn-ghost">
              العودة للموقع
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell flex min-h-dvh">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-[var(--admin-bg)]">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--admin-border)] bg-[color-mix(in_srgb,var(--admin-surface)_90%,transparent)] px-4 py-3 backdrop-blur pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-[var(--admin-radius)] border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] hover:bg-[var(--admin-surface-muted)]"
            aria-label="فتح القائمة"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight" dir="ltr">
              {SITE_NAME}
            </p>
            <p className="text-[11px] font-medium text-[var(--admin-primary)]">لوحة التحكم</p>
          </div>
        </header>
        <AdminFirestoreBanner />
        <div className="admin-content mx-auto w-full min-w-0 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
