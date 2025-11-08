# IBAN Validation Feature - Solution Summary

## Root Cause of "object is not a function" Error

### The Problem
The error occurs when Docker is built from the **feature branch** instead of the **`main` branch**.

**Why this happens:**
1. Feature branch already contains committed IBAN code
2. `Dockerfile` does `COPY . .` which copies everything
3. When reviewer tries to apply patches inside Docker, git state is confused
4. Module resolution breaks → "object is not a function"

### The Solution
**Build Docker from `main` branch**, not the feature branch.

```bash
# CRITICAL: Checkout main BEFORE building Docker
git checkout main
docker build -t valibot-test .
```

---

## Correct Testing Workflow

### Step 1: Start from Main Branch
```bash
git checkout main
git status  # Verify clean state
```

### Step 2: Verify Base Tests Pass (Before Any Patches)
```bash
pnpm install
cd library
pnpm exec vitest run
# ✅ Should show: 247 test files, 2712 tests passed
```

**If this fails, the repository has issues unrelated to our patches.**

### Step 3: Apply test.patch
```bash
cd /app  # or repository root
git apply test.patch
```

### Step 4: Run Tests After test.patch
```bash
./test.sh base  # ✅ Should pass (247 test files)
./test.sh new   # ❌ Should fail with "Cannot find module './iban.ts'"
```

This failure is **expected** - implementation doesn't exist yet.

### Step 5: Apply solution.patch
```bash
git apply solution.patch
```

### Step 6: Run Tests After solution.patch
```bash
./test.sh base  # ✅ Should still pass (no regression)
./test.sh new   # ✅ Should now pass (15 tests)
```

---

## File Deliverables

| File | Purpose | Size |
|------|---------|------|
| `test.patch` | Test files only | 6.1K |
| `solution.patch` | Implementation | 4.8K |
| `PROBLEM.md` | Problem description | 1.7K |
| `test.sh` | Test runner script | 626 bytes |
| `Dockerfile` | Docker environment | 271 bytes |
| `REVIEWER_INSTRUCTIONS.md` | Step-by-step guide | 2.7K+ |

---

## Key Points for Reviewer

1. ✅ **Verified locally**: All tests pass on `main` branch
2. ✅ **Patches are correct**: Generated from `main` where IBAN doesn't exist
3. ❌ **Docker must be built from `main`**: Not from feature branch
4. ✅ **Expected behavior**: New tests fail before solution.patch, pass after

---

## Troubleshooting Guide

### Error: "object is not a function"
**Cause**: Docker built from feature branch, not `main`

**Solution**: 
```bash
git checkout main
docker build -t valibot-test .
```

### Error: "Patch does not apply"
**Cause**: Not on `main` branch or working directory is dirty

**Solution**:
```bash
git checkout main
git reset --hard origin/main
git clean -fd
```

### Base Tests Fail Before Patches
**Cause**: Repository or environment issue

**Solution**: This is NOT caused by our patches. Verify:
```bash
git checkout main
cd library
pnpm install
pnpm exec vitest run
```

If this fails, the issue exists in the base repository.

---

## Why This Happens

The repository structure:
- `main` branch: Clean, no IBAN code
- `cursor/setup-feature...` branch: Has committed IBAN code + patches

When building Docker from the feature branch:
- Docker copies all committed files (including IBAN code)
- Patches try to add files that already exist
- Git/module state gets confused
- Import resolution breaks

**Solution**: Always test from `main` branch state.
