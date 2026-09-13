import { Link } from "@tanstack/react-router";
import { BadgeCheck, Users, MessageSquare, Star, Quote } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAuthors, useSiteStats, useTestimonials } from "@/hooks/use-cms";
import { authorSlug } from "@/lib/cms/admin-utils";
import { SITE_NAME } from "@/lib/site-config";
import { useLocale } from "@/providers/LocaleProvider";

/** E-E-A-T trust block: team, proof stats, testimonials */
export function TrustAuthoritySections() {
  const { data: authors = [] } = useAuthors();
  const { data: stats = [] } = useSiteStats();
  const { data: testimonials = [] } = useTestimonials();
  const { m, t } = useLocale();

  const team = authors.slice(0, 4);
  const proofStats = stats.slice(0, 4);
  const quotes = testimonials.slice(0, 3);

  return (
    <>
      {team.length > 0 && (
        <section className="section" aria-labelledby="eeat-team">
          <div className="container-page">
            <div className="page-intro-block me-auto w-full text-start">
              <span className="page-intro-eyebrow">
                <Users className="h-3 w-3" /> {m.about.teamEyebrow}
              </span>
              <h2 id="eeat-team" className="page-intro-title page-intro-title--section">
                {m.about.teamTitle}
              </h2>

            </div>
            <div className="section-body grid gap-4 sm:grid-cols-2">
              {team.map((author, i) => (
                <Reveal key={author.id} delay={i * 60}>
                  <Link
                    to="/authors/$slug"
                    params={{ slug: authorSlug(author) }}
                    className="about-offer-card group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/30 hover:bg-accent/40"
                  >
                    <div className="flex items-center gap-3">
                      {author.avatarUrl && !author.avatarUrl.startsWith("data:") ? (
                        <img
                          src={author.avatarUrl}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/15"
                        />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {author.name.trim().slice(0, 1)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <span className="block font-semibold tracking-tight group-hover:text-primary">
                          {author.name}
                        </span>
                        <span className="text-sm text-primary">{author.role}</span>
                      </div>
                    </div>
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
        <section className="section tone-deep" aria-labelledby="eeat-stats">
          <div className="container-page">
            <div className="page-intro-block me-auto mb-8 w-full text-start">
              <span className="page-intro-eyebrow">
                <BadgeCheck className="h-3 w-3" /> {m.about.statsEyebrow}
              </span>
              <h2 id="eeat-stats" className="page-intro-title page-intro-title--section">
                {m.about.statsTitle}
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
              <span className="page-intro-eyebrow">
                <MessageSquare className="h-3.5 w-3.5" /> {m.about.quotesEyebrow}
              </span>
              <h2 id="eeat-quotes" className="page-intro-title page-intro-title--section">
                {m.about.quotesTitle}
              </h2>
              <p className="page-intro-desc mt-3 !max-w-none">
                {t(m.about.quotesDesc, { name: SITE_NAME })}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {quotes.map((t, i) => (
                <Reveal key={t.id} delay={i * 80}>
                  <blockquote className="card-interactive flex h-full flex-col justify-between p-6 bg-card relative overflow-hidden group">
                    <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10" />
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="h-4 w-4 fill-current text-amber-500" />
                          ))}
                        </div>
                        <Quote className="h-6 w-6 text-primary/15 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <p className="text-[0.95rem] leading-relaxed text-foreground/80 relative z-10 font-normal">
                        “{t.quote}”
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4 relative z-10">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        {t.name.trim().slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <cite className="not-italic block font-semibold text-foreground text-sm tracking-tight transition-colors duration-300 group-hover:text-primary">
                          {t.name}
                        </cite>
                        <span className="block text-xs text-muted-foreground mt-0.5">
                          {t.role}
                          {t.company ? ` — ${t.company}` : ""}
                          {t.city ? ` · ${t.city}` : ""}
                        </span>
                      </div>
                    </div>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
