import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  FileText,
  Lightbulb,
  Link2,
  RefreshCw,
  ScrollText,
  Sparkles,
} from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminFetchingBar,
  AdminPageHeader,
  AdminRowActions,
  AdminSection,
  AdminStatusBadge,
  AdminTableCard,
} from "@/components/admin/AdminUi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminBlogPosts } from "@/hooks/use-admin-cms";
import { auth } from "@/lib/firebase/auth";
import { useAuth } from "@/providers/AuthProvider";
import type { AiLog, GscSnapshot, SeoInsight } from "@/types/seo-automation";
import { useAdminI18n } from "@/providers/LocaleProvider";
import type { AdminMessages } from "@/lib/i18n/admin-messages";

export const Route = createFileRoute("/admin/seo-ai")({
  validateSearch: (search: Record<string, unknown>) => ({
    gsc: typeof search.gsc === "string" ? search.gsc : undefined,
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  component: AdminSeoAiPage,
});

async function getIdToken(mustLogin: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error(mustLogin);
  return user.getIdToken();
}

function formatPct(ctr: number) {
  return `${(ctr * 100).toFixed(1)}%`;
}

function formatNum(n: number, locale: string) {
  return Math.round(n).toLocaleString(locale === "en" ? "en-US" : "ar-SA");
}

function shortUrl(url: string) {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url.length > 60 ? `${url.slice(0, 57)}…` : url;
  }
}

function AdminSeoAiPage() {
  const { a, t, locale } = useAdminI18n();
  const { isAdmin, isEditor } = useAuth();
  const search = useRouterState({
    select: (s) => s.location.search as { gsc?: string; message?: string },
  });
  const { data: blogPosts = [], isFetching: loadingBlog } = useAdminBlogPosts();

  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("https://www.top1markting.com/");
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [banner, setBanner] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [syncMeta, setSyncMeta] = useState<string | null>(null);

  const [snapshots, setSnapshots] = useState<GscSnapshot[]>([]);
  const [insights, setInsights] = useState<SeoInsight[]>([]);
  const [logs, setLogs] = useState<AiLog[]>([]);

  const drafts = useMemo(
    () => blogPosts.filter((p) => p.status === "draft").slice(0, 10),
    [blogPosts],
  );

  const pendingInsights = useMemo(
    () => insights.filter((i) => i.status === "pending").length,
    [insights],
  );

  const topSnapshots = useMemo(() => {
    return [...snapshots]
      .sort((x, y) => y.impressions - x.impressions)
      .slice(0, 15);
  }, [snapshots]);

  const loadDashboard = useCallback(async () => {
    if (!isEditor) return;
    setLoadingData(true);
    try {
      const token = await getIdToken(a.seoAiMustLogin);
      const headers = { Authorization: `Bearer ${token}` };

      const [gscRes, insightsRes, logsRes, statusRes] = await Promise.all([
        fetch("/api/seo/gsc?limit=100", { headers }),
        fetch("/api/seo/insights?limit=50", { headers }),
        fetch("/api/seo/logs?limit=20", { headers }),
        isAdmin
          ? fetch("/api/seo/gsc/status", { headers })
          : Promise.resolve(null),
      ]);

      if (gscRes.ok) {
        const data = (await gscRes.json()) as { snapshots?: GscSnapshot[] };
        setSnapshots(data.snapshots ?? []);
      }
      if (insightsRes.ok) {
        const data = (await insightsRes.json()) as { insights?: SeoInsight[] };
        setInsights(data.insights ?? []);
      }
      if (logsRes.ok) {
        const data = (await logsRes.json()) as { logs?: AiLog[] };
        setLogs(data.logs ?? []);
      }
      if (statusRes?.ok) {
        const data = (await statusRes.json()) as {
          connected?: boolean;
          connectedEmail?: string | null;
          siteUrl?: string;
        };
        setConnected(Boolean(data.connected));
        setConnectedEmail(data.connectedEmail ?? null);
        if (data.siteUrl) setSiteUrl(data.siteUrl);
      }
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : a.seoAiLoadFail,
      });
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, isEditor, a.seoAiMustLogin, a.seoAiLoadFail]);

  useEffect(() => {
    if (search.gsc === "connected") {
      setBanner({ type: "success", text: a.seoAiGscConnected });
      setConnected(true);
    } else if (search.gsc === "error") {
      setBanner({
        type: "error",
        text: search.message || a.seoAiGscFail,
      });
    }
  }, [search.gsc, search.message, a.seoAiGscConnected, a.seoAiGscFail]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function handleConnect() {
    setConnecting(true);
    setBanner(null);
    try {
      const token = await getIdToken(a.seoAiMustLogin);
      const res = await fetch("/api/seo/gsc/connect", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { authorizeUrl?: string; error?: string };
      if (!res.ok || !data.authorizeUrl) throw new Error(data.error || a.seoAiConnectFail);
      window.location.href = data.authorizeUrl;
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : a.seoAiConnectFail,
      });
      setConnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setBanner(null);
    setSyncMeta(null);
    try {
      const token = await getIdToken(a.seoAiMustLogin);
      const res = await fetch("/api/seo/gsc/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as {
        syncedRows?: number;
        insightsPrepared?: number;
        periodStart?: string;
        periodEnd?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || a.seoAiSyncFail);
      setBanner({ type: "success", text: a.seoAiSyncOk });
      setSyncMeta(
        `${data.syncedRows ?? 0} · ${data.insightsPrepared ?? 0} · ${data.periodStart} → ${data.periodEnd}`,
      );
      await loadDashboard();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : a.seoAiSyncFail,
      });
    } finally {
      setSyncing(false);
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setBanner(null);
    try {
      const token = await getIdToken(a.seoAiMustLogin);
      const res = await fetch("/api/seo/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { opportunities?: number; error?: string };
      if (!res.ok) throw new Error(data.error || a.seoAiAnalyzeFail);
      setBanner({
        type: "success",
        text: t(a.seoAiAnalyzeOk, { n: data.opportunities ?? 0 }),
      });
      await loadDashboard();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : a.seoAiAnalyzeFail,
      });
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleGenerateDraft(insightId: string) {
    setGeneratingId(insightId);
    setBanner(null);
    try {
      const token = await getIdToken(a.seoAiMustLogin);
      const res = await fetch("/api/seo/generate-draft", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ insightId }),
      });
      const data = (await res.json()) as {
        slug?: string;
        status?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || a.seoAiDraftFail);
      setBanner({
        type: "success",
        text: t(a.seoAiDraftOk, { slug: data.slug ?? "" }),
      });
      await loadDashboard();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : a.seoAiDraftFail,
      });
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <div>
      <AdminPageHeader title={a.seoAi} description={a.seoAiDesc} />

      <AdminFetchingBar show={loadingData || loadingBlog || syncing || analyzing || Boolean(generatingId)} />

      {banner && (
        <div
          className={
            banner.type === "success"
              ? "mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800"
              : "mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          }
        >
          {banner.text}
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={a.seoAiStatGsc}
          value={connected ? a.seoAiConnected : a.seoAiDisconnected}
          hint={connectedEmail || siteUrl}
        />
        <StatCard
          label={a.seoAiPerfRows}
          value={formatNum(snapshots.length, locale)}
          hint="gsc_snapshots"
        />
        <StatCard
          label={a.seoAiPendingOpps}
          value={formatNum(pendingInsights, locale)}
          hint={t(a.seoAiOfTotal, { n: insights.length })}
        />
        <StatCard
          label={a.seoAiBlogDrafts}
          value={formatNum(drafts.length, locale)}
          hint="status: draft"
        />
      </div>

      <AdminCard className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Google Search Console</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {connected ? a.seoAiGscCardDescConnected : a.seoAiGscCardDescDisconnected}
            </p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {siteUrl}
              {connectedEmail ? ` · ${connectedEmail}` : ""}
            </p>
            {syncMeta && (
              <p className="text-xs text-muted-foreground" dir="ltr">
                {t(a.seoAiLastSync, { meta: syncMeta })}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm inline-flex items-center gap-2"
                  disabled={connecting}
                  onClick={() => void handleConnect()}
                >
                  <Link2 className="h-4 w-4" />
                  {connecting
                    ? a.seoAiRedirecting
                    : connected
                      ? a.seoAiReconnect
                      : a.seoAiConnect}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm inline-flex items-center gap-2"
                  disabled={syncing || !connected}
                  onClick={() => void handleSync()}
                >
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? a.seoAiSyncing : a.seoAiSync}
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{a.seoAiAdminOnly}</p>
            )}
            {isEditor ? (
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm inline-flex items-center gap-2"
                disabled={analyzing || snapshots.length === 0}
                onClick={() => void handleAnalyze()}
              >
                <Lightbulb className={`h-4 w-4 ${analyzing ? "animate-pulse" : ""}`} />
                {analyzing ? a.seoAiAnalyzing : a.seoAiAnalyze}
              </button>
            ) : null}
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm inline-flex items-center gap-2"
              disabled={loadingData}
              onClick={() => void loadDashboard()}
            >
              <RefreshCw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
              {a.seoAiRefresh}
            </button>
          </div>
        </div>
      </AdminCard>

      <AdminSection title={a.seoAiPerfTitle} description={a.seoAiPerfDesc}>
        {topSnapshots.length === 0 ? (
          <AdminEmpty message={a.seoAiPerfEmpty} />
        ) : (
          <AdminTableCard>
            <Table className="min-w-[40rem]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">{a.seoAiColQuery}</TableHead>
                  <TableHead className="w-[28%]">{a.seoAiColPage}</TableHead>
                  <TableHead className="w-[11%]">{a.seoAiColClicks}</TableHead>
                  <TableHead className="w-[11%]">{a.seoAiColImpressions}</TableHead>
                  <TableHead className="w-[11%]">{a.seoAiColCtr}</TableHead>
                  <TableHead className="w-[11%]">{a.seoAiColPosition}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSnapshots.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      <span className="line-clamp-2" title={row.query}>
                        {row.query || a.emDash}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" dir="ltr">
                      <span className="line-clamp-2" title={row.page}>
                        {shortUrl(row.page)}
                      </span>
                    </TableCell>
                    <TableCell>{formatNum(row.clicks, locale)}</TableCell>
                    <TableCell>{formatNum(row.impressions, locale)}</TableCell>
                    <TableCell>{formatPct(row.ctr)}</TableCell>
                    <TableCell>{row.position.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminTableCard>
        )}
      </AdminSection>

      <AdminSection title={a.seoAiOppsTitle} description={a.seoAiOppsDesc}>
        {insights.length === 0 ? (
          <AdminEmpty message={a.seoAiOppsEmpty} />
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 25).map((item) => {
              const page = shortUrl(item.page || item.targetPage || "");
              const action =
                item.recommended_action || item.recommendation || item.issue || a.emDash;
              const typeLabel = opportunityTypeLabel(item.type, a);
              const alreadyDrafted = item.status === "reviewed" || item.status === "completed";

              return (
                <AdminCard key={item.id} className="!p-4 sm:!p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityBadge priority={item.priority} />
                        <span className="inline-flex rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                          {typeLabel}
                        </span>
                        <AdminStatusBadge status={item.status} />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{a.seoAiKeyword}</p>
                        <h3 className="text-base font-semibold leading-snug text-foreground">
                          {item.keyword || a.emDash}
                        </h3>
                        {item.suggested_title ? (
                          <p
                            className="mt-1 text-sm text-muted-foreground line-clamp-1"
                            title={item.suggested_title}
                          >
                            {t(a.seoAiSuggestedTitle, { title: item.suggested_title })}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <MetaChip label={a.order} value={item.currentPosition.toFixed(1)} />
                        <MetaChip
                          label={a.seoAiColImpressions}
                          value={formatNum(item.impressions, locale)}
                        />
                        <MetaChip label={a.seoAiColCtr} value={formatPct(item.ctr)} />
                        <MetaChip label={a.seoAiColPage} value={page || a.emDash} dir="ltr" />
                      </div>

                      <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {a.seoAiWhatToDo}
                        </p>
                        <p
                          className="text-sm leading-relaxed text-foreground/90 line-clamp-3"
                          title={action}
                        >
                          {simplifyRecommendation(action)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary admin-btn-sm inline-flex w-full items-center justify-center gap-2"
                        disabled={generatingId === item.id}
                        onClick={() => void handleGenerateDraft(item.id)}
                      >
                        <Sparkles className="h-4 w-4" />
                        {generatingId === item.id
                          ? a.seoAiGenerating
                          : alreadyDrafted
                            ? a.seoAiRegenDraft
                            : a.seoAiGenDraft}
                      </button>
                      {alreadyDrafted ? (
                        <Link
                          to="/admin/blog"
                          className="text-center text-xs font-medium text-primary hover:underline"
                        >
                          {a.seoAiOpenDrafts}
                        </Link>
                      ) : (
                        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                          {a.seoAiDraftOnly}
                        </p>
                      )}
                    </div>
                  </div>
                </AdminCard>
              );
            })}
          </div>
        )}
      </AdminSection>

      <div className="grid gap-8 lg:grid-cols-2">
        <AdminSection title={a.seoAiBlogDrafts} description={a.seoAiDraftsDesc}>
          {drafts.length === 0 ? (
            <AdminEmpty
              message={a.seoAiNoDrafts}
              actionTo="/admin/blog/$id"
              actionParams={{ id: "new" }}
              actionLabel={a.blogNew}
            />
          ) : (
            <AdminTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{a.title}</TableHead>
                    <TableHead>{a.status}</TableHead>
                    <TableHead className="text-end">{a.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drafts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <span className="line-clamp-2">{post.title}</span>
                      </TableCell>
                      <TableCell>
                        <AdminStatusBadge status={post.status} />
                      </TableCell>
                      <TableCell>
                        <AdminRowActions editTo="/admin/blog/$id" editParams={{ id: post.id }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AdminTableCard>
          )}
          <div className="mt-3">
            <Link to="/admin/blog" className="text-sm font-medium text-primary hover:underline">
              {a.seoAiOpenAllBlog}
            </Link>
          </div>
        </AdminSection>

        <AdminSection title={a.seoAiLogsTitle} description={a.seoAiLogsDesc}>
          {logs.length === 0 ? (
            <AdminEmpty message={a.seoAiLogsEmpty} />
          ) : (
            <AdminTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{a.seoAiColAction}</TableHead>
                    <TableHead>{a.seoAiColDetails}</TableHead>
                    <TableHead>{a.seoAiColTime}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium whitespace-nowrap" dir="ltr">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <span className="line-clamp-2">{log.description}</span>
                      </TableCell>
                      <TableCell
                        className="text-xs text-muted-foreground whitespace-nowrap"
                        dir="ltr"
                      >
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString(
                              locale === "en" ? "en-GB" : "ar-SA",
                            )
                          : a.emDash}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AdminTableCard>
          )}
        </AdminSection>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <MiniHint icon={BarChart3} title="Performance" text={a.seoAiHintPerf} />
        <MiniHint icon={Lightbulb} title="Opportunities" text={a.seoAiHintOpps} />
        <MiniHint icon={FileText} title="Drafts" text={a.seoAiHintDrafts} />
        <MiniHint icon={ScrollText} title="Logs" text={a.seoAiHintLogs} />
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <AdminCard className="!p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      {hint ? (
        <p className="mt-1 truncate text-xs text-muted-foreground" dir="ltr" title={hint}>
          {hint}
        </p>
      ) : null}
    </AdminCard>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const { a } = useAdminI18n();
  const map: Record<string, string> = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    low: "bg-muted text-muted-foreground border-border",
  };
  const labels: Record<string, string> = {
    high: a.priorityHigh,
    medium: a.priorityMedium,
    low: a.priorityLow,
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${map[priority] ?? map.low}`}
    >
      {labels[priority] ?? priority}
    </span>
  );
}

function opportunityTypeLabel(type: string, a: AdminMessages): string {
  const map: Record<string, string> = {
    quick_win: a.oppQuickWin,
    content_opportunity: a.oppContent,
    page_improvement: a.oppPage,
    gsc_opportunity: a.oppGsc,
  };
  return map[type] || a.oppDefault;
}

function simplifyRecommendation(text: string): string {
  return text
    .replace(/\s*·\s*/g, "، ")
    .replace(/\s+/g, " ")
    .trim();
}

function MetaChip({
  label,
  value,
  dir,
}: {
  label: string;
  value: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="min-w-0">
      <span className="text-xs text-muted-foreground">{label}: </span>
      <span className="font-medium text-foreground" dir={dir} title={value}>
        {value}
      </span>
    </div>
  );
}

function MiniHint({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof BarChart3;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
