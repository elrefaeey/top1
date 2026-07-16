/**
 * Content-Security-Policy for Top1Markting.
 * style-src 'unsafe-inline' remains required for React/Tailwind runtime styles.
 * script-src keeps 'unsafe-inline' for TanStack Start hydration until nonces land.
 */
export function buildContentSecurityPolicy(isDev: boolean): string {
  const directives: string[] = [
    "default-src 'self'",
    [
      "script-src 'self'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://apis.google.com",
      "https://*.firebaseapp.com",
      "'unsafe-inline'",
      isDev ? "'unsafe-eval'" : "",
    ]
      .filter(Boolean)
      .join(" "),
    "script-src-attr 'none'",
    ["style-src 'self'", "'unsafe-inline'", "https://fonts.googleapis.com"].join(" "),
    "font-src 'self' https://fonts.gstatic.com data:",
    [
      "img-src 'self'",
      // data: kept temporarily for legacy CMS heroes; new uploads reject Base64.
      "data:",
      "blob:",
      "https://images.unsplash.com",
      "https://firebasestorage.googleapis.com",
      "https://*.googleapis.com",
      "https://*.googleusercontent.com",
      "https://i.ibb.co",
      "https://*.ibb.co",
    ].join(" "),
    [
      "connect-src 'self'",
      "https://*.googleapis.com",
      "https://*.firebaseio.com",
      "https://*.firebaseapp.com",
      "https://identitytoolkit.googleapis.com",
      "https://securetoken.googleapis.com",
      "https://firebasestorage.googleapis.com",
      "https://www.google-analytics.com",
      "https://region1.google-analytics.com",
      "https://*.google-analytics.com",
      "https://www.google.com",
      "https://analytics.google.com",
      "https://api.imgbb.com",
      isDev ? "ws:" : "",
      isDev ? "http://localhost:*" : "",
    ]
      .filter(Boolean)
      .join(" "),
    "frame-src 'self' https://*.firebaseapp.com https://www.googletagmanager.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}
