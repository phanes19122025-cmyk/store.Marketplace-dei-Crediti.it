# shop.Marketplace-dei-Crediti.it — Ecommerce Platform

## Overview

Piattaforma ecommerce marketplace-grade costruita su **Payload CMS 3** embedded in **Next.js 15**.
Obiettivo: replicare le funzionalità di MultibrandProject.it (Storeden) con architettura moderna,
scalabile, AI-manageable, zero vendor lock-in.

## Stack Tecnologico

| Layer | Tecnologia | Versione | Licenza |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | MIT |
| CMS + Backend | Payload CMS | 3.x | MIT |
| Database | PostgreSQL (via Drizzle ORM) | 17 | PostgreSQL License |
| Search | PostgreSQL full-text (alpha) → Meilisearch (prod) | - | MIT |
| Cache | Valkey/Redis (opzionale alpha) | 8.x | BSD-3 |
| Auth | Payload native auth (customers collection) | built-in | MIT |
| Payments | Stripe + PayPal | SDK | - |
| Media Storage | Cloudflare R2 | - | - |
| Email | Resend + React Email | - | MIT |
| CSS | Tailwind CSS + shadcn/ui | 4.x | MIT |
| Deploy alpha | Vercel (free) + Neon PostgreSQL (free) | - | - |
| Deploy prod | Hetzner VPS + Docker Compose + Cloudflare CDN | - | - |

## Architettura

```
Next.js 15 + Payload CMS 3 (embedded, singolo processo)
├── /app                    → storefront pages (SSR/ISR)
├── /app/(payload)/admin    → admin panel CMS
├── /collections
│   ├── Products.ts         → prodotti con varianti, prezzi, stock
│   ├── Categories.ts       → albero categorie (self-referencing)
│   ├── Brands.ts           → marchi
│   ├── Orders.ts           → ordini con state machine
│   ├── Customers.ts        → utenti registrati (auth)
│   ├── Pages.ts            → pagine CMS (blog, landing, FAQ)
│   └── Media.ts            → upload immagini → R2
├── /globals
│   ├── SiteSettings.ts     → logo, contatti, social, announcement
│   └── Navigation.ts       → menu header/footer
├── /hooks
│   ├── validateStock.ts    → beforeChange:Order → check disponibilità
│   ├── decrementStock.ts   → afterChange:Order → aggiorna inventario
│   ├── sendOrderEmail.ts   → afterChange:Order → email conferma
│   └── computeDiscount.ts  → beforeRead:Products → calcola % sconto
├── /api
│   ├── cart/route.ts       → gestione carrello (session cookie)
│   ├── checkout/route.ts   → Stripe PaymentIntent
│   └── webhooks/stripe.ts  → conferma pagamento
├── /components             → UI storefront (shadcn/ui + Tailwind)
├── /lib
│   ├── stripe.ts           → Stripe SDK config
│   └── email.ts            → Resend client
├── payload.config.ts       → configurazione Payload principale
├── docker-compose.yml      → dev locale (PG + app)
├── .env.example            → variabili ambiente
└── vercel.json             → config deploy Vercel
```

## Collections Schema

### Products
- name (text, required, translatable)
- slug (text, unique, auto-generated)
- description (richText)
- price (number, required) — prezzo di vendita in centesimi
- compareAtPrice (number) — prezzo listino barrato
- images (array → Media upload)
- category (relationship → Categories)
- brand (relationship → Brands)
- variants (array: {name, sku, price, stock})
- stock (number, default: 0)
- featured (checkbox) — offerte a tempo
- status (select: draft/published/archived)

### Categories
- name (text, required)
- slug (text, unique)
- parent (relationship → Categories, self-referencing)
- image (upload → Media)

### Brands
- name (text, required)
- slug (text, unique)
- logo (upload → Media)

### Orders
- orderNumber (text, unique, auto-generated)
- customer (relationship → Customers)
- items (array: {product, variant, quantity, unitPrice})
- subtotal (number)
- shipping (number)
- tax (number)
- total (number)
- status (select: pending/paid/processing/shipped/delivered/cancelled/refunded)
- paymentIntentId (text) — Stripe reference
- shippingAddress (group: {name, street, city, zip, province, country})
- trackingNumber (text, optional)

