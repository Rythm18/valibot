#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests (excluding IBAN)..."
    cd library
    # Temporarily move iban outside src to prevent vitest from discovering it
    if [ -d "src/actions/iban" ]; then
      mkdir -p /tmp/iban-backup
      mv src/actions/iban /tmp/iban-backup/
      # Remove the iban export line
      sed -i.bak "/export \* from '.\/iban\/index.ts'/d" src/actions/index.ts
      pnpm exec vitest run
      # Restore everything
      mv src/actions/index.ts.bak src/actions/index.ts
      mv /tmp/iban-backup/iban src/actions/
      rm -rf /tmp/iban-backup
    else
      pnpm exec vitest run
    fi
    ;;
  new)
    echo "Running new IBAN feature tests..."
    cd library
    # Run with typecheck to validate types (iban.ts exists after solution.patch)
    pnpm exec vitest --typecheck run src/actions/iban/
    ;;
  *)
    echo "Usage: $0 {base|new}"
    echo "  base - Run base repository tests (excluding IBAN)"
    echo "  new  - Run new IBAN feature tests"
    exit 1
    ;;
esac
