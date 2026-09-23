import { Link } from "@tanstack/react-router";
import { LocaleLink } from "@/components/site/LocaleLink";
import { ArrowLeft, Mail, MapPin, Sparkles } from "lucide-react";
import { SiteLogo } from "@/components/site/SiteLogo";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useServices, useSiteSettings } from "@/hooks/use-cms";
import { MarketsPhoneCards } from "@/components/site/MarketsContact";
import { SITE_NAME, SITE_CONTACT_PHONE, SITE_CONTACT_PHONE_SA, SITE_TAGLINE } from "@/lib/site-config";
import { FOOTER_SEO_LINKS } from "@/lib/seo/internal-links";
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

const FOOTER_LANDING_LINKS = FOOTER_SEO_LINKS.slice(0, 8);

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
    <footer className="site-footer mt-0">
      {/* شريط CTA */}
      <div className="footer-cta-band">
        <div className="container-page footer-cta-inner">
          <div className="footer-cta-copy">
            <span className="footer-cta-badge">
              <Sparkles className="h-3.5 w-3.5" /> {m.footer.startToday}
            </span>
            <h2 className="footer-cta-title">{m.footer.ctaTitle}</h2>
            <p className="footer-cta-desc">{m.footer.ctaDesc}</p>
          </div>
          <LocaleLink to="/contact" className="btn-primary footer-cta-btn shrink-0">
            {m.footer.contactCta}
            <ArrowLeft className="h-4 w-4 rtl-flip" />
          </LocaleLink>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="footer-main">
        <div className="footer-main-glow" aria-hidden />
        <div className="container-page relative z-[1]">
          <div className="footer-grid">
            {/* العلامة */}
            <div className="footer-brand-col">
              <LocaleLink to="/" className="footer-brand-logo-link">
                <SiteLogo
                  className="footer-brand-logo"
                  imageClassName="footer-brand-logo-img"
                  tone="light"
                />
              </LocaleLink>
              <p className="footer-tagline">{tagline}</p>
              <ul className="footer-contact-list">
                {settings?.address && (
                  <li>
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{locale === "en" ? m.common.defaultAddress : settings.address}</span>
                  </li>
                )}
                {settings?.contactEmail && (
                  <li>
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      dir="ltr"
                      className="hover:text-white transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </li>
                )}
                {(phoneUae || phoneSa) && (
                  <li className="footer-phones-li">
                    <MarketsPhoneCards
                      phoneUae={phoneUae}
                      phoneSa={phoneSa}
                      variant="footer"
                    />
                  </li>
                )}
              </ul>
              <SocialLinks variant="footer" className="footer-social mt-4" />
            </div>

            <div className="footer-links-grid">
              {/* روابط سريعة */}
              <div className="footer-links-col">
                <h3 className="footer-col-title">{m.footer.quickLinks}</h3>
                <ul className="footer-link-list">
                  {QUICK_LINKS.map((l) => (
                    <li key={l.href}>
                      <LocaleLink to={l.href} className="footer-link">
                        {labelForHref(l.href, l.label)}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* الخدمات — ديسكتوب فقط */}
              {services.length > 0 && (
                <div className="footer-links-col footer-services-col">
                  <h3 className="footer-col-title">{m.footer.ourServices}</h3>
                  <ul className="footer-link-list">
                    {services.slice(0, 6).map((s) => (
                      <li key={s.id}>
                        <LocaleLink
                          to="/services/$slug"
                          params={{ slug: preferredServiceSlug(s.slug) }}
                          className="footer-link"
                        >
                          {s.title}
                        </LocaleLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* أدلة SEO — ديسكتوب فقط */}
              <div className="footer-links-col footer-perks-col">
                <h3 className="footer-col-title">{m.footer.guides}</h3>
                <ul className="footer-link-list">
                  {FOOTER_LANDING_LINKS.map((l) => (
                    <li key={l.href}>
                      <LocaleLink to={l.href} className="footer-link">
                        {labelForHref(l.href, l.label)}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
                <LocaleLink to="/contact" className="footer-mini-cta mt-4">
                  {m.footer.contactCta}
                  <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
                </LocaleLink>
              </div>
            </div>

            {/* موبايل — روابط مضغوطة + CTA واحد */}
            <nav className="footer-mobile-nav footer-mobile-only" aria-label={m.footer.siteLinks}>
              {QUICK_LINKS.map((l) => (
                <LocaleLink key={l.href} to={l.href} className="footer-mobile-link">
                  {labelForHref(l.href, l.label)}
                </LocaleLink>
              ))}
            </nav>
            <LocaleLink to="/contact" className="footer-mobile-cta footer-mobile-only">
              {m.footer.contactCta}
              <ArrowLeft className="h-4 w-4 rtl-flip" />
            </LocaleLink>
          </div>

          {/* الشريط السفلي */}
          <div className="footer-bottom">
            <p className="footer-copy">
              <Link to="/admin/login" className="footer-copy-mark" aria-label={m.footer.adminAria}>
                ©
              </Link>{" "}
              {new Date().getFullYear()} {siteName}. {m.footer.rights}
            </p>
            <nav className="footer-legal-nav" aria-label={m.footer.legalNav}>
              {LEGAL_LINKS.map((l) => (
                <LocaleLink key={l.href} to={l.href} className="footer-legal-link">
                  {labelForHref(l.href, l.label)}
                </LocaleLink>
              ))}
            </nav>
            <p className="footer-made">{m.footer.made}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
