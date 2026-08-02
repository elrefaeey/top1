import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  FileText,
  Lightbulb,
  Link2,
  RefreshCw,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { AdminCard, AdminPageHeader } from "@/components/admin/AdminUi";
import { auth } from "@/lib/firebase/auth";
import { useAuth } from "@/providers/AuthProvider";

export const Route = createFileRoute("/admin/seo-ai")({
  validateSearch: (search: Record<string, unknown>) => ({
    gsc: typeof search.gsc === "string" ? search.gsc : undefined,
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  component: AdminSeoAiPage,
});

async function getAdminIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("يجب تسجيل الدخول");
  return user.getIdToken();
}

function AdminSeoAiPage() {
  const { isAdmin } = useAuth();
  const search = useRouterState({
    select: (s) => s.location.search as { gsc?: string; message?: string },
  });
  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("https://www.top1markting.com/");
  const [statusLoading, setStatusLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
    null,
  );
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    if (!isAdmin) return;
    setStatusLoading(true);
    try {
      const token = await getAdminIdToken();
      const res = await fetch("/api/seo/gsc/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as {
        connected?: boolean;
        connectedEmail?: string | null;
        siteUrl?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "تعذّر التحقق من الحالة");
      setConnected(Boolean(data.connected));
      setConnectedEmail(data.connectedEmail ?? null);
      if (data.siteUrl) setSiteUrl(data.siteUrl);
    } catch (err) {
      setConnected(false);
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "تعذّر التحقق من حالة GSC",
      });
    } finally {
      setStatusLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (search.gsc === "connected") {
      setBanner({ type: "success", text: "Google Search Console Connected" });
      setConnected(true);
    } else if (search.gsc === "error") {
      setBanner({
        type: "error",
        text: search.message || "فشل ربط Google Search Console",
      });
    }
  }, [search.gsc, search.message]);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  async function handleConnect() {
    setConnecting(true);
    setBanner(null);
    try {
      const token = await getAdminIdToken();
      const res = await fetch("/api/seo/gsc/connect", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { authorizeUrl?: string; error?: string };
      if (!res.ok || !data.authorizeUrl) {
        throw new Error(data.error || "تعذّر بدء الربط");
      }
      window.location.href = data.authorizeUrl;
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "تعذّر بدء الربط",
      });
      setConnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setBanner(null);
    setSyncResult(null);
    try {
      const token = await getAdminIdToken();
      const res = await fetch("/api/seo/gsc/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as {
        ok?: boolean;
        syncedRows?: number;
        insightsPrepared?: number;
        periodStart?: string;
        periodEnd?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "فشلت المزامنة");
      setBanner({ type: "success", text: "تمت مزامنة Search Console بنجاح" });
      setSyncResult(
        `${data.syncedRows ?? 0} صف · ${data.insightsPrepared ?? 0} فرصة SEO · ${data.periodStart} → ${data.periodEnd}`,
      );
      await refreshStatus();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "فشلت المزامنة",
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="SEO AI"
        description="GSC → رؤى → مسودات → مراجعة بشرية → نشر. لا يوجد نشر تلقائي."
      />

      {banner && (
        <div
          className={
            banner.type === "success"
              ? "mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800"
              : banner.type === "error"
                ? "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                : "mb-4 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm"
          }
        >
          {banner.text}
        </div>
      )}

      <AdminCard className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Google Search Console</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {connected
                ? "Google Search Console Connected"
                : "اربط حساب Google لسحب أداء البحث (آخر 28 يوماً)."}
            </p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {siteUrl}
              {connectedEmail ? ` · ${connectedEmail}` : ""}
              {statusLoading ? " · …" : ""}
            </p>
            {syncResult && (
              <p className="text-xs text-muted-foreground" dir="ltr">
                Last sync: {syncResult}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  className="btn-ghost !py-2 !px-3 !text-sm inline-flex items-center gap-2"
                  disabled={connecting}
                  onClick={() => void handleConnect()}
                >
                  <Link2 className="h-4 w-4" />
                  {connecting
                    ? "جارٍ التوجيه…"
                    : connected
                      ? "إعادة ربط Google Search Console"
                      : "Connect Google Search Console"}
                </button>
                <button
                  type="button"
                  className="btn-primary !py-2 !px-3 !text-sm inline-flex items-center gap-2"
                  disabled={syncing || !connected}
                  onClick={() => void handleSync()}
                >
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "جارٍ المزامنة…" : "Sync Search Console Data"}
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">ربط GSC متاح لمدير النظام فقط.</p>
            )}
          </div>
        </div>
      </AdminCard>

      <AdminCard className="mb-6 border-primary/20 bg-primary/5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          مسار البيانات:{" "}
          <span dir="ltr" className="text-foreground">
            GSC → gsc_snapshots → seo_insights → create-draft → blog_posts (draft)
          </span>
          . المزامنة تُجهّز فرص SEO بحالة pending دون نشر مقالات.
        </p>
      </AdminCard>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminCard>
          <SectionIcon icon={BarChart3} title="Google Performance" />
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            صفوف الأداء في gsc_snapshots بعد المزامنة (query, page, country, device).
          </p>
          <p className="mt-3 text-xs text-muted-foreground" dir="ltr">
            GET /api/seo/gsc
          </p>
        </AdminCard>

        <AdminCard>
          <SectionIcon icon={Lightbulb} title="SEO Opportunities" />
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            توصيات pending في seo_insights — تُحضَّر تلقائياً بعد المزامنة للمراجعة.
          </p>
          <p className="mt-3 text-xs text-muted-foreground" dir="ltr">
            GET /api/seo/insights
          </p>
        </AdminCard>

        <AdminCard>
          <SectionIcon icon={FileText} title="AI Generated Drafts" />
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            مسودات المدونة بحالة draft فقط — النشر يدوي من لوحة المدونة.
          </p>
          <Link
            to="/admin/blog"
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            فتح المدونة لمراجعة المسودات
          </Link>
        </AdminCard>

        <AdminCard>
          <SectionIcon icon={ScrollText} title="AI Activity Logs" />
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            سجل gsc_connect / gsc_sync في ai_logs.
          </p>
          <p className="mt-3 text-xs text-muted-foreground" dir="ltr">
            collection: ai_logs
          </p>
        </AdminCard>
      </div>
    </div>
  );
}

function SectionIcon({
  icon: Icon,
  title,
}: {
  icon: typeof BarChart3;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  );
}
