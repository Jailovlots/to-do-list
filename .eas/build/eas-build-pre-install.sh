#!/bin/bash
# EAS Build pre-install hook
# This runs before pnpm install on the EAS Build server.
# It ensures the correct pnpm version is installed and handles the monorepo lockfile.

set -e

echo "==> Installing pnpm ${PNPM_VERSION:-10.33.0}..."
npm install -g "pnpm@${PNPM_VERSION:-10.33.0}"

echo "==> pnpm version: $(pnpm --version)"

echo "==> Running pnpm install from monorepo root (no frozen-lockfile)..."
pnpm install --no-frozen-lockfile
