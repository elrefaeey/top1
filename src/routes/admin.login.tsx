import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LocaleLink } from "@/components/site/LocaleLink";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  FileText,
  Inbox,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { loginWithEmail } from "@/lib/firebase/auth";
import { getAuthErrorMessage } from "@/lib/firebase/auth-errors";
import { SITE_LOGO_MARK_LIGHT_URL, SITE_LOGO_MARK_URL, SITE_NAME } from "@/lib/site-config";
import { useAuth } from "@/providers/AuthProvider";
import { adminInputClass } from "@/components/admin/AdminUi";
import { useAdminI18n } from "@/providers/LocaleProvider";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const { a, locale } = useAdminI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setError(getAuthErrorMessage(err, locale));
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="admin-login-page">
        <div className="flex flex-col items-center gap-3 text-sm text-white/70">
          <div className="admin-spinner" aria-hidden />
          {authLoading ? a.loading : a.loginEntering}
        </div>
      </div>
    );
  }

  const features = [
    { icon: FileText, label: a.loginFeatureContent },
    { icon: Inbox, label: a.loginFeatureLeads },
    { icon: BarChart3, label: a.loginFeatureSeo },
  ];

  return (
    <div className="admin-login-page">
      <div className="admin-login-frame">
        <aside className="admin-login-brand">
          <div className="flex items-center gap-3">
            <img src={SITE_LOGO_MARK_LIGHT_URL} alt="" className="h-11 w-11 rounded-xl object-contain" />
            <span className="text-lg font-bold tracking-tight text-white" dir="ltr">
              {SITE_NAME}
            </span>
          </div>

          <div className="mt-auto">
            <span className="admin-login-pill">{a.loginPanel}</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white">{a.loginBrandTitle}</h2>

            <ul className="mt-8 space-y-3">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="admin-login-feature">
                  <span className="admin-login-feature-icon">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="admin-login-main">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <img src={SITE_LOGO_MARK_URL} alt="" className="admin-login-mobile-logo" />
            <span className="mt-3 text-base font-bold tracking-tight text-[var(--admin-text)]" dir="ltr">
              {SITE_NAME}
            </span>
          </div>

          <h1 className="text-center text-2xl font-bold tracking-tight text-[var(--admin-text)] lg:text-start">
            {a.loginWelcome}
          </h1>
          <p className="mt-1.5 text-center text-sm text-[var(--admin-muted)] lg:text-start">{a.loginSubtitle}</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-[var(--admin-radius)] bg-[color-mix(in_srgb,var(--admin-danger)_10%,white)] px-3 py-2 text-sm leading-relaxed text-[var(--admin-danger)]"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                {a.loginEmail}
              </label>
              <div className="admin-login-field mt-1.5">
                <Mail className="admin-login-field-icon" aria-hidden />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  dir="ltr"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={adminInputClass("text-start")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold">
                {a.loginPassword}
              </label>
              <div className="admin-login-field admin-login-field--toggle mt-1.5">
                <Lock className="admin-login-field-icon" aria-hidden />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  dir="ltr"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={adminInputClass("text-start")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="admin-login-toggle"
                  aria-label={showPassword ? a.loginHidePassword : a.loginShowPassword}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-login-submit w-full">
              {loading ? (
                <>
                  <span className="admin-spinner admin-login-submit-spinner" aria-hidden />
                  {a.loginChecking}
                </>
              ) : (
                <>
                  {a.loginSubmit}
                  <ArrowRight className="h-4 w-4 rtl-flip" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[var(--admin-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--admin-success)]" />
            {a.loginSecureNote}
          </p>

          <div className="mt-6 border-t border-[var(--admin-border)] pt-4 text-center">
            <LocaleLink
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              {a.backToSite}
            </LocaleLink>
          </div>
        </div>
      </div>
    </div>
  );
}
