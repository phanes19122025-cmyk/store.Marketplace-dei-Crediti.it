```
CLOUDFLARE_ACCESS_GUIDE
═══════════════════════
DUAL PATH: MCP connector (claude.ai) + raw HTTP (Rube sandbox)

PATH_1: MCP connector (claude.ai direct tools)
  SCOPE: D1 databases, Workers list/get/code, KV namespaces, R2 buckets (when enabled), docs search
  HOW: "Cloudflare Developer Platform:*" tools — direct call from claude.ai
  TOOLS_VERIFIED:
    Cloudflare Developer Platform:d1_databases_list
    Cloudflare Developer Platform:d1_database_query
    Cloudflare Developer Platform:workers_list
    Cloudflare Developer Platform:workers_get_worker
    Cloudflare Developer Platform:workers_get_worker_code
    Cloudflare Developer Platform:kv_namespaces_list
    Cloudflare Developer Platform:r2_buckets_list        ← NEEDS R2 ENABLED FIRST
    Cloudflare Developer Platform:r2_bucket_create
    Cloudflare Developer Platform:search_cloudflare_documentation
  NO_RUBE: these tools do NOT work inside COMPOSIO_REMOTE_WORKBENCH
  AUTH: handled by MCP connector OAuth — broader scope than API token

PATH_2: Rube sandbox (COMPOSIO_REMOTE_WORKBENCH)
  WHY: for operations not covered by MCP (zones, Pages, Tunnels, deploy Workers, account info)
  METHOD: raw HTTP via python requests inside Rube workbench (unrestricted egress)
  TOKEN: Google Sheet KEYs (1oskdD-rxhC3kvWwaY_voa749JZlWgEafnOFoR4c222o) → row 17 col F
  TOKEN_SCOPE: ⚠️ LIMITED — Vectorize Edit + Workers AI Edit ONLY
  TOKEN_CANNOT: list accounts, list zones, list R2 buckets, list Pages projects, manage DNS
  PATTERN:
    import requests
    CF_TOKEN = "..."  # fetched from Sheet KEYs row 17 col F
    headers = {"Authorization": f"Bearer {CF_TOKEN}"}
    requests.get("https://api.cloudflare.com/client/v4/user/tokens/verify", headers=headers)
    # ⚠️ Only Vectorize+AI endpoints work with this token
    # For full API access → create broader token (see ACTION_REQUIRED below)

KNOWN_RESOURCES:
  D1_DATABASES (5):
    listino_MultibrandProject_it | 84e9c831-6546-498c-ac59-7a49b108d415 | 73KB
    architect-sql               | c1aada53-8294-4e44-9a49-36a016efaeee | 122KB
    re-memory-sql               | c3609ccb-2b99-47a0-adcd-194642fe4b59 | 159KB
    activegroup-memory-sql      | da639e71-8223-4a4b-b222-79e6434156cd | 40KB
    activegroup-task-engine      | 8be74b4a-47eb-45d7-b62a-6005072f17bf | 73KB
  WORKERS (2):
    marketplace-checkout | tag:71bf5d07bc724163aa94bb5d4f3cc80a | created:2026-03-25
    rag-memory           | tag:95d8ae0b08704234b75a4db8aed70c1e | created:2026-03-30
  KV_NAMESPACES: 0
  R2_BUCKETS: ❌ NOT ENABLED — needs activation on dashboard
  TUNNEL:
    wweb-active | ID:879586b2-4776-4fe5-8c23-9d0aa5520d91 | → wweb.ACTiVEgroup.it:3002
  VECTORIZE+AI: token active, accessible from Rube workbench

SHEET_KEYS_ROWS:
  Row 16: Cloudflare Tunnel    | TUNNEL_ID   | 879586b2-4776-4fe5-8c23-9d0aa5520d91
  Row 17: Cloudflare Vectorize | Bearer Token | cfut_TQUM8hZh4K...(truncated)

ACTION_REQUIRED_FOR_SHOP:
  1. ENABLE R2:
     dashboard.cloudflare.com → R2 Object Storage → activate (free tier, no CC required if already on file)
  2. CREATE BROADER API TOKEN (optional, for full Rube workbench access):
     dash.cloudflare.com/profile/api-tokens → Create Token
     Permissions needed: Account:Read, Zone:Read, Workers R2 Storage:Edit, Pages:Edit
     Add new token to Google Sheet KEYs as "Cloudflare API (full)" new row
  3. CREATE R2 BUCKET (after R2 enabled):
     Via MCP: Cloudflare Developer Platform:r2_bucket_create name="shop-media"
     Or via dashboard: R2 → Create Bucket → name "shop-media" → region EU

VS_RENDER:
  Render = zero MCP/Composio toolkit, raw HTTP only via Rube workbench
  Cloudflare = MCP connector (broad scope) + raw HTTP (limited token scope)
  PREFER MCP for D1/Workers/KV/R2 operations
  USE raw HTTP only for Vectorize/AI or when MCP lacks the specific endpoint

RELEVANT_FOR_SHOP:
  - R2 bucket "shop-media" → product images storage (Payload CMS S3 adapter)
  - D1 "listino_MultibrandProject_it" → possible product data source for import
  - Worker "marketplace-checkout" → existing checkout prototype, evaluate for reuse
  - Tunnel → not needed for shop (Vercel handles HTTPS)
```
