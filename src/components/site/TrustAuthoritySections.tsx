import { Link } from "@tanstack/react-router";
import { BadgeCheck, Users } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAuthors, useSiteStats, useTestimonials } from "@/hooks/use-cms";
import { authorSlug } from "@/lib/cms/admin-utils";
import { SITE_NAME } from "@/lib/site-config";

/** E-E-A-T trust block: team, proof stats, testimonials */
export function TrustAuthoritySections() {
  const { data: authors = [] } = useAuthors();
  const { data: stats = [] } = useSiteStats();
  const { data: testimonials = [] } = useTestimonials();

  const team = authors.slice(0, 4);
  const proofStats = stats.slice(0, 4);
  const quotes = testimonials.slice(0, 3);

  return (
    <>
      {team.length > 0 && (
        <section className="section border-y border-border bg-surface" aria-labelledby="eeat-team">
          <div className="container-page">
            <div className="page-intro-block me-auto w-full text-start">
              <span className="page-intro-eyebrow">
                <Users className="h-3 w-3" /> الخبرة والفريق
              </span>
              <h2 id="eeat-team" className="page-intro-title page-intro-title--section">
                أشخاص حقيقيون خلف النتائج.
              </h2>
              <p className="page-intro-desc mt-3 !max-w-none">
                تعرف على من يخطط وينفّذ مشاريع {SITE_NAME} — شفافية تدعم الثقة وE-E-A-T.
              </p>
            </div>
            <div className="section-body grid gap-4 sm:grid-cols-2">
              {team.map((author, i) => (
                <Reveal key={author.id} delay={i * 60}>
                  <Link
                    to="/authors/$slug"
                    params={{ slug: authorSlug(author) }}
                    className="about-offer-card group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent/40"
                  >
                    <span className="font-semibold tracking-tight group-hover:text-primary">
                      {author.name}
                    </span>
                    <span className="text-sm text-primary">{author.role}</span>
                    <span className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {author.bio}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {proofStats.length > 0 && (
        <section className="section" aria-labelledby="eeat-stats">
          <div className="container-page">
            <div className="page-intro-block me-auto mb-8 w-full text-start">
              <span className="page-intro-eyebrow">
                <BadgeCheck className="h-3 w-3" /> نتائج قابلة للقياس
              </span>
              <h2 id="eeat-stats" className="page-intro-title page-intro-title--section">
                أرقام نعرضها بوضوح.
              </h2>
            </div>
            <div className="stats-band">
              <div className="stats-band-grid">
                {proofStats.map((s) => (
                  <div key={s.id} className="stats-band-item">
                    <div className="stats-band-value">{s.value}</div>
                    <div className="stats-band-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {quotes.length > 0 && (
        <section className="section" aria-labelledby="eeat-quotes">
          <div className="container-page">
            <div className="page-intro-block me-auto mb-8 w-full text-start">
              <span className="page-intro-eyebrow">ثقة العملاء</span>
              <h2 id="eeat-quotes" className="page-intro-title page-intro-title--section">
                ماذا يقول عملاؤنا.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {quotes.map((t) => (
                <blockquote key={t.id} className="surface-card p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">“{t.quote}”</p>
                  <footer className="mt-4 text-sm font-semibold">
                    {t.name}
                    <span className="mt-0.5 block font-normal text-muted-foreground">
                      {t.role}
                      {t.company ? ` — ${t.company}` : ""}
                      {t.city ? ` · ${t.city}` : ""}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
