import { useEffect } from "react";

function readGtmId(): string {
  if (typeof import.meta.env.VITE_GTM_ID === "string" && import.meta.env.VITE_GTM_ID.trim()) {
    return import.meta.env.VITE_GTM_ID.trim();
  }
  return "";
}

/** Loads Google Tag Manager only when VITE_GTM_ID is set — no impact when empty. */
export function GoogleTagManager() {
  const gtmId = readGtmId();

  useEffect(() => {
    if (!gtmId || typeof window === "undefined") return;
    if (document.getElementById("gtm-script")) return;

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  }, [gtmId]);

  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
