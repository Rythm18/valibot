# Add IBAN Validation Action

## Problem Brief

Implement an IBAN (International Bank Account Number) validation action for Valibot. Users need to validate bank account numbers in international formats, commonly used for cross-border payments and financial applications. The validator should accept IBANs with or without spaces and verify both format and checksum correctness.

## Agent Instructions

Add a new validation action following the existing pattern used by similar validators like `bic` and `uuid`. The implementation should:

1. **Format Validation**: Check that the input matches IBAN structure (2-letter country code + 2 check digits + 11-30 alphanumeric characters)

2. **Checksum Validation**: Implement the mod-97 algorithm per ISO 13616 standard:
   - Rearrange: move first 4 characters to end
   - Convert letters to numbers (A=10, B=11, ..., Z=35)
   - Calculate mod 97 of the resulting number
   - Valid if remainder equals 1

3. **Handle Spaces**: Accept IBANs with spaces (common in user input) by normalizing them before validation

4. **Integration**: Add the regex pattern to `regex.ts` and export the action from the main actions index

**Acceptance Criteria**: All provided tests must pass. The action should reject invalid checksums, malformed IBANs, and invalid characters while accepting properly formatted IBANs from any country, with or without spacing.

## Test Assumptions

The checksum validation must use the mod-97 algorithm. Input normalization should handle spaces but reject other delimiters like hyphens or underscores.
