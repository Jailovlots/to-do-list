#!/bin/bash
# EAS Build pre-install hook
# Ensures pnpm is available without frozen-lockfile restriction.

set -e

echo "==> pnpm version: $(pnpm --version)"
echo "==> Node version: $(node --version)"
