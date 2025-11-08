#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests (excluding IBAN)..."
    cd library
    # If iban directory exists, we MUST hide it to prevent vitest from collecting broken imports
    # This applies whether implementation exists or not - test files alone break module resolution
    if [ -d "src/actions/iban" ]; then
      mkdir -p /tmp/iban-backup
      mv src/actions/iban /tmp/iban-backup/
      # Also remove iban export if it exists
      if grep -q "iban" src/actions/index.ts; then
        sed -i.bak "/export \* from '.\/iban\/index.ts'/d" src/actions/index.ts
      fi
      pnpm exec vitest run
      # Restore everything
      if [ -f "src/actions/index.ts.bak" ]; then
        mv src/actions/index.ts.bak src/actions/index.ts
      fi
      mv /tmp/iban-backup/iban src/actions/
      rm -rf /tmp/iban-backup
    else
      # No iban directory at all - run tests normally
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
