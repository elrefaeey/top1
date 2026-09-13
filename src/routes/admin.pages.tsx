import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ExternalLink, FileText, MapPin, Pencil, Scale, Sparkles } from "lucide-react";
import {
  AdminActionLink,
  AdminCardSection,
  AdminFetchingBar,
  AdminMetaPreview,
  AdminPageHeader,
  AdminRowActions,
  AdminSeoScoreBadge,
  AdminStatusBadge,
  AdminTableCard,
  useAdminChildRoute,
} from "@/components/admin/AdminUi";
import { STATIC_PAGE_SEO } from "@/lib/seo";
import { SEO_LANDING_PAGES } from "@/lib/seo/landing-pages";
import { useAdminPages } from "@/hooks/use-admin-cms";
import type { StaticPageSeoId } from "@/lib/seo/admin-seo-score";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminI18n } from "@/providers/LocaleProvider";
import type { AdminMessages } from "@/lib/i18n/admin-messages";

const STATIC_PAGE_IDS: Array<{
  id: StaticPageSeoId;
  path: string;
  slug: string;
  titleKey: keyof AdminMessages;
}> = [
  { id: "home", path: "/", slug: "home", titleKey: "pageHome" },
  { id: "about", path: "/about", slug: "about", titleKey: "pageAbout" },
  { id: "contact", path: "/contact", slug: "contact", titleKey: "pageContact" },
  { id: "services", path: "/services", slug: "services", titleKey: "services" },
  { id: "portfolio", path: "/portfolio", slug: "portfolio", titleKey: "portfolio" },
  { id: "blog", path: "/blog", slug: "blog", titleKey: "blog" },
];

const OTHER_SITE_PAGE_IDS: Array<{ path: string; slug: string; titleKey: keyof AdminMessages }> = [
  { path: "/privacy", slug: "privacy", titleKey: "pagePrivacy" },
  { path: "/terms", slug: "terms", titleKey: "pageTerms" },
];

const KNOWN_SLUGS = new Set([
  ...STATIC_PAGE_IDS.map((p) => p.slug),
  ...OTHER_SITE_PAGE_IDS.map((p) => p.slug),
  ...SEO_LANDING_PAGES.map((p) => p.slug),
]);

export const Route = createFileRoute("/admin/pages")({
  component: AdminPagesList,
});

function PagePathBadge({ path }: { path: string }) {
  return (
    <code
      className="rounded-md border border-[var(--admin-border,#dde3ec)] bg-[var(--admin-surface-muted,#eef1f6)] px-2 py-0.5 text-[11px] font-medium text-[var(--admin-muted,#5b6b82)]"
      dir="ltr"
    >
      {path}
    </code>
  );
}

