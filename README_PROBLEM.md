# IBAN Validation Action - Problem Structure

This directory contains a complete problem setup for implementing an IBAN validation action in the Valibot library.

## Files Created

### 1. `PROBLEM.md` (226 words)
Contains the problem description with:
- **Problem Brief**: What to build and expected outcome
- **Agent Instructions**: High-level build plan and acceptance criteria
- **Test Assumptions**: Non-obvious technical requirements (mod-97 algorithm, space handling)

### 2. `test.sh` (executable)
Test runner script with two modes:
- `./test.sh base` - Runs base repository tests to verify nothing breaks
- `./test.sh new` - Runs only the new IBAN feature tests

### 3. `test.patch` (276 lines)
Git diff containing:
- `test.sh` - The test runner script
- `library/src/actions/iban/iban.test.ts` - Main test file with 16 test cases
- `library/src/actions/iban/iban.test-d.ts` - TypeScript type tests

### 4. `solution.patch` (147 lines)
Git diff containing the implementation:
- `library/src/actions/iban/iban.ts` - Main implementation with mod-97 checksum validation
- `library/src/actions/iban/index.ts` - Export file
- `library/src/actions/index.ts` - Updated to export IBAN action
- `library/src/regex.ts` - Added IBAN_REGEX pattern

## Feature Overview

**IBAN Validation Action** validates International Bank Account Numbers with:
- Format validation (2-letter country code + 2 check digits + 11-30 alphanumeric)
- Checksum validation using ISO 13616 mod-97 algorithm
- Support for IBANs with or without spaces
- Rejection of lowercase input (must be uppercase)

## Test Coverage

The tests validate:
✓ Action object structure with various message types
✓ Valid IBANs from 8 countries (Germany, UK, France, Spain, Italy, Netherlands, Belgium, Switzerland)
✓ IBANs with spaces and mixed spacing
✓ Invalid checksums
✓ Invalid country codes
✓ Invalid check digits
✓ Length validation (too short/long)
✓ Invalid characters and lowercase rejection

## Expected Difficulty

**2-3 hours** for an experienced software engineer to:
1. Understand the existing Valibot action pattern
2. Implement IBAN format validation
3. Implement mod-97 checksum algorithm
4. Handle space normalization
5. Write comprehensive tests
6. Integrate with existing codebase

## Usage After Implementation

```typescript
import * as v from 'valibot';

const BankAccountSchema = v.object({
  iban: v.pipe(v.string(), v.iban('Invalid bank account number')),
});

// Valid IBANs
v.parse(BankAccountSchema, { iban: 'DE89370400440532013000' }); // ✓
v.parse(BankAccountSchema, { iban: 'DE89 3704 0044 0532 0130 00' }); // ✓

// Invalid IBANs
v.parse(BankAccountSchema, { iban: 'DE89370400440532013001' }); // ✗ Invalid checksum
v.parse(BankAccountSchema, { iban: 'de89370400440532013000' }); // ✗ Lowercase
```

## Verification

All tests pass:
```bash
./test.sh new
# Test Files  2 passed (2)
# Tests  22 passed (22)
```
