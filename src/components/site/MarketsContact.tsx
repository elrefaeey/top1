import { SITE_CONTACT_PHONE, SITE_CONTACT_PHONE_SA } from "@/lib/site-config";
import { formatSaPhoneIntl, formatUaePhoneIntl, telHref } from "@/lib/phone";
import { useT } from "@/providers/LocaleProvider";

type Variant = "contact" | "footer";

type Props = {
  phoneUae?: string | null;
  phoneSa?: string | null;
  variant?: Variant;
  className?: string;
};

function MarketFlag({ code, className = "" }: { code: "sa" | "ae"; className?: string }) {
  const src = code === "sa" ? "/flags/sa.png" : "/flags/ae.svg";
  return (
    <img
      className={className}
      src={src}
      width={36}
      height={24}
      alt=""
      decoding="async"
      loading="lazy"
    />
  );
}

/** بطاقتا اتصال للسعودية والإمارات */
export function MarketsPhoneCards({
  phoneUae,
  phoneSa,
  variant = "contact",
  className = "",
}: Props) {
  const m = useT();
  const uae = phoneUae || SITE_CONTACT_PHONE;
  const sa = phoneSa || SITE_CONTACT_PHONE_SA;
  const root = variant === "footer" ? "markets-phones markets-phones--footer" : "markets-phones";

  return (
    <div className={`${root} ${className}`.trim()} role="group" aria-label={m.common.phonesAria}>
      <a
        href={telHref(sa, SITE_CONTACT_PHONE_SA)}
        className="market-phone market-phone--sa"
        aria-label={`${m.common.saudi} ${formatSaPhoneIntl(sa)}`}
      >
        <span className="market-phone-flag" aria-hidden>
          <MarketFlag code="sa" className="market-phone-flag-svg" />
        </span>
        <span className="market-phone-body">
          <span className="market-phone-label">{m.common.saudi}</span>
          <span className="market-phone-num" dir="ltr">
            {formatSaPhoneIntl(sa)}
          </span>
        </span>
      </a>
      <a
        href={telHref(uae, SITE_CONTACT_PHONE)}
        className="market-phone market-phone--ae"
        aria-label={`${m.common.uae} ${formatUaePhoneIntl(uae)}`}
      >
        <span className="market-phone-flag" aria-hidden>
          <MarketFlag code="ae" className="market-phone-flag-svg" />
        </span>
        <span className="market-phone-body">
          <span className="market-phone-label">{m.common.uae}</span>
          <span className="market-phone-num" dir="ltr">
            {formatUaePhoneIntl(uae)}
          </span>
        </span>
      </a>
    </div>
  );
}

/** شارة نطاق الخدمة — السعودية والإمارات + المدن */
export function MarketsServeStrip({ className = "" }: { className?: string }) {
  const m = useT();
  return (
    <div className={`markets-serve-wrap ${className}`.trim()}>
      <ul className="markets-serve" aria-label={m.common.serveAria}>
        <li className="markets-serve-item markets-serve-item--sa">
          <span className="markets-serve-dot" aria-hidden />
          {m.common.saudi}
        </li>
        <li className="markets-serve-item markets-serve-item--ae">
          <span className="markets-serve-dot" aria-hidden />
          {m.common.uae}
        </li>
      </ul>
      <p className="markets-serve-cities">{m.common.cities}</p>
    </div>
  );
}
