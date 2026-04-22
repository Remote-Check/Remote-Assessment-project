# Blank Preview Troubleshooting

## Current Status
You switched to a **simple test app** that should definitely render.

## What You Should See Now
A blue box with:
- "✓ MoCA Assessment App"
- "App Status: WORKING"
- Explanations about the console warnings

## If You DON'T See Anything:

### Test 1: Ultra-Minimal
```bash
cp src/app/App.hello.tsx src/app/App.tsx
```
This renders just "Hello from React!" - the absolute minimum.

**If this shows:** React works, issue is with components/router
**If this doesn't show:** Deeper Figma Make environment issue

### Test 2: Check Console Errors
Look for errors OTHER than the Jotai/multiple renderers warnings:
- Import errors?
- Syntax errors?
- Module not found?

### Test 3: Restore Full App
```bash
mv src/app/App.full-router.tsx src/app/App.tsx
```

## Current File Versions:

- `App.tsx` (ACTIVE) - Simple test with styling
- `App.hello.tsx` - Absolute minimum (just text)
- `App.full-router.tsx` - Full app with routing
- `App.backup.tsx` - Original backup

## Common Issues:

### 1. Hash Routing Not Initializing
The full app uses `window.location.hash` which might not work in iframes.
**Fix:** The simple test doesn't use routing - if it shows, routing is the issue.

### 2. Component Import Errors
If a component fails to import, the whole app crashes.
**Check:** Browser console for "Module not found" or "Cannot find"

### 3. Figma Make Hot Reload
Sometimes the preview gets stuck.
**Fix:** Refresh the Figma Make page entirely

## What's Currently Active:
```
src/app/App.tsx = App.simple.tsx (styled test app)
```

## To Switch Versions:

### Simple Test (Current):
```bash
cp src/app/App.simple.tsx src/app/App.tsx
```

### Hello World:
```bash  
cp src/app/App.hello.tsx src/app/App.tsx
```

### Full App:
```bash
cp src/app/App.full-router.tsx src/app/App.tsx
```

### Original Backup:
```bash
cp src/app/App.backup.tsx src/app/App.tsx
```

## Debug Commands:

```bash
# Check what's active
cat src/app/App.tsx | head -20

# List all versions
ls -lh src/app/App*.tsx

# Check for import errors in components
grep "^import" src/app/components/LandingHub.tsx
```
