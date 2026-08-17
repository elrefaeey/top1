import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginWithEmail } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { SITE_NAME } from "@/lib/site-config";
import { useAuth } from "@/providers/AuthProvider";
import { adminInputClass } from "@/components/admin/AdminUi";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/admin" });
    }
  }, [user, authLoading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      navigate({ to: "/admin" });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="admin-login-page">
        <div className="text-sm text-[var(--admin-muted,#5b6b82)]">جاري التحميل…</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="admin-login-page">
        <div className="text-sm text-[var(--admin-muted,#5b6b82)]">جاري الدخول للوحة التحكم…</div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--admin-text,#152238)]" dir="ltr">
            {SITE_NAME} <span className="text-[var(--admin-primary,#1149b0)]">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--admin-muted,#5b6b82)]">سجّل الدخول لإدارة موقعك</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card space-y-4 p-6 sm:p-7">
          {error && (
            <div className="rounded-[var(--admin-radius,0.625rem)] bg-destructive/10 px-3 py-2 text-sm leading-relaxed text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              البريد الإلكتروني
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={adminInputClass("mt-1.5 text-start")}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold">
              كلمة المرور
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adminInputClass("mt-1.5 text-start")}
            />
          </div>

          <button type="submit" disabled={loading} className="admin-btn admin-btn-primary w-full">
            {loading ? "جاري التحقق…" : "تسجيل الدخول"}
          </button>

          <p className="pt-1 text-center text-xs text-[var(--admin-muted,#5b6b82)]">
            <Link to="/" className="hover:text-[var(--admin-primary,#1149b0)]">
              ← العودة للموقع
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
