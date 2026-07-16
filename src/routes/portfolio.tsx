import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { PageIntro } from "@/components/site/SectionIntro";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { usePortfolio } from "@/hooks/use-cms";
import { portfolioItemSlug } from "@/lib/cms/admin-utils";
import { portfolioPageInternalLinks } from "@/lib/seo/internal-links";

import { SITE_NAME } from "@/lib/site-config";

import { loadPortfolioRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildPortfolioListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/portfolio")({
  loader: () => loadPortfolioRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string) === "/portfolio/$slug")) return {};
    if (!loaderData) return {};
    return buildPortfolioListingHead(loaderData);
  },
  component: Portfolio,
});

function Portfolio() {
  const isDetail = useMatch({ from: "/portfolio/$slug", shouldThrow: false });
  const { data: items = [] } = usePortfolio();

  if (isDetail) return <Outlet />;

  return (
    <>
      <PageIntro
        eyebrow="أعمالنا"
        title={
          <>
            مشاريع تصميم مواقع <span className="text-gradient">نفتخر بها.</span>
          </>
        }
        desc="مشاريع حديثة مع علامات وفرق نحب العمل معهم — مواقع، متاجر، وتجربة مستخدم."
      />

      <section className="section">
        <div className="container-page">
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-16 surface-card">
              لا توجد مشاريع منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم.
            </p>
          )}

          {items.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => {
                const slug = portfolioItemSlug(p);
                return (
                  <Link
                    key={p.id}
                    to="/portfolio/$slug"
                    params={{ slug }}
                    className="group card-interactive overflow-hidden block"
                  >
                    {p.imageUrl ? (
                      <SiteImage
                        src={p.imageUrl}
                        alt={`${p.title} — مشروع ${p.category} | ${SITE_NAME}`}
                        overlay
                        sizes="(max-width: 768px) 100vw, 33vw"
                        wrapperClassName="aspect-[4/3] w-full"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-accent grid place-items-center text-muted-foreground text-sm">
                        بدون صورة
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="font-semibold text-base group-hover:text-primary transition-colors">
                            {p.title}
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.category}</p>
                        </div>
                        <ArrowUpLeft className="h-4 w-4 rtl-flip text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {items.length > 0 ? (
            <InternalLinksBlock
              className="mt-12"
              title="روابط مفيدة"
              links={portfolioPageInternalLinks()}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}
