# Cloudflare CDN + Content Backend

This folder provides templates to serve content (JSON, images, media) via Cloudflare R2 + Workers with CDN caching and optional internal‑beta gating.

## Components
- R2 bucket (S3 compatible): object storage for content.
- Worker (content proxy): reads from R2 and sets cache/CORS headers; optional gating.
- CDN: bind a subdomain (e.g., `content-staging.kliniqai.com`) to the Worker route.

## Setup (One‑time)
1) Cloudflare prerequisites
- Create R2 bucket (e.g., `kliniqai-content`).
- Create API token with Workers + R2 access.
- Option A (internal beta): set Cloudflare Access policy for the route; or
  Option B: use shared `BETA_KEY` header checked by the Worker (staging only).

2) Local env
- Copy `.env.cloudflare.example` to `.env.local` and fill values.
- Install tools: `npm i -g wrangler` and AWS CLI.

3) Upload content to R2
- `bash scripts/sync-content-to-r2.sh` (syncs `medical-content-package/` and `Content pipeline/`).

4) Deploy the Worker
- Copy `cloudflare/wrangler.template.toml` to `wrangler.toml` and fill `account_id`, routes, bucket name.
- Deploy: `wrangler deploy cloudflare/worker-content-proxy.js`.

## Accessing Content
- Public GET: `https://<your-content-domain>/content/<path>`
- Example: `/content/medical-content-package/index.json`

## Notes
- For internal beta, prefer Cloudflare Access (email allowlist) over shared keys.
- Do not commit secrets. Rotate `BETA_KEY` for staging when needed.
- Apps should respect `CONTENT_CDN_BASE` env to construct URLs.
