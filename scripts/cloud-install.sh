#!/usr/bin/env bash
set -euo pipefail
cd /workspace/Economic-Statistics
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run test
npm run build
