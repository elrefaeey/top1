# Production Launch (Vercel + Firebase)

Primary hosting for Top1Markting is **Vercel** (`npm run build` → Nitro vercel preset).  
Hostinger VPS notes remain further below for alternate deploys.

---

## Launch checklist (≤ 10 steps)

1. Replace `YOUR_FIREBASE_PROJECT_ID` in `.firebaserc` with the real Project ID (Firebase Console → Project settings).
2. Run: `firebase login` then `firebase deploy --only firestore:rules,storage`
3. In **Vercel → Project → Settings → Environment Variables**, set every **Required** and **Recommended** var from `.env.example` (Production + Preview as needed).
4. Commit and push `main` (or merge PR) so Vercel rebuilds with redirects / robots / CSP.
5. After deploy, open `/robots.txt` — must include `Disallow: /api` and `Disallow: /admin`.
6. Check redirects: `/egypt` and `/web-design` must return **301** (not 404).
7. Submit `https://www.top1markting.com/sitemap.xml` in Google Search Console.
8. Smoke: home, contact form, admin login, image upload.
9. Optional: set `UPSTASH_*` if not already (distributed rate limits).
10. Optional: set `VITE_GSC_VERIFICATION` / `VITE_GTM_ID` then redeploy.

---

## Firebase rules deploy

```bash
# 1) Edit .firebaserc → projects.default = your real Project ID
# 2) Then:
firebase login
firebase deploy --only firestore:rules,storage
```

Config files:

| File | Role |
|------|------|
| `.firebaserc` | Default project (placeholder until you set real ID) |
| `firebase.json` | Maps `firestore.rules` + `storage.rules` |

---

## Redirect logic (after deploy)

Source of truth: `src/lib/seo/permanent-redirects.ts`  
Also listed in `vercel.json` and enforced in `src/server.ts` (Nitro entry) so they work even if Vercel redirects are dropped during Nitro output generation.

| From | To | Status |
|------|-----|--------|
| `/egypt` | `/web-design-saudi-arabia` | 301 |
| `/web-design-egypt` | `/web-design-saudi-arabia` | 301 |
| `/web-design` | `/services/web-design-development` | 301 |
| `/services/web-design` | `/services/web-design-development` | 301 |

Verify before push:

```bash
node scripts/check-release.mjs
npm run build
```

---

## robots.txt / sitemap.xml

- Dynamic route: `src/routes/robots[.]txt.ts` — `Allow: /`, `Disallow: /admin`, `Disallow: /api`
- Do **not** restore `public/robots.txt`
- Sitemap: `src/routes/sitemap[.]xml.ts` → published CMS URLs

---

## Hostinger VPS (alternate)

See sections below for `build:hostinger`, PM2, and reverse proxy.  
Default `npm run build` targets **Vercel**.

---

# Production Deployment — Top1Markting (Hostinger)

## Important architecture note

This project is **TanStack Start + Nitro** (SSR + API routes), **not** a plain Vite SPA.

It requires a **Node.js runtime** on the server for:

- Server-side rendering (SEO, meta tags)
- `/api/cms/*` — CMS data
- `/api/leads` — contact form
- `/api/firebase-config` — Firebase public config
- `/api/upload-image` — admin image uploads
- `/sitemap.xml`, `/robots.txt`

Uploading only `dist/` to `public_html` **without Node.js** will break CMS, forms, admin uploads, and direct URL access to routes.

### Recommended Hostinger options

| Plan | Works? | Notes |
|------|--------|-------|
| **VPS** | ✅ Best | Node 20+, PM2, Nginx/Apache proxy |
| **Node.js Web App** (if available) | ✅ | Point entry to `.output/server/index.mjs` |
| **Shared hosting (Apache only)** | ❌ | Not supported without removing SSR/API |

---

## 1. Environment variables

Copy `.env.example` → `.env` locally. On the server / Vercel, set the same variables **before build and at runtime**.

See `.env.example` for Required / Recommended / Optional split.

> Firebase web config (`VITE_FIREBASE_*`) is **public by design** — safe in client bundle.  
> Never commit `.env`. Use Vercel / Hostinger environment panel.

---

## 2. Build for Hostinger

```bash
npm install
npm run build:hostinger
```

This produces:

| Path | Purpose |
|------|---------|
| `.output/server/index.mjs` | Node server entry |
| `.output/public/` | Static assets (JS, CSS, images) |
| `dist/` | Mirror of static assets (+ `.htaccess`) for reference |

Default `npm run build` still targets **Vercel**.

---

## 3. Deploy to Hostinger VPS

### Upload files

Upload to e.g. `/home/user/top1markting/`:

- `.output/` (entire folder)
- `ecosystem.config.cjs`
- `package.json` (optional, for PM2 metadata)
- `.env` (production secrets — **not** in git)

### Start with PM2

```bash
cd /home/user/top1markting
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Server listens on `PORT=3000` by default.

### Apache reverse proxy (`public_html`)

Copy `hostinger/.htaccess.proxy` → `public_html/.htaccess` and ensure `mod_proxy` is enabled.

Or use Nginx:

```nginx
location / {
  proxy_pass http://127.0.0.1:3000;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 4. Firebase Authorized Domains

Add in [Firebase Console](https://console.firebase.google.com) → Authentication → Settings → Authorized domains:

- `top1markting.com`
- `www.top1markting.com`
- `localhost` (development)

---

## 5. DNS (Hostinger)

| Type | Name | Value |
|------|------|-------|
| A | `@` | VPS IP |
| A or CNAME | `www` | same server |

Enable SSL (Let's Encrypt) in Hostinger panel.

---

## 6. Post-deploy checklist

- [ ] Home page loads
- [ ] Direct URLs work: `/about`, `/services`, `/portfolio`, `/blog`, `/contact`, `/admin`
- [ ] CMS content loads
- [ ] Contact form submits
- [ ] Admin login works
- [ ] `/sitemap.xml` returns XML
- [ ] `/robots.txt` includes Disallow `/api`
- [ ] `/egypt` and `/web-design` return 301
