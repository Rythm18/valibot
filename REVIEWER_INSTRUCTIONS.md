# Reviewer Instructions - IBAN Validation Feature

## Critical Setup Requirements

### The Issue with Docker
The repository you're testing is on a **feature branch** that already contains all IBAN code. When you build Docker from this branch, it copies everything, making patch application fail.

### Solution: Test Locally or Use Correct Branch

**Option A: Local Testing (Recommended)**

```bash
# 1. Checkout main branch
git checkout main

# 2. Verify clean state
git status  # Should be clean
ls library/src/actions/iban/  # Should not exist
ls test.sh  # Should not exist

# 3. Install dependencies
pnpm install

# 4. Verify base tests pass BEFORE patches
cd library && pnpm exec vitest run
# Should show: ✅ 247 test files, 2712 tests passed

# 5. Go back to root and apply test.patch
cd ..
git apply test.patch

# 6. Run tests
./test.sh base  # Should pass
./test.sh new   # Should fail (expected - no iban.ts yet)

# 7. Apply solution.patch
git apply solution.patch

# 8. Run tests again
./test.sh base  # Should still pass
./test.sh new   # Should now pass
```

**Option B: Docker from Main Branch**

```bash
# 1. Checkout main branch FIRST
git checkout main

# 2. Build Docker from main
docker build -t valibot-iban-test .
docker run -it valibot-iban-test

# 3. Inside container, follow steps 4-8 from Option A
```

### 3. Inside Docker: Verify Base Tests Pass (Before Any Patches)

```bash
# This should pass - verifies environment is working
cd library
pnpm exec vitest run
```

**Expected**: All base tests pass (~2700+ tests)

**If this fails**, the environment has issues unrelated to our patches.

### 4. Apply test.patch

```bash
# Back to /app root
cd /app

# Apply test.patch
git apply test.patch

# Verify files were added
ls test.sh  # Should exist now
ls library/src/actions/iban/iban.test.ts  # Should exist now
```

### 5. Run Tests After test.patch

```bash
# Base tests should still pass (IBAN tests excluded)
./test.sh base
# Expected: ✅ 247 test files pass

# New tests should FAIL (iban.ts doesn't exist yet!)
./test.sh new
# Expected: ❌ Error: Cannot find module './iban.ts'
```

**This is the correct behavior!** Tests fail because implementation doesn't exist.

### 6. Apply solution.patch

```bash
git apply solution.patch

# Verify implementation was added
ls library/src/actions/iban/iban.ts  # Should exist now
```

### 7. Run Tests After solution.patch

```bash
# Base tests should still pass (no regression)
./test.sh base
# Expected: ✅ 247 test files pass

# New tests should NOW PASS
./test.sh new
# Expected: ✅ 15 tests pass
```

## Troubleshooting

### Error: "object is not a function"

**Cause**: You're not starting from `main` branch, or environment is broken.

**Solution**:
1. Verify you checked out `main` branch
2. Run base tests BEFORE applying any patches
3. If base tests fail before patches, environment has issues

### Error: Patches don't apply cleanly

**Cause**: Not on `main` branch or working directory is dirty.

**Solution**:
```bash
git checkout main
git status  # Should show "nothing to commit, working tree clean"
```

## Summary

The key insight: **patches must be applied starting from `main` branch** where IBAN doesn't exist yet. If you start from the feature branch, the patches won't make sense because the code already exists.