### Customers (auth-enabled)
- email (email, required, unique)
- name (text)
- phone (text)
- addresses (array: {label, street, city, zip, province, country, isDefault})
- Auth: Payload native (session + JWT)

### Pages (blog + custom)
- title (text, required)
- slug (text, unique)
- content (richText con blocks)
- featuredImage (upload → Media)
- category (select: blog/info/landing)
- publishedAt (date)
- status (select: draft/published)

### Media
- alt (text)
- Storage: Cloudflare R2 via @payloadcms/storage-s3

## Globals

### SiteSettings
- siteName, logo, favicon
- phone, whatsapp, email
- socialLinks (array: {platform, url})
- announcementBar (text + toggle)

### Navigation
- headerLinks (array: {label, url, children[]})
- footerLinks (array: {label, url})

## Commerce Logic (Hooks + API Routes)

### Cart (session-based)
- Stored in encrypted HTTP-only cookie (no DB per alpha)
- API: GET/POST/PATCH/DELETE /api/cart
- Items: [{productId, variantIndex, quantity}]
- Totals calcolati server-side ad ogni request

### Checkout Flow
1. Cliente compila shipping address
2. POST /api/checkout → crea Stripe PaymentIntent
3. Frontend mostra Stripe Elements (card input)
4. Stripe conferma → webhook POST /api/webhooks/stripe
5. Webhook: crea Order in Payload, decrementa stock, invia email

### Inventory
- Stock decrementato via afterChange hook su Orders (status=paid)
- Race condition prevenuta con PostgreSQL `UPDATE ... WHERE stock >= quantity`

## Deploy Strategy

### Alpha (€0/mese)
- Vercel Hobby → Next.js + Payload
- Neon free → PostgreSQL
- Cloudflare R2 free → immagini
- Resend free → 3000 email/mese

### Produzione (€7.49/mese)
- Hetzner CX32 (4vCPU, 8GB RAM)
- Docker Compose: app + PostgreSQL + Meilisearch + Valkey
- Cloudflare free CDN/WAF/SSL

## Roadmap

### v0.1 — Scaffold (current)
- [ ] Payload config + collections
- [ ] Docker compose dev
- [ ] Admin panel funzionante
- [ ] Seed data (prodotti demo)

### v0.2 — Storefront
- [ ] Homepage con product grid
- [ ] Pagina prodotto
- [ ] Categorie + filtri
- [ ] Search (PostgreSQL ILIKE)

### v0.3 — Commerce
- [ ] Cart (cookie-based)
- [ ] Checkout + Stripe integration
- [ ] Order management
- [ ] Email conferma (Resend)

### v0.4 — Content
- [ ] Blog engine
- [ ] Pagine custom (spedizioni, garanzia, FAQ)
- [ ] SEO (generateMetadata, sitemap.xml, robots.txt)

### v0.5 — Production
- [ ] Meilisearch integration
- [ ] Cloudflare R2 media storage
- [ ] Docker compose production
- [ ] Deploy Hetzner

### v1.0 — Launch
- [ ] Dominio + SSL
- [ ] Feed Google Shopping
- [ ] Feed TrovaPrezzi
- [ ] Fatturazione elettronica SDI (via intermediario)
- [ ] Monitoring (Sentry + Plausible)

## Espansione futura (se necessaria)
- MedusaJS v2 come microservizio commerce (multi-warehouse, promozioni composte, resi)
- Multi-language (Payload i18n)
- Multi-currency (Payload + Stripe multi-currency)
- PWA / App mobile (React Native con stesse API)

## Documenti di riferimento
- Analisi comparativa: `docs/medusa_payload_vendure_analysis.md`
- Stack tecnologico completo: `docs/ecommerce_opensource_stack.md`

---
*Progetto gestito da Claude (Anthropic) + Christian — Aprile 2026*
