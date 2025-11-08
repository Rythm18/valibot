# Testing Instructions

## Using Docker (Recommended)

### Build the image:
```bash
docker build -t valibot-iban-test .
```

### Run tests:
```bash
# Start container
docker run -it valibot-iban-test

# Inside container - run base tests (should pass)
./test.sh base

# Inside container - run new tests (should fail before solution.patch)
./test.sh new
```

## Local Testing

### Prerequisites:
- Node.js 18+
- pnpm 8+

### Setup:
```bash
# Install dependencies (from repository root)
pnpm install
```

### Run tests:
```bash
# Base tests (should pass)
./test.sh base

# New IBAN tests (should fail until solution.patch is applied)
./test.sh new
```

## Important Notes

- This is a **pnpm workspace monorepo** - always run `pnpm install` from the repository root
- The `test.sh` script runs from the repository root and changes directory to `library/` internally
- Base tests exclude IBAN tests and run without typechecking (since `iban.ts` doesn't exist yet)
- New tests include typechecking (expects `iban.ts` to exist after solution.patch)
