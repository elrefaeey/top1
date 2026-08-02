import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { GSC_OAUTH_SCOPE } from "@/lib/seo/gsc/types";

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

export function getGscOAuthConfig() {
  const clientId = env("GOOGLE_CLIENT_ID");
  const clientSecret = env("GOOGLE_CLIENT_SECRET");
  const siteUrl = env("GSC_SITE_URL") || "https://www.top1markting.com/";
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET غير مُعدّين على السيرفر");
  }
  return { clientId, clientSecret, siteUrl: normalizeGscSiteUrl(siteUrl) };
}

export function normalizeGscSiteUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "https://www.top1markting.com/";
  if (value.startsWith("sc-domain:")) return value;
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    url.hash = "";
    url.search = "";
    let href = url.toString();
    if (!href.endsWith("/")) href += "/";
    return href;
  } catch {
    return value.endsWith("/") ? value : `${value}/`;
  }
}

export function resolveGscRedirectUri(request: Request): string {
  const configured = env("GSC_REDIRECT_URI");
  if (configured) return configured.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.origin}/api/seo/gsc/callback`;
}

/** Temporary debug helper — never logs secrets or tokens. */
export function logGscOAuthDebug(input: {
  redirectUri: string;
  clientId: string;
  source: string;
}): void {
  const suffix = input.clientId.slice(-10);
  console.info(
    `[gsc-oauth:${input.source}] redirect_uri=${input.redirectUri} client_id_suffix=${suffix}`,
  );
}

function stateSecret(clientSecret: string): string {
  return clientSecret;
}

/** Signed OAuth state binding the connecting admin uid (CSRF + identity). */
export function createOAuthState(uid: string, clientSecret: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid, exp: Date.now() + 15 * 60_000, n: cryptoRandom() }),
    "utf8",
  ).toString("base64url");
  const sig = createHmac("sha256", stateSecret(clientSecret)).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function parseOAuthState(state: string, clientSecret: string): { uid: string } {
  const [payload, sig] = state.split(".");
  if (!payload || !sig) throw new Error("حالة OAuth غير صالحة");

  const expected = createHmac("sha256", stateSecret(clientSecret)).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("توقيع حالة OAuth غير صالح");
  }

  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    uid?: string;
    exp?: number;
  };
  if (!data.uid || typeof data.uid !== "string") throw new Error("حالة OAuth ناقصة");
  if (!data.exp || Date.now() > data.exp) throw new Error("انتهت صلاحية طلب الربط — أعد المحاولة");
  return { uid: data.uid };
}

function cryptoRandom(): string {
  return randomBytes(16).toString("hex");
}

export function buildGoogleAuthorizeUrl(input: {
  clientId: string;
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    client_id: input.clientId,
    redirect_uri: input.redirectUri,
    response_type: "code",
    scope: GSC_OAUTH_SCOPE,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: input.state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeAuthorizationCode(input: {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: input.code,
      client_id: input.clientId,
      client_secret: input.clientSecret,
      redirect_uri: input.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || `فشل تبادل رمز Google (${res.status})`,
    );
  }
  if (!data.refresh_token) {
    throw new Error(
      "لم يُرجع Google refresh_token — ألغِ الوصول من حساب Google وأعد الربط مع prompt=consent",
    );
  }

  return { accessToken: data.access_token, refreshToken: data.refresh_token };
}

export async function refreshGoogleAccessToken(input: {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: input.clientId,
      client_secret: input.clientSecret,
      refresh_token: input.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = (await res.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || `فشل تجديد توكن Google (${res.status})`,
    );
  }
  return data.access_token;
}

export async function fetchGoogleAccountEmail(accessToken: string): Promise<string> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return "";
  const data = (await res.json()) as { email?: string };
  return (data.email ?? "").trim();
}

export function extractBearerToken(request: Request): string {
  const auth = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(auth);
  if (!match?.[1]) throw new Error("غير مصرح — يلزم توكن مدير");
  return match[1].trim();
}
