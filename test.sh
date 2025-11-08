#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests (excluding IBAN)..."
    cd library
    # Only hide iban if the implementation exists (to avoid module resolution errors)
    # If only test files exist without iban.ts, tests will naturally fail when run
    if [ -f "src/actions/iban/iban.ts" ]; then
      # Implementation exists - temporarily hide to test base functionality
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
      # No implementation yet - run tests normally (will exclude iban via vitest config if needed)
      pnpm exec vitest run --exclude='**/iban/**'
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
