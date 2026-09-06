import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginWithEmail } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { SITE_LOGO_URL, SITE_NAME } from "@/lib/site-config";
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
        <div className="flex flex-col items-center gap-3 text-sm text-white/70">
          <div className="admin-spinner" aria-hidden />
          جاري التحميل…
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="admin-login-page">
        <div className="flex flex-col items-center gap-3 text-sm text-white/70">
          <div className="admin-spinner" aria-hidden />
          جاري الدخول للوحة التحكم…
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <img src={SITE_LOGO_URL} alt="" className="mx-auto h-12 w-12 rounded-xl object-contain" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white" dir="ltr">
            {SITE_NAME}
          </h1>
          <p className="mt-1.5 text-sm text-[var(--admin-accent,#c4a035)]">لوحة التحكم</p>
          <p className="mt-2 text-sm text-white/65">سجّل الدخول لإدارة محتوى الموقع</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card space-y-4 p-6 sm:p-7">
          {error && (
            <div className="rounded-[var(--admin-radius)] bg-[color-mix(in_srgb,var(--admin-danger)_10%,white)] px-3 py-2 text-sm leading-relaxed text-[var(--admin-danger)]">
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

          <p className="pt-1 text-center text-xs text-[var(--admin-muted)]">
            <Link to="/" className="hover:text-[var(--admin-primary)]">
              ← العودة للموقع
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
