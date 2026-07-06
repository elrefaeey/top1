import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useServices } from "@/hooks/use-cms";
import { getServiceIcon } from "@/lib/cms/icons";
import { SiteImage } from "@/components/site/SiteImage";
import { PageIntro } from "@/components/site/SectionIntro";
import { serviceImage } from "@/lib/site-images";

import { SITE_NAME } from "@/lib/site-config";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: `الخدمات — ${SITE_NAME}` },
      { name: "description", content: "تصميم مواقع، تطبيقات ويب، SEO، UI/UX وحلول رقمية — فريق محترف لعلامات طموحة." },
      { property: "og:title", content: `الخدمات — ${SITE_NAME}` },
      { property: "og:description", content: "تصميم مواقع، تطبيقات وSEO وحلول رقمية لفرق طموحة." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

function Services() {
  const isDetail = useMatch({ from: "/services/$slug", shouldThrow: false });
  const { data: services = [], isLoading } = useServices();

  if (isDetail) return <Outlet />;

  return (
    <>
      <PageIntro
        eyebrow="الخدمات"
        title={<>كل ما تحتاجه <span className="text-gradient">للإطلاق والنمو.</span></>}
        desc="فريق محترف واحد. مسؤولية كاملة. من أول sketch لآخر dashboard تحليلات."
      />

      <section className="section pt-0">
        <div className="container-page space-y-5">
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground text-sm">جاري تحميل الخدمات…</div>
          )}
          {!isLoading && services.length === 0 && (
            <p className="text-center py-16 text-muted-foreground surface-card">
              لا توجد خدمات منشورة بعد. ستظهر هنا عند إضافتها من لوحة التحكم.
            </p>
          )}
          {services.map((s, idx) => {
            const Icon = getServiceIcon(s.icon);
            const flip = idx % 2 === 1;
            return (
              <article
                key={s.slug}
                className="service-card surface-card overflow-hidden grid gap-0 lg:grid-cols-2 lg:items-stretch transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className={`service-card-body ${flip ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="service-card-icon">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs text-muted-foreground font-medium">
                    خدمة {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-1.5 text-xl md:text-2xl font-bold tracking-tight leading-snug">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{s.shortDescription}</p>
                  <ul className="service-features mt-4 grid gap-3">
                    {s.features.map((f) => (
                      <li key={f} className="service-feature">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="min-w-0">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="mt-4 inline-flex btn-ghost w-fit text-sm py-2">
                    اعرف المزيد <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                  </Link>
                </div>
                <div className={`service-card-media-wrap ${flip ? "lg:order-1" : "lg:order-2"}`}>
                  <SiteImage
                    src={s.imageUrl || serviceImage(s.slug)}
                    alt={s.title}
                    wrapperClassName="service-card-media h-full w-full"
                    className="object-cover object-center"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
