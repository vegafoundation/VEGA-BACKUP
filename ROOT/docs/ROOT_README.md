# ROOT

**The Single Source of Truth for VEGA Foundation**

---

## What ROOT Is

ROOT is the canonical, minimal, rebuildable state of the VEGA system.

It contains:
- One copy of all source code (frontend, backend, agents)
- One copy of all documentation
- One snapshot of system state
- Clear metadata about limitations and next steps

Everything in ROOT is:
- Truthful (no invented features)
- Minimal (no duplicates, no bloat)
- Reproducible (can rebuild from scratch)

---

## What ROOT Contains

```
ROOT/
├── system/           # Source code
│   ├── frontend/     # HTML, CSS, JS
│   ├── backend/      # Express server, API routes
│   └── agents/       # Agent definitions
├── docs/             # Documentation
│   ├── SYSTEM_OVERVIEW.md
│   ├── REBUILD_GUIDE.md
│   ├── REALITY_MAP.md
│   └── GLOSSARY.md
├── state/            # Persistent state snapshot
│   └── time_crystal.json
├── meta/             # Project metadata
│   ├── LIMITATIONS.md
│   └── NEXT_DIRECTIONS.md
├── exports/          # Export instructions
│   └── EXPORT_GUIDE.md
└── FINAL_ROOT_REPORT.md
```

---

## How to Use ROOT

1. **To rebuild VEGA**: Follow `docs/REBUILD_GUIDE.md`
2. **To understand the system**: Read `docs/SYSTEM_OVERVIEW.md`
3. **To check what is real vs mock**: See `docs/REALITY_MAP.md`
4. **To continue development**: Branch from ROOT, do not modify ROOT directly

---

## How NOT to Use ROOT

- Do not add new features directly to ROOT
- Do not rename or restructure ROOT folders
- Do not commit experimental code to ROOT
- Do not store secrets or API keys in ROOT

ROOT is frozen. All development happens in branches.

---

## Rebuild Commands

```bash
cd ROOT/system
npm install
node backend/server.js
# Open http://localhost:5000
```

---

**ROOT is stable. Further work should branch, not overwrite.**
