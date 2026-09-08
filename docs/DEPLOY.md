# Deploy guide — Railway + Neon + R2

## Prerequisites

| Service | Tier | URL |
|---|---|---|
| Railway | $5 credit/mese | https://railway.app |
| Neon PostgreSQL | 0.5GB free, always-on | https://console.neon.tech |
| Cloudflare R2 | 10GB free | https://dash.cloudflare.com |
| Resend | 3k email/mese free | https://resend.com |

## 1. Neon PostgreSQL

1. New Project — region: EU Central (Frankfurt)
2. Copy `DATABASE_URI` (sslmode=require)

## 2. Cloudflare R2

1. Dashboard → R2 → Enable (free tier, no card required)
2. Create bucket `shop-media`, location: EEUR
3. Manage API Tokens → Create — permission Object Read & Write, scope: bucket `shop-media`
4. Copy `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
5. (Optional) Bucket → Settings → Public Access → Enable, copy public URL

## 3. Resend

1. https://resend.com → Sign in with GitHub
2. API Keys → Create — copy `RESEND_API_KEY`
3. Domains → Add domain `marketplace-dei-crediti.it` → DKIM/SPF on Cloudflare DNS

## 4. Railway

```bash
brew install railway
railway login
cd shop.Marketplace-dei-Crediti.it
railway init             # name: shop-marketplace-dei-crediti
railway service connect github
# Select: phanes19122025-cmyk/shop.Marketplace-dei-Crediti.it, branch: main
```

Set variables (one-liner):

```bash
railway variables \
  --set "DATABASE_URI=postgres://..." \
  --set "PAYLOAD_SECRET=$(openssl rand -hex 32)" \
  --set "NEXT_PUBLIC_SITE_URL=https://admin.marketplace-dei-crediti.it" \
  --set "R2_ACCOUNT_ID=..." \
  --set "R2_ACCESS_KEY_ID=..." \
  --set "R2_SECRET_ACCESS_KEY=..." \
  --set "R2_BUCKET=shop-media" \
  --set "RESEND_API_KEY=re_..." \
  --set "NODE_ENV=production"
```

## 5. Custom domain

```bash
railway domain add admin.marketplace-dei-crediti.it
```

On Cloudflare DNS: CNAME `admin` → `<railway-target>.up.railway.app` (proxied).

## 6. First admin user

Open `https://admin.marketplace-dei-crediti.it/admin` → register first admin.

## 7. CI/CD

Every push to `main` → Railway re-deploys. PRs run GitHub Actions (typecheck + build).

## 8. Backup

GitHub Actions `.github/workflows/backup.yml` runs daily at 03:00 UTC.
Configure secrets in repo settings:
- `DATABASE_URI`
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
- `R2_BACKUP_BUCKET` (create separate bucket `shop-media-backup`)

## 9. Monitoring

- UptimeRobot: HTTPS check on `/admin/login` every 5 min
- Sentry (optional): `npm i @sentry/nextjs && npx @sentry/wizard@latest -i nextjs`

## Rollback

Railway UI → Deployments → previous deploy → "Redeploy". Zero downtime.

## Schema migrations

```bash
npx payload migrate:create my_change
git add src/migrations/* && git commit -m "feat: schema my_change"
git push origin main   # Railway runs migrate on next start
```
