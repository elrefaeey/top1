import { SITE_CONTACT_PHONE, SITE_CONTACT_PHONE_SA } from "@/lib/site-config";
import { formatSaPhoneIntl, formatUaePhoneIntl, telHref } from "@/lib/phone";

type Variant = "contact" | "footer";

type Props = {
  phoneUae?: string | null;
  phoneSa?: string | null;
  variant?: Variant;
  className?: string;
};

/** بطاقتا اتصال للسعودية والإمارات */
export function MarketsPhoneCards({
  phoneUae,
  phoneSa,
  variant = "contact",
  className = "",
}: Props) {
  const uae = phoneUae || SITE_CONTACT_PHONE;
  const sa = phoneSa || SITE_CONTACT_PHONE_SA;
  const root = variant === "footer" ? "markets-phones markets-phones--footer" : "markets-phones";

  return (
    <div className={`${root} ${className}`.trim()} role="group" aria-label="أرقام التواصل">
      <a
        href={telHref(sa, SITE_CONTACT_PHONE_SA)}
        className="market-phone market-phone--sa"
        aria-label={`السعودية ${formatSaPhoneIntl(sa)}`}
      >
        <span className="market-phone-flag" aria-hidden />
        <span className="market-phone-body">
          <span className="market-phone-label">السعودية</span>
          <span className="market-phone-num" dir="ltr">
            {formatSaPhoneIntl(sa)}
          </span>
        </span>
      </a>
      <a
        href={telHref(uae, SITE_CONTACT_PHONE)}
        className="market-phone market-phone--ae"
        aria-label={`الإمارات ${formatUaePhoneIntl(uae)}`}
      >
        <span className="market-phone-flag" aria-hidden />
        <span className="market-phone-body">
          <span className="market-phone-label">الإمارات</span>
          <span className="market-phone-num" dir="ltr">
            {formatUaePhoneIntl(uae)}
          </span>
        </span>
      </a>
    </div>
  );
}

/** شارة نطاق الخدمة — السعودية والإمارات */
export function MarketsServeStrip({ className = "" }: { className?: string }) {
  return (
    <ul className={`markets-serve ${className}`.trim()} aria-label="نخدم السعودية والإمارات">
      <li className="markets-serve-item markets-serve-item--sa">
        <span className="markets-serve-dot" aria-hidden />
        السعودية
      </li>
      <li className="markets-serve-item markets-serve-item--ae">
        <span className="markets-serve-dot" aria-hidden />
        الإمارات
      </li>
    </ul>
  );
}
