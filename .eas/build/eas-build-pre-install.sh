#!/bin/bash
# EAS Build pre-install hook
# Runs before pnpm install on the EAS Build server.
# Uses corepack (built into Node.js) to activate the correct pnpm version
# declared in the root package.json "packageManager" field, then installs
# all workspace deps without the frozen-lockfile restriction.

set -e

echo "==> Activating pnpm via corepack..."
corepack enable
corepack prepare pnpm@10.33.0 --activate

echo "==> pnpm version: $(pnpm --version)"

echo "==> Installing workspace dependencies (no frozen-lockfile)..."
pnpm install --no-frozen-lockfile
