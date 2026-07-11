import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginWithEmail } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { SITE_NAME } from "@/lib/site-config";
import { useAuth } from "@/providers/AuthProvider";

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">جاري التحميل…</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">جاري الدخول للوحة التحكم…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight" dir="ltr">
            {SITE_NAME} <span className="text-primary">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">سجّل الدخول لإدارة موقعك</p>
        </div>

        <form onSubmit={handleSubmit} className="surface-card p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive leading-relaxed">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-start"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">كلمة المرور</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-start"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {loading ? "جاري التحقق…" : "تسجيل الدخول"}
          </button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            <Link to="/" className="hover:text-primary">← العودة للموقع</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
