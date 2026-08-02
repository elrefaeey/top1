# AI SEO Growth Architecture — TOP1MARKTING

Foundation documentation for the future AI SEO Growth Automation system.
This does **not** implement the AI agent itself — it prepares the codebase.

## Current stack

| Layer | Technology |
|---|---|
| App | TanStack Start + React 19 + Vite + Nitro |
| CMS | Admin Dashboard + Firestore |
| Auth | Firebase Authentication (`admin` / `editor` roles in `users/{uid}`) |
| Media | Firebase Storage |
| Public SEO | `src/lib/seo.ts`, sitemap, robots, Schema.org |
| Server writes | Firestore REST + service account (`FIREBASE_SERVICE_ACCOUNT_JSON`) |

### Content flow today

```
Admin UI → Firebase client SDK → Firestore
Public site → /api/cms/* → published content only
AI path (new) → /api/seo/* → Admin REST → drafts + insights + logs
```

## New Firestore collections

Registered in `src/lib/firebase/collections.ts`. Types in `src/types/seo-automation.ts`.

### `seo_insights`

AI SEO recommendations for human review.

| Field | Type |
|---|---|
| id | string |
| type | string |
| title | string |
| description | string |
| keyword | string |
| targetPage | string |
| currentPosition | number |
| impressions | number |
| clicks | number |
| ctr | number |
| priority | `low` \| `medium` \| `high` |
| status | `pending` \| `reviewed` \| `completed` |
| recommendation | string |
| createdAt / updatedAt | ISO string |

### `gsc_snapshots`

Cached Google Search Console performance rows.

| Field | Type |
|---|---|
| id | string |
| query | string |
| page | string |
| clicks / impressions / ctr / position | number |
| date | string (YYYY-MM-DD) |

### `ai_logs`

Audit trail for automation actions.

| Field | Type |
|---|---|
| id | string |
| action | string |
| description | string |
| relatedCollection? | string |
| relatedId? | string |
| createdAt | ISO string |

### Existing `blog_posts` (unchanged schema)

AI drafts use the existing `BlogPost` model. **Status is always forced to `draft`** by `buildAiBlogDraftPayload` / `POST /api/seo/create-draft`. Publishing remains a human action in `/admin/blog`.

## API structure

All routes require authentication and rate limiting. No Firebase secrets are returned.

### Auth options

1. **Editor session:** `Authorization: Bearer <Firebase ID token>` where `users/{uid}.role` is `admin` or `editor`.
2. **Automation key:** header `x-seo-automation-key: <SEO_AUTOMATION_API_KEY>` when that env var is set (for Cursor Automation / CI agents).

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/seo/insights` | List SEO recommendations (`?limit=`) |
| `GET` | `/api/seo/gsc` | List GSC snapshots (`?limit=` `&date=YYYY-MM-DD`) |
| `POST` | `/api/seo/create-draft` | Create a **draft** blog post + `ai_logs` entry |

#### `POST /api/seo/create-draft` body

```json
{
  "title": "…",
  "slug": "optional-slug",
  "excerpt": "…",
  "content": "<p>HTML</p>",
  "featuredImage": "https://…",
  "featuredImageAlt": "…",
  "category": "تصميم",
  "tags": ["seo", "السعودية"],
  "author": "Top1Markting",
  "metaTitle": "…",
  "metaDescription": "…"
}
```

Rules:

- `status` if sent must be `"draft"` (or omitted).
- Base64 / `data:image` URLs are rejected.
- Response: `{ ok: true, id, slug, status: "draft" }`.

## Security rules

See `firestore.rules`:

| Collection | Client read | Client write |
|---|---|---|
| `seo_insights` | editors | update `status` + `updatedAt` only |
| `gsc_snapshots` | editors | denied |
| `ai_logs` | editors | denied |
| `users` / `leads` | unchanged — automation must not touch |

Server Admin REST (service account) bypasses rules and is the only path that creates insights, snapshots, logs, and AI drafts.

**AI automation must not:** modify users, auth, delete CMS content, or write leads.

**AI automation may:** create blog drafts, write SEO insights / GSC snapshots / AI logs (via server APIs or future sync jobs).

## Admin UI preparation

- Sidebar: **SEO AI** → `/admin/seo-ai`
- Existing SEO score tool remains at `/admin/seo`
- Placeholder sections: Google Performance, SEO Opportunities, AI Generated Drafts, AI Activity Logs

## Future automation workflow

```
Google Search Console
        ↓ sync job → gsc_snapshots
AI SEO Growth Engine
        ↓ analysis → seo_insights
AI Generated Blog Drafts
        ↓ POST /api/seo/create-draft → blog_posts (draft)
Admin Dashboard Review (/admin/blog, /admin/seo-ai)
        ↓ human publish
Public site + sitemap.xml
```

## Google Search Console OAuth

Env (server only): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GSC_SITE_URL`, optional `GSC_REDIRECT_URI`.

| Method | Path | Who |
|---|---|---|
| `GET` | `/api/seo/gsc/connect` | Admin Bearer → `{ authorizeUrl }` |
| `GET` | `/api/seo/gsc/callback` | Google redirect → stores `gsc_credentials` |
| `GET` | `/api/seo/gsc/status` | Admin Bearer → connection status (no secrets) |
| `POST` | `/api/seo/gsc/sync` | Admin Bearer → last 28 days → `gsc_snapshots` + pending `seo_insights` |

Collection `gsc_credentials`: `{ userId, refreshToken, connectedEmail, createdAt, updatedAt }` — Admin REST write; client create/update/delete denied; admin may read own doc only.

Redirect URI to register in Google Cloud OAuth client:
`https://www.top1markting.com/api/seo/gsc/callback` and local `http://localhost:8080/api/seo/gsc/callback`.


1. Store `SEO_AUTOMATION_API_KEY` and `FIREBASE_SERVICE_ACCOUNT_JSON` in the automation secret store (never in the client).
2. Call `GET /api/seo/gsc` and `GET /api/seo/insights` with `x-seo-automation-key`.
3. Generate article content externally (LLM).
4. Call `POST /api/seo/create-draft` with HTML content and https image URLs only.
5. Log outcomes via the same create-draft path (`ai_logs` is written automatically) or future dedicated log endpoints.
6. Never set `status: "published"` from automation.

## Environment variables

| Variable | Required for foundation | Notes |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Yes (server writes) | Already used by `/api/leads` |
| `SEO_AUTOMATION_API_KEY` | Recommended for agents | Optional; editors can still use Bearer tokens |
| `VITE_GSC_VERIFICATION` | Optional | Meta tag only — not the GSC API |
| Future GSC OAuth vars | Later | Not wired in this foundation |

## Deploy notes

After merging rules changes, deploy:

```bash
npm run firebase:rules
# or: firebase deploy --only firestore:rules
```

## Next recommended step

1. Implement GSC OAuth + daily sync into `gsc_snapshots`.
2. Build an insights generator that writes `seo_insights` (`pending`).
3. Expand `/admin/seo-ai` UI to list insights / snapshots / logs.
4. Keep publish human-gated.
