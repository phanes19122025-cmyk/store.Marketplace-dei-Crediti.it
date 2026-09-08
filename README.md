# shop.Marketplace-dei-Crediti.it

> Payload CMS 3 (embedded in Next.js 15) — storefront ecommerce marketplace multi-brand.
> Single-deploy, single-process, MIT license, public mirror for CI/CD.

[![CI](https://github.com/phanes19122025-cmyk/shop.Marketplace-dei-Crediti.it/actions/workflows/ci.yml/badge.svg)](https://github.com/phanes19122025-cmyk/shop.Marketplace-dei-Crediti.it/actions)

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router |
| CMS + API | Payload CMS 3 (embedded) |
| Database | PostgreSQL 17 (Drizzle) |
| Storage | Cloudflare R2 (S3-compat) |
| Email | Resend |
| Payments | Stripe (roadmap v0.3) |
| CSS | Tailwind CSS 4 |

## Local development

```bash
git clone https://github.com/phanes19122025-cmyk/shop.Marketplace-dei-Crediti.it.git
cd shop.Marketplace-dei-Crediti.it
cp .env.example .env
# fill DATABASE_URI + PAYLOAD_SECRET
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000/admin and create the first admin user.

## Deploy on Railway

```bash
npm i -g @railway/cli
railway login
railway init
railway link
railway service connect github  # connect this repo, branch=main
```

Set environment variables via Railway UI or CLI:

```bash
railway variables --set PAYLOAD_SECRET="$(openssl rand -hex 32)"
railway variables --set DATABASE_URI="postgres://...neon..."
railway variables --set R2_ACCOUNT_ID="..."
railway variables --set R2_ACCESS_KEY_ID="..."
railway variables --set R2_SECRET_ACCESS_KEY="..."
railway variables --set R2_BUCKET="shop-media"
railway variables --set RESEND_API_KEY="re_..."
railway variables --set NODE_ENV=production
railway variables --set NEXT_PUBLIC_SITE_URL="https://admin.marketplace-dei-crediti.it"
```

Every `git push origin main` triggers an automatic Railway re-deploy.

## Architecture

```
src/
├── app/
│   ├── (frontend)/    → public storefront SSR/ISR
│   └── (payload)/admin → /admin CMS panel
├── collections/
│   ├── Admins.ts      → CMS admin users (auth)
│   ├── Customers.ts   → end users (auth)
│   ├── Products.ts    → catalog with variants, stock, badges
│   ├── Categories.ts  → self-referencing tree
│   ├── Brands.ts
│   ├── Orders.ts      → state machine + auto orderNumber + stock decrement hook
│   ├── Media.ts       → uploads → R2 (when configured)
│   └── Pages.ts       → blog/landing content
└── globals/
    ├── SiteSettings.ts
    └── Navigation.ts
```

## Roadmap

- **v0.2 (current)** — Scaffold, admin/customers auth, collections base, R2 plugin
- **v0.3** — Cart cookie-based, Stripe checkout, order webhooks, email transazionali
- **v0.4** — Meilisearch, sitemap.xml, feed Google Shopping
- **v1.0** — Domain prod, fatturazione SDI, monitoring (Sentry + Plausible)

## License

MIT
\n_Deploy pipeline verified 2026-05-16T13:01Z_
\n_Deploy pipeline verified 2026-05-16T13:01Z_\n\n## Status (live)\n\n- Admin: https://shop-mdc.onrender.com/admin\n- Storefront: https://shop-mdc.onrender.com\n- Auto-deploy: GitHub Actions → Render API on push to main\n\nLast verified: 2026-05-16T13:01:44Z\n