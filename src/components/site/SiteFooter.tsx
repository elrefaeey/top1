import { Link } from "@tanstack/react-router";
import { LocaleLink } from "@/components/site/LocaleLink";
import { ArrowRight, ArrowUp, Mail, MapPin, Sparkles } from "lucide-react";
import { SiteLogo } from "@/components/site/SiteLogo";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useServices, useSiteSettings } from "@/hooks/use-cms";
import { MarketsPhoneCards } from "@/components/site/MarketsContact";
import { SITE_NAME, SITE_CONTACT_PHONE, SITE_CONTACT_PHONE_SA, SITE_TAGLINE } from "@/lib/site-config";
import { preferredServiceSlug } from "@/lib/seo/service-slug-aliases";
import { useLocale } from "@/providers/LocaleProvider";

const QUICK_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "الخدمات", href: "/services" },
  { label: "أعمالنا", href: "/portfolio" },
  { label: "المدونة", href: "/blog" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "سياسة الخصوصية", href: "/privacy" },
  { label: "الشروط والأحكام", href: "/terms" },
] as const;

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const { data: services = [] } = useServices();
  const { m, labelForHref, locale } = useLocale();
  const siteName = settings?.siteName || SITE_NAME;
  const tagline =
    locale === "en"
      ? m.common.defaultTagline
      : settings?.tagline || SITE_TAGLINE;
  const phoneUae = settings?.contactPhone || SITE_CONTACT_PHONE;
  const phoneSa = settings?.contactPhoneSa || SITE_CONTACT_PHONE_SA;

  return (
    <footer className="site-footer ft">
      <div className="ft-glow" aria-hidden />

      <div className="container-page ft-inner">
        <div className="ft-cta">
          <div className="ft-cta-copy">
            <span className="ft-cta-badge">
              <Sparkles className="h-3.5 w-3.5" /> {m.footer.startToday}
            </span>
            <h2 className="ft-cta-title">{m.footer.ctaTitle}</h2>
            <p className="ft-cta-desc">{m.footer.ctaDesc}</p>
          </div>
          <LocaleLink to="/contact" className="ft-cta-btn">
            {m.footer.contactCta}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </LocaleLink>
        </div>

        <div className="ft-grid">
          <div className="ft-brand">
            <LocaleLink to="/" className="ft-logo-link">
              <SiteLogo className="ft-logo" imageClassName="ft-logo-img" tone="light" />
            </LocaleLink>
            <p className="ft-tagline">{tagline}</p>
            <SocialLinks variant="footer" className="ft-social" />
          </div>

          <nav className="ft-col ft-col--quick" aria-label={m.footer.siteLinks}>
            <h3 className="ft-col-title">{m.footer.quickLinks}</h3>
            <ul className="ft-links">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <LocaleLink to={l.href} className="ft-link">
                    {labelForHref(l.href, l.label)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          {services.length > 0 && (
            <nav className="ft-col ft-col--services" aria-label={m.footer.ourServices}>
              <h3 className="ft-col-title">{m.footer.ourServices}</h3>
              <ul className="ft-links">
                {services.slice(0, 6).map((s) => (
                  <li key={s.id}>
                    <LocaleLink
                      to="/services/$slug"
                      params={{ slug: preferredServiceSlug(s.slug) }}
                      className="ft-link"
                    >
                      {s.title}
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="ft-col ft-col--contact">
            <h3 className="ft-col-title">{m.footer.contactCta}</h3>
            {(phoneUae || phoneSa) && (
              <MarketsPhoneCards phoneUae={phoneUae} phoneSa={phoneSa} variant="footer" />
            )}
            <ul className="ft-contact-list">
              {settings?.contactEmail && (
                <li>
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} dir="ltr">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li>
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{locale === "en" ? m.common.defaultAddress : settings.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="ft-bottom">
          <p className="ft-copy">
            <Link to="/admin/login" className="ft-copy-mark" aria-label={m.footer.adminAria}>
              ©
            </Link>{" "}
            {new Date().getFullYear()} {siteName}. {m.footer.rights}
          </p>
          <nav className="ft-legal" aria-label={m.footer.legalNav}>
            {LEGAL_LINKS.map((l) => (
              <LocaleLink key={l.href} to={l.href} className="ft-legal-link">
                {labelForHref(l.href, l.label)}
              </LocaleLink>
            ))}
          </nav>
          <button
            type="button"
            className="ft-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {m.footer.backToTop}
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
