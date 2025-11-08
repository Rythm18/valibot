# Add IBAN Validation Action

## Problem Brief

Implement an IBAN (International Bank Account Number) validation action for Valibot. Users need to validate bank account numbers in international formats, commonly used for cross-border payments and financial applications. The validator should verify both format and checksum correctness, accept IBANs with or without spaces, and only accept uppercase input (case-sensitive).

## Agent Instructions

Add a new validation action following existing patterns in the codebase. The implementation should:

1. **Format Validation**: Verify IBAN structure—2 uppercase letters (valid country code), 2 check digits, then 11-30 alphanumeric characters. Reject lowercase letters, invalid country codes (e.g., 'ZZ'), and malformed strings.

2. **Checksum Validation**: Implement the mod-97 algorithm per ISO 13616 standard:
   - Rearrange: move first 4 characters to end
   - Convert letters to numbers (A=10, B=11, ..., Z=35)
   - Calculate mod 97 of the resulting number
   - Valid if remainder equals 1

3. **Space Handling**: Accept IBANs with spaces (normalize by removing) but reject other delimiters like hyphens or underscores.

**Acceptance Criteria**: All provided tests must pass. The validator should accept uppercase IBANs from any country (with/without spaces) and reject invalid checksums, lowercase input, invalid country codes, or malformed formats.

## Test Assumptions

Export function `iban` and types `IbanAction`, `IbanIssue` from `library/src/actions/iban/iban.ts`. Follow the repository's validation action pattern.
