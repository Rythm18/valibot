# Reviewer Instructions - IBAN Validation Feature

## Important: Starting Point

**You MUST start from the `main` branch** before applying patches. The patches are generated relative to `main`, not the feature branch.

## Step-by-Step Testing Workflow

### 1. Start from Clean State (CRITICAL!)

```bash
# Switch to main branch (before any IBAN work)
git checkout main

# Verify you're on main
git branch
# Should show: * main

# Verify IBAN doesn't exist yet
ls library/src/actions/iban/
# Should show: No such file or directory

# Verify test.sh doesn't exist
ls test.sh
# Should show: No such file or directory
```

### 2. Build Docker Environment

```bash
docker build -t valibot-iban-test .
docker run -it valibot-iban-test
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
