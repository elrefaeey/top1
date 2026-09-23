import { createFileRoute, Outlet, useLoaderData, useRouterState, redirect } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Rocket,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useMemo } from "react";
import { useServices } from "@/hooks/use-cms";
import { localizeService } from "@/lib/i18n/localize-cms";
import { stripLocalePrefix } from "@/lib/i18n/locale-path";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";
import { LocaleLink } from "@/components/site/LocaleLink";
import { ContentError } from "@/components/site/ContentState";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { serviceImage } from "@/lib/site-images";
import { Reveal } from "@/components/site/Reveal";
import { loadServicesRouteSeoFn } from "@/lib/seo/cms-seo.functions";
import { buildServicesListingHead } from "@/lib/seo/static-page-head";
import { servicesPageInternalLinks } from "@/lib/seo/internal-links";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import { useLocale } from "@/providers/LocaleProvider";
import { SITE_NAME } from "@/lib/site-config";
import type { Service, WithId } from "@/types/cms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  beforeLoad: () => {
    throw redirect({ href: "/ar/services", statusCode: 301 });
  },
});

function serviceHref(slug: string) {
  return preferredServiceSlug(slug);
}

function ServiceCard({
  service,
  index,
  featured = false,
}: {
  service: WithId<Service>;
  index: number;
  featured?: boolean;
}) {
  const { m, t } = useLocale();
  const Icon = getServiceIcon(service.icon);
  const imageSrc = service.imageUrl || serviceImage(service.slug);
  const features = service.features.slice(0, featured ? 5 : 3);

  return (
    <LocaleLink
      to="/services/$slug"
      params={{ slug: serviceHref(service.slug) }}
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
        featured
          ? "grid h-full lg:grid-cols-2"
          : "flex h-full flex-col",
      )}
    >
      <div className={cn("relative overflow-hidden", featured && "lg:order-2")}>
        <SiteImage
          src={imageSrc}
          alt={t(m.servicesPage.imageAlt, { title: service.title, name: SITE_NAME })}
          overlay
          width={featured ? 1200 : 640}
          height={featured ? 800 : 380}
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          wrapperClassName={
            featured ? "aspect-[16/10] w-full lg:h-full lg:min-h-full" : "aspect-[16/9] w-full"
          }
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {featured ? (
          <span className="absolute top-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-background/92 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3 w-3" aria-hidden />
            {m.servicesPage.featured}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col",
          featured ? "justify-center gap-4 p-6 md:p-8 lg:p-10" : "gap-3 p-5",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-xs font-bold tabular-nums text-muted-foreground/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {service.tagline ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
            {service.tagline}
          </p>
        ) : null}

        <h2
          className={cn(
            "font-bold leading-snug transition-colors group-hover:text-primary",
            featured ? "text-xl md:text-2xl" : "text-base",
          )}
        >
          {service.title}
        </h2>

        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            featured ? "line-clamp-4" : "line-clamp-2",
          )}
        >
          {service.shortDescription}
        </p>

        {features.length > 0 ? (
          <ul className={cn("flex flex-col gap-1.5", featured ? "mt-1" : "mt-0.5")}>
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground sm:text-sm">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                <span className={featured ? "line-clamp-2" : "line-clamp-1"}>{f}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto border-t border-border/50 pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary sm:text-sm">
            {m.common.learnMore}
            <ArrowRight className="h-3.5 w-3.5 rtl-flip transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </LocaleLink>
  );
}

