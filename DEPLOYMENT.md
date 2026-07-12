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

Copy `.env.example` → `.env` locally. On the server, set the same variables **before build and at runtime**.

### Required (client + server)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_SITE_URL=https://www.top1markting.com
```

### Optional

```env
VITE_GTM_ID=
VITE_GSC_VERIFICATION=
IMGBB_API_KEY=
```

> Firebase web config (`VITE_FIREBASE_*`) is **public by design** — safe in client bundle.  
> Never commit `.env`. Use Hostinger environment panel or server `.env` file.

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
- Your Hostinger temporary domain (during setup), e.g. `*.hostingersite.com`

---

## 5. DNS (Hostinger)

| Type | Name | Value |
|------|------|-------|
| A | `@` | VPS IP |
| A or CNAME | `www` | same server |

Enable SSL (Let's Encrypt) in Hostinger panel.

---

## 6. Post-deploy checklist

- [ ] `https://top1markting.com` loads home page
- [ ] Direct URLs work: `/about`, `/services`, `/portfolio`, `/blog`, `/contact`, `/admin`
- [ ] CMS content loads (Firestore via `/api/cms`)
- [ ] Contact form submits
- [ ] Admin login works
- [ ] `https://top1markting.com/sitemap.xml` returns XML
- [ ] `https://top1markting.com/robots.txt` returns text

---

## 7. Git deployment vs manual

| Method | Recommendation |
|--------|----------------|
| **Manual SFTP** | Upload `.output/` + `.env` after local `build:hostinger` |
| **Git on VPS** | `git pull` → `npm ci` → `npm run build:hostinger` → `pm2 restart` |
| **Git → public_html only** | ❌ Not sufficient (needs Node) |

---

## 8. Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page / 404 on refresh | Node not running or proxy misconfigured |
| CMS empty | Check `VITE_FIREBASE_*` on server + Firebase rules |
| Admin login fails | Add domain to Firebase Authorized Domains |
| Upload fails | Set `IMGBB_API_KEY` or Firebase Storage rules |
