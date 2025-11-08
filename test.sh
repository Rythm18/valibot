#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests (excluding IBAN)..."
    cd library
    # Run tests without typecheck to avoid errors from missing iban.ts
    pnpm vitest run --exclude='**/iban/**'
    ;;
  new)
    echo "Running new IBAN feature tests..."
    cd library
    pnpm test --run src/actions/iban/
    ;;
  *)
    echo "Usage: $0 {base|new}"
    echo "  base - Run base repository tests (excluding IBAN)"
    echo "  new  - Run new IBAN feature tests"
    exit 1
    ;;
esac
