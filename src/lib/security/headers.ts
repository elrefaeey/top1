import { buildContentSecurityPolicy } from "./csp";

function isDevEnv(): boolean {
  return process.env.NODE_ENV === "development";
}

export function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy": buildContentSecurityPolicy(isDevEnv()),
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "Cross-Origin-Resource-Policy": "same-site",
    "Cross-Origin-Opener-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "off",
    "X-Permitted-Cross-Domain-Policies": "none",
  };
}

export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(getSecurityHeaders())) {
    if (!headers.has(key)) headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function jsonError(message: string, status: number): Response {
  return Response.json(
    { error: message },
    { status, headers: getSecurityHeaders() },
  );
}
