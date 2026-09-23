import { createFileRoute, notFound, redirect, useLoaderData, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { useService } from "@/hooks/use-cms";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";
import { LocaleLink } from "@/components/site/LocaleLink";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { InternalLinksBlock } from "@/components/seo/InternalLinksBlock";
import { loadServiceForSeoFn } from "@/lib/seo/cms-seo.functions";
import { footerInternalLinks } from "@/lib/seo/internal-links";
import { getServiceSeoBlock } from "@/lib/seo/service-content";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import { serviceLocationClusterLinks, moneyPageForService } from "@/lib/seo/service-money-pages";
import { buildServiceHead, notFoundHead } from "@/lib/seo";
import { stripHtml } from "@/lib/seo/blog-utils";
import { localizeService } from "@/lib/i18n/localize-cms";
import { SITE_NAME } from "@/lib/site-config";
import { useLocale } from "@/providers/LocaleProvider";

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

const NOINDEX_HEADERS = { "X-Robots-Tag": "noindex, nofollow" };

export const Route = createFileRoute("/services/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/ar/services/${params.slug}`, statusCode: 301 });
  },
});

export function ServiceDetail() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { service: loaderService } = (useLoaderData({ strict: false }) ?? {}) as {
    service?: import("@/types/cms").Service;
  };
  const { data: hookService, isLoading } = useService(slug);
  const { m, t, locale } = useLocale();
  const raw = hookService ?? loaderService;
  const s = raw ? localizeService(raw, locale) : raw;
  const seoBlock = getServiceSeoBlock(slug, locale);

  if (isLoading && !s) {
    return (
      <div className="container-page py-24 text-center text-muted-foreground text-sm">
        {m.serviceDetail.loading}
      </div>
    );
  }
  if (!s) return null;

  const Icon = getServiceIcon(s.icon);
  const deliverables = s.deliverables ?? s.features;
  const process = s.process ?? [];
  const preferred = preferredServiceSlug(slug);
  const moneyPage = moneyPageForService(preferred);
  const locationCluster = serviceLocationClusterLinks(preferred);
  const breadcrumbs = [
    { name: m.nav.home, path: "/" },
    { name: m.nav.services, path: "/services" },
    { name: s.title, path: `/services/${slug}` },
  ];
  const htmlDesc = looksLikeHtml(s.description);
  const cmsParagraphs = s.description
    ? s.description
        .split(/\n\n+/u)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];
  const introParagraphs = htmlDesc
    ? []
    : locale === "en" && cmsParagraphs.length > 0
      ? cmsParagraphs
      : (seoBlock?.intro ?? cmsParagraphs);

  return (
    <article itemScope itemType="https://schema.org/Service">

      {/* ─── Hero ─── */}
      <section className="hero-bg relative overflow-hidden">
        <div className="container-page relative pt-8 pb-14">
          <BreadcrumbNav items={breadcrumbs} className="mb-8" />

          {moneyPage && (
            <p className="mb-5 text-sm text-muted-foreground">
              {m.serviceDetail.moneyBefore}{" "}
              <LocaleLink to={moneyPage} className="font-medium text-primary underline-offset-2 hover:underline">
                {m.serviceDetail.moneyLink}
              </LocaleLink>
              {m.serviceDetail.moneyAfter}
            </p>
          )}

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Image */}
            {s.imageUrl && (
              <SiteImage
                src={s.imageUrl}
                alt={t(m.serviceDetail.imageAlt, { title: s.title, name: SITE_NAME })}
                width={1280}
                height={800}
                fetchPriority="high"
                loading="eager"
                wrapperClassName="order-1 lg:order-2 aspect-[16/9] w-full rounded-2xl border border-border shadow-[var(--shadow-card-hover)] overflow-hidden"
                className="object-cover object-top"
              />
            )}

            {/* Copy */}
            <div className="order-2 lg:order-1">
              {s.tagline && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1 mb-5">
                  <Sparkles className="h-3 w-3" aria-hidden /> {s.tagline}
                </span>
              )}
              <h1
                className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.2]"
                itemProp="name"
              >
                {s.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed" itemProp="description">
                {s.shortDescription || stripHtml(s.description)}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LocaleLink to="/contact" className="btn-primary">
                  {m.common.startProject} <ArrowLeft className="h-4 w-4 rtl-flip" aria-hidden />
                </LocaleLink>
                <LocaleLink to="/portfolio" className="btn-ghost">
                  {m.nav.portfolio}
                </LocaleLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Description ─── */}
      {htmlDesc ? (
        <section className="section">
          <div
            className="container-page max-w-3xl prose-section space-y-4 text-[17px] leading-[1.85] text-foreground/85 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:pe-6 [&_ul]:space-y-2"
            dangerouslySetInnerHTML={{ __html: s.description }}
          />
        </section>
      ) : introParagraphs.length > 0 ? (
        <section className="section">
          <div className="container-page max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">{m.serviceDetail.overview}</h2>
            <div className="space-y-4 text-[17px] leading-[1.85] text-foreground/85">
              {introParagraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ─── Deliverables ─── */}
      <section className="section tone-tinted">
        <div className="container-page">
          <div className="flex items-center gap-4 mb-8">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{m.serviceDetail.deliverables}</h2>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden />
                <span className="text-sm leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Why us ─── */}
      {seoBlock && (
        <section className="section">
          <div className="container-page">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {m.serviceDetail.why}
              </h2>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {seoBlock.whyChooseUs.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary shrink-0" aria-hidden />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ─── Process ─── */}
      {process.length > 0 && (
        <section className="section tone-tinted">
          <div className="container-page">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{m.serviceDetail.process}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{m.serviceDetail.processDesc}</p>
            </div>

            <div
              className={`grid gap-5 relative ${
                process.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-4"
              }`}
            >
              {/* connector line */}
              <div
                aria-hidden
                className="hidden md:block absolute top-11 start-[12%] end-[12%] h-px bg-gradient-to-r from-transparent via-border to-transparent"
              />
              {process.map((p, i) => (
                <div
                  key={p.title}
                  className="relative rounded-2xl border border-border bg-surface p-6 text-center md:text-start hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex justify-center md:justify-start mb-4">
                    <span className="h-11 w-11 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-black shadow-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="font-bold text-base">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAQs ─── */}
      {seoBlock && seoBlock.faqs.length > 0 && (
        <section className="section">
          <div className="container-page max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{m.serviceDetail.faqs}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{m.serviceDetail.faqsDesc}</p>
            </div>
            <FaqAccordion faqs={seoBlock.faqs} />
          </div>
        </section>
      )}

      {/* ─── CTA + Internal links ─── */}
      <section className="section pb-20">
        <div className="container-page">
          <div className="home-cta-block relative text-center mb-12">
            <span className="relative page-intro-eyebrow !border-white/25 !bg-white/15 !text-white mx-auto">
              <Sparkles className="h-3 w-3" /> {m.serviceDetail.ctaEyebrow}
            </span>
            <h2 className="relative mx-auto mt-4 max-w-2xl text-2xl font-bold leading-snug md:text-3xl">
              {m.serviceDetail.ctaTitle}
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-sm text-white/80">
              {m.serviceDetail.ctaDesc}
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <LocaleLink to="/contact" className="btn-primary">
                {m.common.contactUs} <ArrowRight className="h-4 w-4 rtl-flip" />
              </LocaleLink>
              <LocaleLink to="/portfolio" className="btn-ghost">
                {m.common.viewWork}
              </LocaleLink>
            </div>
          </div>

          <InternalLinksBlock
            title={m.serviceDetail.related}
            links={locationCluster}
          />
          <InternalLinksBlock
            title={m.serviceDetail.moreLinks}
            links={footerInternalLinks()}
            className="mt-8"
          />
        </div>
      </section>
    </article>
  );
}

/* ── FAQ Accordion ── */
function FaqAccordion({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
              isOpen
                ? "border-primary/30 bg-surface shadow-sm"
                : "border-border bg-surface hover:border-primary/20"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-sm leading-snug min-w-0">{faq.question}</span>
              <span
                className={`h-6 w-6 rounded-full grid place-items-center shrink-0 transition-all ${
                  isOpen
                    ? "bg-primary text-primary-foreground rotate-180"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-hidden
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
