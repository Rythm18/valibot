# Add IBAN Validation Action

## Problem Brief

Implement an IBAN (International Bank Account Number) validation action for Valibot. Users need to validate bank account numbers in international formats, commonly used for cross-border payments and financial applications. The validator should accept properly formatted uppercase IBANs with or without spaces and verify both format and checksum correctness.

## Agent Instructions

Add a new validation action following existing patterns in the codebase. The implementation should:

1. **Format Validation**: Verify IBAN structure—2 uppercase letters (valid country code), 2 check digits, then 11-30 alphanumeric characters. Reject lowercase input, invalid country codes (e.g., 'ZZ'), and malformed strings.

2. **Checksum Validation**: Implement the mod-97 algorithm per ISO 13616:
   - Rearrange: move first 4 characters to end
   - Convert letters to numbers (A=10, B=11, ..., Z=35)
   - Calculate mod 97 of the resulting number
   - Valid if remainder equals 1

3. **Normalization**: Remove spaces before validation but reject other delimiters (hyphens, underscores).

**Acceptance Criteria**: All provided tests must pass. The validator should accept uppercase IBANs from any country (with/without spaces) and reject invalid checksums, lowercase input, non-existent country codes, or malformed formats.

## Test Assumptions

Implement as `iban` function exported from `library/src/actions/iban/iban.ts`. Export types `IbanAction` and `IbanIssue` following the repository's action pattern. Use mod-97 algorithm for checksum validation.
