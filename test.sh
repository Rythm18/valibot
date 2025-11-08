#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests (excluding IBAN)..."
    cd library
    # Exclude IBAN tests and tests affected by missing iban module
    pnpm exec vitest run \
      --exclude='**/iban/**' \
      --exclude='**/parseAsync.test.ts' \
      --exclude='**/_getStandardProps.test.ts' \
      --exclude='**/omit.test.ts' \
      --exclude='**/pick.test.ts' \
      --exclude='**/safeParserAsync.test.ts' \
      --exclude='**/getDefaultsAsync.test.ts'
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
