import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpLeft, ExternalLink } from "lucide-react";
import { SiteImage } from "@/components/site/SiteImage";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { usePortfolioItem } from "@/hooks/use-cms";
import { portfolioItemSlug } from "@/lib/cms/admin-utils";
import { loadPortfolioItemForSeoFn } from "@/lib/seo/cms-seo.functions";
import { serviceLinksForPortfolio } from "@/lib/seo/internal-links";
import { buildPageHead, buildPortfolioItemHead } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const item = await loadPortfolioItemForSeoFn({ data: { slug: params.slug } });
    return { item };
  },
  head: ({ loaderData, params }) => {
    if (loaderData?.item) {
      return buildPortfolioItemHead(loaderData.item, params.slug);
    }
    return buildPageHead({
      title: `مشروع — ${SITE_NAME}`,
      description: `معرض أعمال ${SITE_NAME}.`,
      path: `/portfolio/${params.slug}`,
    });
  },
  component: PortfolioDetail,
});

function PortfolioDetail() {
  const { slug } = useParams({ from: "/portfolio/$slug" });
  const { item: loaderItem } = Route.useLoaderData();
  const { data: hookItem, isLoading } = usePortfolioItem(slug);
  const item = hookItem ?? loaderItem;

  if (isLoading && !item) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground text-sm">
        جاري تحميل المشروع…
      </div>
    );
  }

  if (!item) {
    return (
      <main className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">المشروع غير موجود</h1>
        <Link to="/portfolio" className="mt-6 inline-flex btn-primary">
          كل الأعمال
        </Link>
      </main>
    );
  }

  const projectSlug = portfolioItemSlug(item);
  const projectUrl = item.url?.trim();
  const serviceLinks = serviceLinksForPortfolio(item);
  const breadcrumbs = [
    { name: "الرئيسية", path: "/" },
    { name: "أعمالنا", path: "/portfolio" },
    { name: item.title, path: `/portfolio/${projectSlug}` },
  ];

  return (
    <article itemScope itemType="https://schema.org/CreativeWork">
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pb-16 pt-6">
          <BreadcrumbNav items={breadcrumbs} className="mb-6" />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {item.imageUrl ? (
              <SiteImage
                src={item.imageUrl}
                alt={`${item.title} — مشروع ${item.category} | ${SITE_NAME}`}
                width={1280}
                height={800}
                fetchPriority="high"
                loading="eager"
                wrapperClassName="order-1 lg:order-2 aspect-[4/3] w-full max-w-xl mx-auto rounded-2xl shadow-[var(--shadow-card-hover)]"
              />
            ) : null}

            <div className="order-2 lg:order-1 max-w-xl">
              <span className="page-intro-eyebrow">{item.category}</span>
              <h1
                className="mt-5 text-3xl md:text-4xl font-bold tracking-tight leading-[1.25]"
                itemProp="name"
              >
                {item.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed" itemProp="description">
                {item.description}
              </p>

              {item.tags.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                {projectUrl ? (
                  <a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    itemProp="url"
                  >
                    الذهاب إلى الموقع
                    <ExternalLink className="h-4 w-4" aria-hidden />
                  </a>
                ) : null}
                <Link to="/contact" className="btn-ghost">
                  تواصل معنا
                  <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {serviceLinks.length > 0 ? (
        <section className="section">
          <div className="container-page max-w-3xl">
            <InternalLinksBlock title="خدمات مرتبطة" links={serviceLinks} />
          </div>
        </section>
      ) : null}

      <section className="section section-compact-top pb-16">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowUpLeft className="h-4 w-4 rtl-flip" aria-hidden />
            العودة إلى الأعمال
          </Link>
          {projectUrl ? (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              زيارة الموقع
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </section>
    </article>
  );
}
