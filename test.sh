#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests..."
    cd library
    
    # Strategy: Temporarily move iban directory to prevent module resolution issues
    IBAN_MOVED=false
    BACKUP_DIR="/tmp/valibot-iban-backup"
    
    if [ -d "src/actions/iban" ]; then
      echo "  [Hiding IBAN tests]"
      rm -rf "$BACKUP_DIR"
      mkdir -p "$BACKUP_DIR"
      mv src/actions/iban "$BACKUP_DIR/"
      
      # Remove iban export from actions/index.ts
      if grep -F "iban" src/actions/index.ts >/dev/null 2>&1; then
        grep -v "iban" src/actions/index.ts > src/actions/index.ts.tmp
        mv src/actions/index.ts.tmp src/actions/index.ts
      fi
      IBAN_MOVED=true
    fi
    
    # Run base tests
    pnpm exec vitest run
    TEST_RESULT=$?
    
    # Always restore iban directory if we moved it
    if [ "$IBAN_MOVED" = true ] && [ -d "$BACKUP_DIR/iban" ]; then
      echo "  [Restoring IBAN tests]"
      mv "$BACKUP_DIR/iban" src/actions/
      rm -rf "$BACKUP_DIR"
      
      # Restore iban export (add after hexColor line)
      if ! grep -F "iban" src/actions/index.ts >/dev/null 2>&1; then
        sed -i "/export \* from '.\/hexColor\/index.ts';/a export * from './iban/index.ts';" src/actions/index.ts
      fi
    fi
    
    exit $TEST_RESULT
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
