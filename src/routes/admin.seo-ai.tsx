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

export const Route = createFileRoute("/admin/seo-ai")({
  validateSearch: (search: Record<string, unknown>) => ({
    gsc: typeof search.gsc === "string" ? search.gsc : undefined,
    message: typeof search.message === "string" ? search.message : undefined,
  }),
  component: AdminSeoAiPage,
});

async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("يجب تسجيل الدخول");
  return user.getIdToken();
}

function formatPct(ctr: number) {
  return `${(ctr * 100).toFixed(1)}%`;
}

function formatNum(n: number) {
  return Math.round(n).toLocaleString("ar-SA");
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
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 15);
  }, [snapshots]);

  const loadDashboard = useCallback(async () => {
    if (!isEditor) return;
    setLoadingData(true);
    try {
      const token = await getIdToken();
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
        text: err instanceof Error ? err.message : "تعذّر تحميل لوحة SEO AI",
      });
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin, isEditor]);

  useEffect(() => {
    if (search.gsc === "connected") {
      setBanner({ type: "success", text: "تم ربط Google Search Console بنجاح." });
      setConnected(true);
    } else if (search.gsc === "error") {
      setBanner({
        type: "error",
        text: search.message || "فشل ربط Google Search Console",
      });
    }
  }, [search.gsc, search.message]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function handleConnect() {
    setConnecting(true);
    setBanner(null);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/seo/gsc/connect", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { authorizeUrl?: string; error?: string };
      if (!res.ok || !data.authorizeUrl) throw new Error(data.error || "تعذّر بدء الربط");
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
    setSyncMeta(null);
    try {
      const token = await getIdToken();
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
      if (!res.ok) throw new Error(data.error || "فشلت المزامنة");
      setBanner({ type: "success", text: "تمت مزامنة Search Console وتجهيز فرص SEO." });
      setSyncMeta(
        `${data.syncedRows ?? 0} صف · ${data.insightsPrepared ?? 0} فرصة · ${data.periodStart} → ${data.periodEnd}`,
      );
      await loadDashboard();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "فشلت المزامنة",
      });
    } finally {
      setSyncing(false);
    }
  }

  async function handleAnalyze() {
    setAnalyzing(true);
    setBanner(null);
    try {
      const token = await getIdToken();
      const res = await fetch("/api/seo/analyze", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { opportunities?: number; error?: string };
      if (!res.ok) throw new Error(data.error || "فشل التحليل");
      setBanner({
        type: "success",
        text: `تم تحليل فرص SEO: ${data.opportunities ?? 0} فرصة.`,
      });
      await loadDashboard();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "فشل التحليل",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleGenerateDraft(insightId: string) {
    setGeneratingId(insightId);
    setBanner(null);
    try {
      const token = await getIdToken();
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
      if (!res.ok) throw new Error(data.error || "فشل توليد المسودة");
      setBanner({
        type: "success",
        text: `تم إنشاء مسودة draft: ${data.slug ?? ""} — راجعها من المدونة قبل النشر.`,
      });
      await loadDashboard();
    } catch (err) {
      setBanner({
        type: "error",
        text: err instanceof Error ? err.message : "فشل توليد المسودة",
      });
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <div className="p-6 md:p-8">
      <AdminPageHeader
        title="SEO AI"
        description="ربط Search Console، مزامنة الأداء، مراجعة الفرص، ثم نشر المسودات يدوياً."
      />

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
          label="حالة GSC"
          value={connected ? "متصل" : "غير متصل"}
          hint={connectedEmail || siteUrl}
        />
        <StatCard label="صفوف الأداء" value={formatNum(snapshots.length)} hint="gsc_snapshots" />
        <StatCard
          label="فرص بانتظار المراجعة"
          value={formatNum(pendingInsights)}
          hint={`من أصل ${insights.length}`}
        />
        <StatCard label="مسودات المدونة" value={formatNum(drafts.length)} hint="status: draft" />
      </div>

      <AdminCard className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Google Search Console</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {connected
                ? "الحساب مربوط. يمكنك مزامنة آخر 28 يوماً وتحديث الفرص."
                : "اربط حساب Google أولاً لسحب بيانات البحث."}
            </p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {siteUrl}
              {connectedEmail ? ` · ${connectedEmail}` : ""}
            </p>
            {syncMeta && (
              <p className="text-xs text-muted-foreground" dir="ltr">
                آخر مزامنة: {syncMeta}
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
                  {connecting ? "جارٍ التوجيه…" : connected ? "إعادة الربط" : "ربط Search Console"}
                </button>
                <button
                  type="button"
                  className="btn-primary !py-2 !px-3 !text-sm inline-flex items-center gap-2"
                  disabled={syncing || !connected}
                  onClick={() => void handleSync()}
                >
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "جارٍ المزامنة…" : "مزامنة البيانات"}
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">الربط والمزامنة للمدير فقط.</p>
            )}
            {isEditor ? (
              <button
                type="button"
                className="btn-ghost !py-2 !px-3 !text-sm inline-flex items-center gap-2"
                disabled={analyzing || snapshots.length === 0}
                onClick={() => void handleAnalyze()}
              >
                <Lightbulb className={`h-4 w-4 ${analyzing ? "animate-pulse" : ""}`} />
                {analyzing ? "جارٍ التحليل…" : "تحليل الفرص"}
              </button>
            ) : null}
            <button
              type="button"
              className="btn-ghost !py-2 !px-3 !text-sm inline-flex items-center gap-2"
              disabled={loadingData}
              onClick={() => void loadDashboard()}
            >
              <RefreshCw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
              تحديث العرض
            </button>
          </div>
        </div>
      </AdminCard>

      <AdminSection
        title="أداء البحث"
        description="أعلى الاستعلامات حسب الظهور من آخر مزامنة."
      >
        {topSnapshots.length === 0 ? (
          <AdminEmpty message="لا توجد بيانات بعد. اربط GSC ثم اضغط مزامنة." />
        ) : (
          <AdminTableCard>
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">الاستعلام</TableHead>
                  <TableHead className="w-[28%]">الصفحة</TableHead>
                  <TableHead className="w-[11%]">نقرات</TableHead>
                  <TableHead className="w-[11%]">ظهور</TableHead>
                  <TableHead className="w-[11%]">CTR</TableHead>
                  <TableHead className="w-[11%]">ترتيب</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSnapshots.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      <span className="line-clamp-2" title={row.query}>
                        {row.query || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" dir="ltr">
                      <span className="line-clamp-2" title={row.page}>
                        {shortUrl(row.page)}
                      </span>
                    </TableCell>
                    <TableCell>{formatNum(row.clicks)}</TableCell>
                    <TableCell>{formatNum(row.impressions)}</TableCell>
                    <TableCell>{formatPct(row.ctr)}</TableCell>
                    <TableCell>{row.position.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminTableCard>
        )}
      </AdminSection>

      <AdminSection
        title="فرص SEO"
        description="كل بطاقة = فرصة واحدة. راجع التوصية ثم أنشئ مسودة للنشر اليدوي."
      >
        {insights.length === 0 ? (
          <AdminEmpty message="لا توجد فرص بعد. نفّذ مزامنة GSC أو اضغط تحليل الفرص." />
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 25).map((item) => {
              const page = shortUrl(item.page || item.targetPage || "");
              const action =
                item.recommended_action || item.recommendation || item.issue || "—";
              const typeLabel = opportunityTypeLabel(item.type);
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
                        <p className="text-xs text-muted-foreground mb-1">الكلمة المفتاحية</p>
                        <h3 className="text-base font-semibold leading-snug text-foreground">
                          {item.keyword || "—"}
                        </h3>
                        {item.suggested_title ? (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1" title={item.suggested_title}>
                            مقترح العنوان: {item.suggested_title}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <MetaChip label="الترتيب" value={item.currentPosition.toFixed(1)} />
                        <MetaChip label="الظهور" value={formatNum(item.impressions)} />
                        <MetaChip label="CTR" value={formatPct(item.ctr)} />
                        <MetaChip label="الصفحة" value={page || "—"} dir="ltr" />
                      </div>

                      <div className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                        <p className="text-xs font-medium text-muted-foreground mb-1">ماذا تفعل؟</p>
                        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3" title={action}>
                          {simplifyRecommendation(action)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                      <button
                        type="button"
                        className="btn-primary !py-2.5 !px-3 !text-sm inline-flex w-full items-center justify-center gap-2"
                        disabled={generatingId === item.id}
                        onClick={() => void handleGenerateDraft(item.id)}
                      >
                        <Sparkles className="h-4 w-4" />
                        {generatingId === item.id
                          ? "جارٍ التوليد…"
                          : alreadyDrafted
                            ? "إعادة توليد مسودة"
                            : "توليد مسودة AI"}
                      </button>
                      {alreadyDrafted ? (
                        <Link
                          to="/admin/blog"
                          className="text-center text-xs font-medium text-primary hover:underline"
                        >
                          فتح المسودات في المدونة
                        </Link>
                      ) : (
                        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
                          تُحفظ كـ draft فقط — بدون نشر تلقائي
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
        <AdminSection
          title="مسودات المدونة"
          description="مقالات بحالة draft — راجعها وانشرها من المدونة."
        >
          {drafts.length === 0 ? (
            <AdminEmpty
              message="لا توجد مسودات حالياً."
              actionTo="/admin/blog/$id"
              actionParams={{ id: "new" }}
              actionLabel="مقال جديد"
            />
          ) : (
            <AdminTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-end">إجراءات</TableHead>
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
              فتح كل مقالات المدونة
            </Link>
          </div>
        </AdminSection>

        <AdminSection title="سجل الأتمتة" description="آخر إجراءات الربط والمزامنة وإنشاء المسودات.">
          {logs.length === 0 ? (
            <AdminEmpty message="لا يوجد نشاط مسجّل بعد." />
          ) : (
            <AdminTableCard>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الإجراء</TableHead>
                    <TableHead>التفاصيل</TableHead>
                    <TableHead>الوقت</TableHead>
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
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap" dir="ltr">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString("ar-SA") : "—"}
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
        <MiniHint icon={BarChart3} title="Performance" text="بيانات من gsc_snapshots" />
        <MiniHint icon={Lightbulb} title="Opportunities" text="فرص من seo_insights" />
        <MiniHint icon={FileText} title="Drafts" text="نشر يدوي فقط من المدونة" />
        <MiniHint icon={ScrollText} title="Logs" text="تتبع عبر ai_logs" />
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
  const map: Record<string, string> = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    low: "bg-muted text-muted-foreground border-border",
  };
  const labels: Record<string, string> = {
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${map[priority] ?? map.low}`}
    >
      {labels[priority] ?? priority}
    </span>
  );
}

function opportunityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    quick_win: "فرصة سريعة",
    content_opportunity: "فرصة محتوى",
    page_improvement: "تحسين صفحة",
    gsc_opportunity: "فرصة بحث",
  };
  return map[type] || "فرصة SEO";
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
