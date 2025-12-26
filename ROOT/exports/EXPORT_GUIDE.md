# ROOT Export Guide

How to export ROOT for external use.

---

## Option 1: ZIP Export (Recommended)

### From Replit
1. Click three-dot menu on project
2. Select "Download as ZIP"
3. Result: ~50 MB (without .git)

### From Command Line
```bash
zip -r VEGA_ROOT.zip ROOT/ -x "*.git*"
```

---

## Option 2: Git Push

### Fresh Repository (Clean)
```bash
cd ROOT
git init
git add .
git commit -m "VEGA ROOT - canonical state"
git remote add origin https://github.com/YOUR_USER/VEGA-ROOT.git
git branch -M main
git push -u origin main
```

### Existing Repository (Update)
```bash
git add ROOT/
git commit -m "Update ROOT canonical state"
git push origin main
```

---

## Option 3: Selective Copy

Copy only what you need:

```bash
# Backend only
cp -r ROOT/system/backend/ /path/to/new/project/

# Frontend only
cp -r ROOT/system/frontend/ /path/to/new/project/

# Full system
cp -r ROOT/system/* /path/to/new/project/
```

---

## After Export

1. Create `.env` file with your API keys
2. Run `npm install` in the system directory
3. Start with `node backend/server.js`

---

## Verification

After export, verify:

| Check | Command |
|-------|---------|
| Files present | `ls ROOT/system/` |
| No secrets | `grep -r "sk-" ROOT/` (should be empty) |
| Size reasonable | `du -sh ROOT/` (~2 MB without assets) |

---

**ROOT is stable. Further work should branch, not overwrite.**
