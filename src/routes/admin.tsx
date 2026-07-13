import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFirestoreBanner } from "@/components/admin/AdminFirestoreBanner";
import { AdminProviders } from "@/providers/AdminProviders";
import { useAuth } from "@/providers/AuthProvider";
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

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      navigate({ to: "/admin/login" });
    }
  }, [user, loading, isLoginPage, navigate]);

  if (isLoginPage) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">جاري التحميل…</div>
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
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="surface-card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold">لا تملك صلاحية الدخول</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            حسابك مسجّل في Firebase Auth لكن بدون دور في Firestore. اطلب من مدير النظام إنشاء
            مستند <code className="bg-accent px-1 rounded">users/{"{uid}"}</code> مع الحقل{" "}
            <code className="bg-accent px-1 rounded">role: admin</code> أو{" "}
            <code className="bg-accent px-1 rounded">editor</code>.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            إذا استمرت المشكلة: انشر <code className="bg-accent px-1 rounded">firestore.rules</code> من
            Firebase Console.
          </p>
          {user && (
            <p className="mt-3 text-xs text-muted-foreground break-all" dir="ltr">
              UID: {user.uid}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              disabled={retrying}
              onClick={() => void handleRetry()}
              className="btn-primary disabled:opacity-60"
            >
              {retrying ? "جاري التحقق…" : "إعادة التحقق من الصلاحية"}
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="btn-ghost"
            >
              العودة للموقع
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-muted/30">
        <AdminFirestoreBanner />
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