export function Services() {
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const basePath = stripLocalePrefix(pathname);
  const isDetail = basePath.startsWith("/services/") && basePath !== "/services";
  const { services: loaderServices = [] } = (useLoaderData({ strict: false }) ?? {}) as {
    services?: Awaited<ReturnType<typeof loadServicesRouteSeoFn>>["services"];
  };
  const { data: queryServices = [], isLoading, isError, isSuccess, refetch } = useServices();
  const { m, t, locale } = useLocale();
  const rawServices = isSuccess
    ? queryServices
    : loaderServices.length > 0
      ? loaderServices
      : queryServices;
  const services = useMemo(
    () => rawServices.map((item) => localizeService(item, locale)),
    [rawServices, locale],
  );

  const featured = services.length > 1 ? services[0]! : null;
  const gridServices = featured ? services.slice(1) : services;

  const howSteps = [
    { icon: Compass, title: m.servicesPage.how1t, desc: m.servicesPage.how1d },
    { icon: Workflow, title: m.servicesPage.how2t, desc: m.servicesPage.how2d },
    { icon: Rocket, title: m.servicesPage.how3t, desc: m.servicesPage.how3d },
  ];

  if (isDetail) return <Outlet />;

  return (
    <>
      <section className="page-intro hero-bg">
        <div className="container-page page-intro-inner page-intro-center page-intro-block">
          <span className="page-intro-eyebrow">{m.servicesPage.eyebrow}</span>
          <h1 className="page-intro-title">
            {m.servicesPage.titleBefore}
            <span className="text-gradient">{m.servicesPage.titleGradient}</span>
          </h1>
          <p className="page-intro-desc">{m.servicesPage.desc}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <LocaleLink to="/contact" className="btn-primary">
              {m.common.startProject} <ArrowRight className="h-4 w-4 rtl-flip" />
            </LocaleLink>
            <LocaleLink to="/portfolio" className="btn-ghost">
              {m.common.viewWork}
            </LocaleLink>
          </div>
        </div>
      </section>

      <section className="section tone-tinted">
        <div className="container-page">
          {isLoading && services.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {m.servicesPage.loading}
            </div>
          )}
          {isError && services.length === 0 && (
            <ContentError message={m.servicesPage.fail} onRetry={() => void refetch()} />
          )}
          {!isLoading && !isError && services.length === 0 && (
            <p className="surface-card rounded-2xl py-16 text-center text-muted-foreground">
              {m.servicesPage.empty}
            </p>
          )}

          {services.length > 0 ? (
            <>
              <Reveal className="mb-8 me-auto w-full max-w-2xl text-start">
                <span className="page-intro-eyebrow">{m.servicesPage.listEyebrow}</span>
                <h2 className="page-intro-title page-intro-title--section mt-2">
                  {m.servicesPage.listTitle}
                </h2>
              </Reveal>

              {featured ? (
                <Reveal className="mb-6">
                  <ServiceCard service={featured} index={0} featured />
                </Reveal>
              ) : null}

              {gridServices.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gridServices.map((s, idx) => (
                    <Reveal key={s.id || s.slug} delay={idx * 60} className="h-full">
                      <ServiceCard
                        service={s}
                        index={featured ? idx + 1 : idx}
                      />
                    </Reveal>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      {services.length > 0 ? (
        <section className="section">
          <div className="container-page">
            <Reveal>
              <div className="page-intro-block page-intro-center mx-auto mb-10 max-w-2xl">
                <span className="page-intro-eyebrow">{m.servicesPage.howEyebrow}</span>
                <h2 className="page-intro-title page-intro-title--section">
                  {m.servicesPage.howTitle}
                </h2>
              </div>
            </Reveal>
            <div className="process-rail process-rail--3">
              {howSteps.map(({ icon: StepIcon, title, desc }, i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="process-step process-step--rich h-full">
                    <span className="process-num" aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="process-step-icon" aria-hidden>
                      <StepIcon className="h-5 w-5" />
                    </span>
                    <h3 className="text-base font-bold tracking-tight md:text-lg">{title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!isLoading && services.length > 0 ? (
        <section className="section tone-tinted">
          <div className="container-page">
            <Reveal>
              <div className="home-cta-block">
                <span className="relative z-[1] inline-flex items-center gap-1.5 text-sm font-semibold text-white/85">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  {m.common.ready}
                </span>
                <h2 className="relative z-[1] mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {m.servicesPage.ctaTitle}
                </h2>
                <p className="relative z-[1] mx-auto mt-2 max-w-md text-sm text-white/75">
                  {m.common.freeConsult}
                </p>
                <div className="relative z-[1] mt-7 flex flex-wrap justify-center gap-3">
                  <LocaleLink to="/contact" className="btn-primary">
                    {m.common.contactUs} <ArrowRight className="h-4 w-4 rtl-flip" />
                  </LocaleLink>
                  <LocaleLink to="/portfolio" className="btn-ghost">
                    {m.common.viewWork}
                  </LocaleLink>
                </div>
              </div>
            </Reveal>

            <InternalLinksBlock
              className="mt-10"
              title={m.common.exploreMore}
              links={servicesPageInternalLinks(services)}
            />
          </div>
        </section>
      ) : null}
    </>
  );
}
