import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { PageIntro } from "@/components/site/SectionIntro";
import { SeoScreenReaderCopy } from "@/components/seo/SeoScreenReaderCopy";
import { usePortfolio } from "@/hooks/use-cms";
import { portfolioItemSlug } from "@/lib/cms/admin-utils";
import { portfolioPageInternalLinks } from "@/lib/seo/internal-links";

import { SITE_NAME } from "@/lib/site-config";

import { loadPortfolioRouteSeo } from "@/lib/seo/static-page-loaders";
import { buildPortfolioListingHead } from "@/lib/seo/static-page-head";

export const Route = createFileRoute("/portfolio")({
  loader: () => loadPortfolioRouteSeo(),
  head: ({ loaderData }) => buildPortfolioListingHead(loaderData),
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
        title={<>أعمال <span className="text-gradient">نفتخر بها.</span></>}
        desc="مشاريع حديثة مع علامات وفرق نحب العمل معهم."
      />

      {items.length > 0 && (
        <SeoScreenReaderCopy>
          <article>
            <h2>معرض أعمال {SITE_NAME}</h2>
            {items.map((item) => (
              <section key={item.id}>
                <h2>{item.title}</h2>
                <p>{item.category}</p>
                <p>{item.description}</p>
                {item.tags.length > 0 ? <p>{item.tags.join("، ")}</p> : null}
                <p>
                  <Link to="/portfolio/$slug" params={{ slug: portfolioItemSlug(item) }}>
                    تفاصيل المشروع
                  </Link>
                </p>
                {item.url ? (
                  <p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      الذهاب إلى الموقع
                    </a>
                  </p>
                ) : null}
              </section>
            ))}
            <nav aria-label="روابط داخلية لأعمالنا">
              <ul>
                {portfolioPageInternalLinks().map((link) => (
                  <li key={link.href}>
                    <Link to={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <p>
              <Link to="/contact">تواصل معنا</Link>
            </p>
          </article>
        </SeoScreenReaderCopy>
      )}

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
        </div>
      </section>
    </>
  );
}
