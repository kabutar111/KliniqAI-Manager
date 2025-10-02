#!/usr/bin/env bash
set -euo pipefail

# Syncs local content to Cloudflare R2 using AWS CLI (S3-compatible).

SOURCE_A="medical-content-package"
SOURCE_B="Content pipeline"

R2_BUCKET="${R2_BUCKET:-}"
CF_ACCOUNT_ID="${CF_ACCOUNT_ID:-}"
R2_ENDPOINT="${R2_ENDPOINT:-}"

if [[ -z "${R2_ACCESS_KEY_ID:-}" || -z "${R2_SECRET_ACCESS_KEY:-}" || -z "$R2_BUCKET" || -z "$CF_ACCOUNT_ID" ]]; then
  echo "Missing required env: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, CF_ACCOUNT_ID, R2_BUCKET" >&2
  echo "Copy .env.cloudflare.example and export vars or use: env $(cat .env.local | xargs) bash $0" >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI not found. Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html" >&2
  exit 1
fi

if [[ -z "$R2_ENDPOINT" ]]; then
  R2_ENDPOINT="https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com"
fi

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"

echo "Syncing $SOURCE_A -> s3://$R2_BUCKET/medical-content-package/"
aws s3 sync "$SOURCE_A" "s3://$R2_BUCKET/medical-content-package/" \
  --endpoint-url "$R2_ENDPOINT" --only-show-errors

echo "Syncing $SOURCE_B -> s3://$R2_BUCKET/content-pipeline/"
aws s3 sync "$SOURCE_B" "s3://$R2_BUCKET/content-pipeline/" \
  --endpoint-url "$R2_ENDPOINT" --only-show-errors

echo "Done. Example URL via Worker: https://<content-domain>/content/medical-content-package/index.json"

