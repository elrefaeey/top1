import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminFirestoreBanner } from "@/components/admin/AdminFirestoreBanner";
import { useAuth } from "@/providers/AuthProvider";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user, loading, isEditor, refreshUser } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoginPage = pathname === "/admin/login";
  const [retrying, setRetrying] = useState(false);
  const [bootstrapError, setBootstrapError] = useState("");
  const canAutoBootstrap = Boolean(user?.email);

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
    async function handleRetryBootstrap() {
      setRetrying(true);
      setBootstrapError("");
      try {
        await refreshUser();
      } catch (err) {
        setBootstrapError(err instanceof Error ? err.message : "تعذّر تفعيل الصلاحية");
      } finally {
        setRetrying(false);
      }
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="surface-card max-w-md p-8 text-center">
          <h1 className="text-xl font-bold">لا تملك صلاحية الدخول</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            حسابك مسجّل في Firebase Auth لكن بدون دور في Firestore.
            {canAutoBootstrap
              ? " اضغط الزر أدناه لتفعيل صلاحية الدخول تلقائياً."
              : " أنشئ مستند users/{uid} مع الحقل role: admin أو editor."}
          </p>
          {bootstrapError && (
            <p className="mt-2 text-xs text-destructive">{bootstrapError}</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            إذا استمرت المشكلة: انشر <code className="bg-accent px-1 rounded">firestore.rules</code> من
            Firebase Console، واستخدم الرابط{" "}
            <a href="https://top1-ten.vercel.app/admin" className="text-primary underline">
              top1-ten.vercel.app
            </a>{" "}
            (مش رابط preview).
          </p>
          {user && (
            <p className="mt-3 text-xs text-muted-foreground break-all" dir="ltr">
              UID: {user.uid}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-2">
            {canAutoBootstrap && (
              <button
                type="button"
                disabled={retrying}
                onClick={() => void handleRetryBootstrap()}
                className="btn-primary disabled:opacity-60"
              >
                {retrying ? "جاري التفعيل…" : "تفعيل صلاحية الدخول"}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className={canAutoBootstrap ? "btn-ghost" : "btn-primary"}
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
      <main className="flex-1 overflow-auto">
        <AdminFirestoreBanner />
        <Outlet />
      </main>
    </div>
  );
}
