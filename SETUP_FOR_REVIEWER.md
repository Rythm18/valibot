# CRITICAL: How to Test This Problem Correctly

## The Issue

The Dockerfile in this repository is on the feature branch, which already contains all IBAN code. This causes the reviewer's setup to fail.

## The Solution

**DO NOT build Docker from this repository directory.** Instead:

### Step 1: Get the Files

Copy these files to a separate location:
- `test.patch`
- `solution.patch`
- `PROBLEM.md`
- `Dockerfile`

### Step 2: Clone Fresh Valibot

```bash
# Clone main valibot repo
git clone https://github.com/fabian-hiller/valibot.git valibot-test
cd valibot-test

# Checkout the base commit (main branch)
git checkout 3833d69d

# Verify IBAN doesn't exist
ls library/src/actions/iban/  # Should fail - doesn't exist
```

### Step 3: Copy Files and Apply test.patch

```bash
# Copy the files you saved in Step 1
cp /path/to/test.patch .
cp /path/to/solution.patch .
cp /path/to/Dockerfile .

# Apply test.patch
git apply test.patch

# Verify
ls test.sh  # Should exist
ls library/src/actions/iban/  # Should have 2 test files only
```

### Step 4: Build and Test in Docker

```bash
# Build Docker (now from clean main + test.patch)
docker build -t valibot-test .
docker run -it valibot-test

# Inside container
./test.sh base  # ✅ Should pass: 247 files, 2712 tests
./test.sh new   # ❌ Should fail: no iban.ts

# Apply solution
git apply solution.patch

# Test again
./test.sh base  # ✅ Should still pass
./test.sh new   # ✅ Should now pass: 15 tests
```

---

## Why This Matters

**The Problem:**
- This repo is on feature branch with IBAN code already committed
- `COPY . .` in Dockerfile copies all IBAN files
- Patches can't apply correctly
- Module resolution breaks

**The Solution:**
- Start from clean main branch clone
- Apply patches there
- Then build Docker

---

## Alternative: Simpler Dockerfile

Use this Dockerfile that explicitly checks out main:

```dockerfile
FROM public.ecr.aws/x8v8d7g8/mars-base:latest
WORKDIR /app

# Clone main branch directly
RUN git clone https://github.com/fabian-hiller/valibot.git . && \
    git checkout 3833d69d

# Install dependencies
RUN pnpm install

CMD ["/bin/bash"]
```

Then mount patches as volumes:
```bash
docker run -it -v $(pwd)/test.patch:/app/test.patch -v $(pwd)/solution.patch:/app/solution.patch valibot-test
```

---

## Summary

**Don't build Docker from the feature branch directory.** Either:
1. Clone fresh main branch, copy files there, then build Docker
2. Use Dockerfile that clones main branch directly

The patches themselves are correct and verified working.
