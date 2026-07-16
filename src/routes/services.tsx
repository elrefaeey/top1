import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useServices } from "@/hooks/use-cms";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";
import { ContentError } from "@/components/site/ContentState";
import { PageIntro } from "@/components/site/SectionIntro";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { serviceImage } from "@/lib/site-images";

import { loadServicesRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildServicesListingHead } from "@/lib/seo/static-page-head";
import { servicesPageInternalLinks } from "@/lib/seo/internal-links";

export const Route = createFileRoute("/services")({
  loader: () => loadServicesRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string) === "/services/$slug")) return {};
    if (!loaderData) return {};
    return buildServicesListingHead(loaderData);
  },
  component: Services,
});

function Services() {
  const isDetail = useMatch({ from: "/services/$slug", shouldThrow: false });
  const { data: services = [], isLoading, isError, refetch } = useServices();

  if (isDetail) return <Outlet />;

  return (
    <>
      <PageIntro
        eyebrow="الخدمات"
        title={
          <>
            خدمات تصميم مواقع وSEO <span className="text-gradient">للإطلاق والنمو.</span>
          </>
        }
        desc="فريق محترف واحد. مسؤولية كاملة. من أول sketch لآخر dashboard تحليلات."
      />

      <section className="section">
        <div className="container-page space-y-8">
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              جاري تحميل الخدمات…
            </div>
          )}
          {isError && (
            <ContentError message="تعذّر تحميل الخدمات." onRetry={() => void refetch()} />
          )}
          {!isLoading && !isError && services.length === 0 && (
            <p className="text-center py-16 text-muted-foreground surface-card">
              لا توجد خدمات منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم.
            </p>
          )}
          {services.map((s, idx) => {
            const Icon = getServiceIcon(s.icon);
            const flip = idx % 2 === 1;
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="service-card surface-card overflow-hidden grid gap-0 lg:grid-cols-2 lg:items-stretch transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className={`service-card-body ${flip ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="service-card-icon">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">
                    خدمة {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-1.5 text-xl md:text-2xl font-bold tracking-tight leading-snug">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {s.shortDescription}
                  </p>
                  <ul className="service-features mt-4 grid gap-3">
                    {s.features.map((f) => (
                      <li key={f} className="service-feature">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="min-w-0">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 inline-flex btn-ghost w-fit text-sm py-2 pointer-events-none">
                    اعرف المزيد <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                  </span>
                </div>
                <div className={`service-card-media-wrap ${flip ? "lg:order-1" : "lg:order-2"}`}>
                  <SiteImage
                    src={s.imageUrl || serviceImage(s.slug)}
                    alt={`${s.title} — خدمة تصميم وتطوير | Top1Markting`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    wrapperClassName="service-card-media h-full w-full"
                    className="object-cover object-center"
                  />
                </div>
              </Link>
            );
          })}

          {!isLoading && services.length > 0 ? (
            <InternalLinksBlock
              className="pt-4"
              title="استكشف المزيد"
              links={servicesPageInternalLinks(services)}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}
