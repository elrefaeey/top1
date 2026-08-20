import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useServices } from "@/hooks/use-cms";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";
import { ContentError } from "@/components/site/ContentState";
import { PageIntro } from "@/components/site/SectionIntro";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { serviceImage } from "@/lib/site-images";
import { Reveal } from "@/components/site/Reveal";

import { loadServicesRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildServicesListingHead } from "@/lib/seo/static-page-head";
import { servicesPageInternalLinks } from "@/lib/seo/internal-links";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";

export const Route = createFileRoute("/services")({
  loader: () => loadServicesRouteSeoFn(),
  head: ({ loaderData, matches }) => {
    if (matches.some((m) => (m.routeId as string) === "/services/$slug")) return {};
    return buildServicesListingHead(loaderData ?? { cms: null, services: [], faqs: [] });
  },
  component: Services,
});

function Services() {
  const isDetail = useMatch({ from: "/services/$slug", shouldThrow: false });
  const { services: loaderServices = [] } = Route.useLoaderData();
  const { data: queryServices = [], isLoading, isError, isSuccess, refetch } = useServices();
  const services = isSuccess
    ? queryServices
    : loaderServices.length > 0
      ? loaderServices
      : queryServices;

  if (isDetail) return <Outlet />;

  return (
    <>
      {/* ─── Hero ─── */}
      <PageIntro
        eyebrow="الخدمات"
        title={
          <>
            خدمات تصميم مواقع وSEO{" "}
            <span className="text-gradient">للإطلاق والنمو.</span>
          </>
        }
        desc="فريق محترف واحد. مسؤولية كاملة. من أول sketch لآخر dashboard تحليلات."
      />

      <section className="section tone-tinted">
        <div className="container-page">

          {/* States */}
          {isLoading && services.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              جاري تحميل الخدمات…
            </div>
          )}
          {isError && services.length === 0 && (
            <ContentError message="تعذّر تحميل الخدمات." onRetry={() => void refetch()} />
          )}
          {!isLoading && !isError && services.length === 0 && (
            <p className="text-center py-16 text-muted-foreground surface-card rounded-2xl">
              لا توجد خدمات منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم.
            </p>
          )}

          {/* Services grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => {
              const Icon = getServiceIcon(s.icon);
              return (
                <Reveal key={s.slug} delay={idx * 60}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: preferredServiceSlug(s.slug) }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1.5 transition-all duration-300 h-full"
                  >
                    {/* Image */}
                    <div className="overflow-hidden">
                      <SiteImage
                        src={s.imageUrl || serviceImage(s.slug)}
                        alt={`${s.title} — خدمة تصميم وتطوير | Top1Markting`}
                        width={640}
                        height={380}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        wrapperClassName="aspect-[16/9] w-full"
                        className="transition-transform duration-500 group-hover:scale-105 object-cover object-top"
                      />
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Icon + number */}
                      <div className="flex items-center justify-between">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="text-xs font-bold text-muted-foreground/50">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors">
                        {s.title}
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {s.shortDescription}
                      </p>

                      {/* Features — top 3 */}
                      {s.features.length > 0 && (
                        <ul className="flex flex-col gap-1.5 mt-1">
                          {s.features.slice(0, 3).map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA */}
                      <div className="mt-auto pt-3 border-t border-border/50">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          اعرف المزيد
                          <ArrowRight className="h-3.5 w-3.5 rtl-flip group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* CTA strip */}
          {!isLoading && services.length > 0 && (
            <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
              <span className="page-intro-eyebrow mx-auto">
                <Sparkles className="h-3 w-3" /> هل أنت مستعد؟
              </span>
              <h2 className="page-intro-title page-intro-title--section mt-3">
                ابدأ مشروعك اليوم.
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                استشارة مجانية بدون التزام — نرد خلال 24 ساعة.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  تواصل معنا <ArrowRight className="h-4 w-4 rtl-flip" />
                </Link>
                <Link to="/portfolio" className="btn-ghost">
                  شاهد أعمالنا
                </Link>
              </div>
            </div>
          )}

          {/* Internal links */}
          {!isLoading && services.length > 0 && (
            <InternalLinksBlock
              className="mt-10"
              title="استكشف المزيد"
              links={servicesPageInternalLinks(services)}
            />
          )}
        </div>
      </section>
    </>
  );
}
