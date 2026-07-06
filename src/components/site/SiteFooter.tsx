import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, Sparkles } from "lucide-react";
import { SiteLogo } from "@/components/site/SiteLogo";
import { SocialLinks } from "@/components/site/SocialLinks";
import { useServices, useSiteSettings } from "@/hooks/use-cms";
import { SITE_NAME, SITE_CONTACT_PHONE } from "@/lib/site-config";
import { telHref } from "@/lib/phone";

const QUICK_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "الخدمات", href: "/services" },
  { label: "أعمالنا", href: "/portfolio" },
  { label: "المدونة", href: "/blog" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل", href: "/contact" },
];

export function SiteFooter() {
  const { data: settings } = useSiteSettings();
  const { data: services = [] } = useServices();
  const siteName = settings?.siteName || SITE_NAME;
  const tagline = settings?.tagline || "تسويق رقمي · تصميم مواقع · SEO · نمو قابل للقياس";

  return (
    <footer className="site-footer mt-0">
      {/* شريط CTA */}
      <div className="footer-cta-band">
        <div className="container-page footer-cta-inner">
          <div className="footer-cta-copy">
            <span className="footer-cta-badge">
              <Sparkles className="h-3.5 w-3.5" /> ابدأ اليوم
            </span>
            <h2 className="footer-cta-title">جاهز ترفع مبيعاتك أونلاين؟</h2>
            <p className="footer-cta-desc">
              احصل على استشارة مجانية وعرض سعر خلال 48 ساعة — بدون التزام.
            </p>
          </div>
          <Link to="/contact" className="btn-primary footer-cta-btn shrink-0">
            تواصل معنا
            <ArrowLeft className="h-4 w-4 rtl-flip" />
          </Link>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="footer-main">
        <div className="footer-main-glow" aria-hidden />
        <div className="container-page relative z-[1]">
          <div className="footer-grid">
            {/* العلامة */}
            <div className="footer-brand-col">
              <Link to="/" className="footer-brand-logo-link">
                <SiteLogo
                  className="footer-brand-logo"
                  imageClassName="footer-brand-logo-img"
                  showName
                />
              </Link>
              <p className="footer-tagline">{tagline}</p>
              <ul className="footer-contact-list">
                {settings?.address && (
                  <li>
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span>{settings.address}</span>
                  </li>
                )}
                {settings?.contactEmail && (
                  <li>
                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                    <a href={`mailto:${settings.contactEmail}`} dir="ltr" className="hover:text-white transition-colors">
                      {settings.contactEmail}
                    </a>
                  </li>
                )}
                {(settings?.contactPhone || SITE_CONTACT_PHONE) && (
                  <li>
                    <a
                      href={telHref(settings?.contactPhone)}
                      className="footer-call-btn"
                      aria-label="اتصل بنا"
                    >
                      <span className="footer-call-btn-label">اتصل بنا</span>
                      <span className="footer-call-btn-plus" dir="ltr">+966</span>
                    </a>
                  </li>
                )}
              </ul>
              <SocialLinks variant="footer" className="footer-social mt-4" />
            </div>

            <div className="footer-links-grid">
            {/* روابط سريعة */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">روابط سريعة</h4>
              <ul className="footer-link-list">
                {QUICK_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* الخدمات — ديسكتوب فقط */}
            {services.length > 0 && (
              <div className="footer-links-col footer-services-col">
                <h4 className="footer-col-title">خدماتنا</h4>
                <ul className="footer-link-list">
                  {services.slice(0, 6).map((s) => (
                    <li key={s.id}>
                      <Link to="/services/$slug" params={{ slug: s.slug }} className="footer-link">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* لماذا نحن — ديسكتوب فقط */}
            <div className="footer-links-col footer-perks-col">
              <h4 className="footer-col-title">لماذا نحن؟</h4>
              <ul className="footer-perks">
                {["فريق خبراء فقط", "تسليم سريع وشفاف", "SEO من اليوم الأول", "دعم بعد الإطلاق"].map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link to="/contact" className="footer-mini-cta mt-4">
                اطلب عرض سعر
                <ArrowLeft className="h-3.5 w-3.5 rtl-flip" />
              </Link>
            </div>
            </div>

            {/* موبايل — روابط مضغوطة + CTA واحد */}
            <nav className="footer-mobile-nav footer-mobile-only" aria-label="روابط الموقع">
              {QUICK_LINKS.map((l) => (
                <Link key={l.href} to={l.href} className="footer-mobile-link">
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link to="/contact" className="footer-mobile-cta footer-mobile-only">
              تواصل معنا
              <ArrowLeft className="h-4 w-4 rtl-flip" />
            </Link>
          </div>

          {/* الشريط السفلي */}
          <div className="footer-bottom">
            <p className="footer-copy">
              <Link to="/admin/login" className="footer-copy-mark" aria-label="©">
                ©
              </Link>{" "}
              {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة.
            </p>
            <p className="footer-made">صُنع بعناية · محسّن للأداء والتحويل</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
