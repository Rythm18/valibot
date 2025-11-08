#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests..."
    cd library
    # If iban tests exist, move them outside library to prevent ANY module resolution issues
    if [ -d "src/actions/iban" ]; then
      echo "  (temporarily hiding IBAN tests)"
      mkdir -p /tmp/iban-temp
      mv src/actions/iban /tmp/iban-temp/
      # Remove iban export if present
      if grep -q "iban" src/actions/index.ts 2>/dev/null; then
        sed -i.bak "/export \* from '.\/iban\/index.ts'/d" src/actions/index.ts
      fi
    fi
    
    # Run all base tests
    pnpm exec vitest run
    
    # Restore iban if it was moved
    if [ -d "/tmp/iban-temp/iban" ]; then
      echo "  (restoring IBAN tests)"
      if [ -f "src/actions/index.ts.bak" ]; then
        mv src/actions/index.ts.bak src/actions/index.ts
      fi
      mv /tmp/iban-temp/iban src/actions/
      rm -rf /tmp/iban-temp
    fi
    ;;
  new)
    echo "Running new IBAN feature tests..."
    cd library
    pnpm exec vitest --typecheck run src/actions/iban/
    ;;
  *)
    echo "Usage: $0 {base|new}"
    echo "  base - Run base repository tests"
    echo "  new  - Run new IBAN feature tests"
    exit 1
    ;;
esac
