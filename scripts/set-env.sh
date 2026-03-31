#!/usr/bin/env bash
set -e

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "staging" ]; then
  cp .env.staging .env
  echo "Using LOCAL Supabase config for staging branch"
elif [ "$BRANCH" = "master" ]; then
  cp .env.production .env
  echo "Using PRODUCTION Supabase config for master branch"
else
  echo "Unknown branch: $BRANCH"
  echo "Leaving .env unchanged"
fi