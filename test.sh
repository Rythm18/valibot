#!/bin/bash

set -e

case "$1" in
  base)
    echo "Running base tests..."
    cd library
    pnpm test --run
    ;;
  new)
    echo "Running new IBAN feature tests..."
    cd library
    pnpm test --run src/actions/iban/
    ;;
  *)
    echo "Usage: $0 {base|new}"
    echo "  base - Run base repository tests"
    echo "  new  - Run new IBAN feature tests"
    exit 1
    ;;
esac