function PageListCard({
  title,
  path,
  status,
  meta,
  metaFallback,
  score,
  actions,
  accent = "blue",
}: {
  title: string;
  path: string;
  status: string;
  meta?: string;
  metaFallback?: string;
  score?: ReactNode;
  actions: ReactNode;
  accent?: "blue" | "teal" | "amber" | "violet";
}) {
  const accentBar =
    accent === "teal"
      ? "from-teal-500/80 to-teal-400/20"
      : accent === "amber"
        ? "from-amber-500/80 to-amber-400/20"
        : accent === "violet"
          ? "from-violet-500/80 to-violet-400/20"
          : "from-[var(--admin-primary)]/80 to-[var(--admin-primary)]/15";

  return (
    <div className="admin-card relative overflow-hidden p-4 sm:p-5">
      <div
        className={cn("absolute inset-y-0 start-0 w-1 bg-gradient-to-b", accentBar)}
        aria-hidden
      />
      <div className="flex flex-col gap-4 ps-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--admin-text,#152238)]">{title}</h3>
            <PagePathBadge path={path} />
            <AdminStatusBadge status={status} />
          </div>
          {meta !== undefined || metaFallback ? (
            <AdminMetaPreview text={meta} fallback={metaFallback} />
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-5">
          {score}
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </div>
    </div>
  );
}

function AdminPagesList() {
  const { a, t } = useAdminI18n();
  const isChild = useAdminChildRoute("/admin/pages/$id");
  const { data: cmsPages = [], isFetching } = useAdminPages();

  if (isChild) return <Outlet />;

  const extraPages = cmsPages.filter((p) => !KNOWN_SLUGS.has(p.slug) && !KNOWN_SLUGS.has(p.id));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title={a.pagesTitle}
        description={a.pagesDesc}
        actionTo="/admin/pages/$id"
        actionParams={{ id: "new" }}
        actionLabel={a.pagesNewCms}
      />

      <AdminFetchingBar show={isFetching} />

      <AdminCardSection
        title={a.pagesCoreTitle}
        description={a.pagesCoreDesc}
        tone="blue"
        icon={FileText}
      >
        <div className="space-y-3">
          {STATIC_PAGE_IDS.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.slug || c.slug === p.slug);
            return (
              <PageListCard
                key={p.id}
                title={a[p.titleKey]}
                path={p.path}
                status={cms?.status ?? "published"}
                meta={cms?.metaTitle}
                metaFallback={STATIC_PAGE_SEO[p.id].title}
                score={<AdminSeoScoreBadge pageId={p.id} cms={cms} />}
                accent="blue"
                actions={
                  <>
                    <AdminActionLink href={p.path} label={a.view} icon={ExternalLink} />
                    <Link
                      to="/admin/pages/$id"
                      params={{ id: p.slug }}
                      className="admin-btn admin-btn-primary admin-btn-sm"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {a.editSeo}
                    </Link>
                  </>
                }
              />
            );
          })}
        </div>
      </AdminCardSection>

      <AdminCardSection
        title={a.pagesOtherTitle}
        description={a.pagesOtherDesc}
        tone="amber"
        icon={Scale}
      >
        <div className="space-y-3">
          {OTHER_SITE_PAGE_IDS.map((p) => {
            const cms = cmsPages.find((c) => c.id === p.slug || c.slug === p.slug);
            return (
              <PageListCard
                key={p.slug}
                title={a[p.titleKey]}
                path={p.path}
                status={cms?.status ?? "published"}
                meta={cms?.metaTitle}
                accent="amber"
                actions={
                  <>
                    <AdminActionLink href={p.path} label={a.view} icon={ExternalLink} />
                    {cms ? (
                      <Link
                        to="/admin/pages/$id"
                        params={{ id: cms.id }}
                        className="admin-btn admin-btn-primary admin-btn-sm"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {a.edit}
                      </Link>
                    ) : null}
                  </>
                }
              />
            );
          })}
        </div>
      </AdminCardSection>

      <AdminCardSection
        title={a.pagesLandingsTitle}
        description={t(a.pagesLandingsDesc, { n: SEO_LANDING_PAGES.length })}
        tone="teal"
        icon={MapPin}
      >
        <div className="space-y-3">
          {SEO_LANDING_PAGES.map((p) => (
            <PageListCard
              key={p.slug}
              title={p.title}
              path={p.path}
              status="published"
              meta={p.metaTitle}
              accent="teal"
              actions={<AdminActionLink href={p.path} label={a.view} icon={ExternalLink} />}
            />
          ))}
        </div>
      </AdminCardSection>

      {extraPages.length > 0 && (
        <AdminCardSection
          title={a.pagesExtraTitle}
          description={a.pagesExtraDesc}
          tone="violet"
          icon={Sparkles}
        >
          <AdminTableCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{a.title}</TableHead>
                  <TableHead>{a.slug}</TableHead>
                  <TableHead>{a.status}</TableHead>
                  <TableHead className="text-end">{a.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extraPages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell dir="ltr" className="text-xs text-[var(--admin-muted,#5b6b82)]">
                      {p.slug}
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={p.status} />
                    </TableCell>
                    <TableCell>
                      <AdminRowActions editTo="/admin/pages/$id" editParams={{ id: p.id }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminTableCard>
        </AdminCardSection>
      )}

      <div className="admin-card flex flex-wrap items-center justify-between gap-3 border-[color-mix(in_srgb,var(--admin-primary)_18%,var(--admin-border))] bg-[color-mix(in_srgb,var(--admin-primary)_5%,white)] p-4">
        <p className="text-sm text-[var(--admin-muted,#5b6b82)]">{a.pagesSeoFooter}</p>
        <Link to="/admin/seo" className="admin-btn admin-btn-ghost admin-btn-sm">
          {a.pagesOpenSeo}
        </Link>
      </div>
    </div>
  );
}
