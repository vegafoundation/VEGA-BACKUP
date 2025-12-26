# Data and State Documentation

## State File Location

```
vtc/time_crystal.json
```

## State Schema

```json
{
  "meta": {
    "signature": "string",
    "vtc_version": "string",
    "created": "ISO 8601 date",
    "last_update": "ISO 8601 date",
    "infinity_loop_iteration": "number",
    "open_source": "boolean",
    "unique_assets": "boolean",
    "persistence": "string"
  },
  "alpha_resonance": {
    "status": "online | active | initializing | offline",
    "power": "number (0-100)",
    "last_update": "ISO 8601 date"
  },
  "omega_resonance": { /* same structure */ },
  "vega_resonance": { /* same structure */ },
  "mirror_core": { /* same structure */ },
  "agents": [
    {
      "name": "string",
      "state": "idle | running | active | syncing",
      "description": "string"
    }
  ],
  "modules": {
    "moduleName": {
      "status": "active | inactive",
      "description": "string"
    }
  },
  "infinity_loop": {
    "active": "boolean",
    "current_phase": "3 | 5 | 8",
    "phases": {
      "3": { "name": "string", "description": "string" },
      "5": { "name": "string", "description": "string" },
      "8": { "name": "string", "description": "string" }
    }
  },
  "admin": {
    "username": "string",
    "password_hash": "string (bcrypt, NOT USED - use env var)"
  },
  "subdomains": ["string"],
  "apis": {
    "service": "configured | pending"
  },
  "assets": {
    "canvas": [],
    "soundscapes": [],
    "logos": []
  },
  "analytics": {
    "pageViews": "number",
    "visitors": "number",
    "sessions": []
  },
  "deployment": {
    "github_repo": "string",
    "replit_project": "string",
    "branch": "string",
    "status": "string"
  }
}
```

---

## State Persistence Functions

### Location: backend/server.js

```javascript
const TIME_CRYSTAL = path.join(__dirname, '../vtc/time_crystal.json');

async function loadTimeCrystal() {
  try {
    const data = await fs.readFile(TIME_CRYSTAL, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

async function saveTimeCrystal(data) {
  data.meta = data.meta || {};
  data.meta.last_update = new Date().toISOString();
  await fs.writeFile(TIME_CRYSTAL, JSON.stringify(data, null, 2));
}
```

---

## State Mutation Points

| Endpoint | Mutation | Fields Affected |
|----------|----------|-----------------|
| POST /api/infinity-loop/start | Set active=true | infinity_loop.active |
| POST /api/infinity-loop/stop | Set active=false | infinity_loop.active |
| POST /api/infinity-loop/iterate | Phase advance, power updates | infinity_loop.current_phase, *_resonance.power, agents[].state, modules.*.status, meta.infinity_loop_iteration |
| POST /api/agents/update | Replace agents array | agents |
| POST /api/agents/:name/activate | Set agent state=active | agents[name].state |
| GET /api/analytics | Increment pageViews | analytics.pageViews |

---

## In-Memory State

### Location: backend/memory.js

```javascript
let VEGA_MEMORY = {};

export function updateMemory(update) {
  VEGA_MEMORY = { ...VEGA_MEMORY, ...update };
}

export function getMemory() {
  return VEGA_MEMORY;
}
```

**Endpoints**:
- GET /api/memory → Returns current memory
- POST /api/memory-update → Merges update into memory

**Note**: In-memory state is NOT persisted. Lost on server restart.

---

## Session State

### Location: backend/server.js

```javascript
app.use(session({
  secret: process.env.SESSION_SECRET || 'vega-admin-secret-key-ae',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
```

**Session Fields**:
- `req.session.isAdmin` - Boolean, admin authenticated
- `req.session.username` - String, admin username

---

## Current State Values (Example)

```json
{
  "meta": {
    "signature": "ADAM EREN VEGA – Æ –",
    "vtc_version": "2.0.0",
    "created": "2025-01-01T00:00:00Z",
    "last_update": "2025-12-25T01:32:15.405Z",
    "infinity_loop_iteration": 9632
  },
  "alpha_resonance": { "status": "online", "power": 100 },
  "omega_resonance": { "status": "online", "power": 100 },
  "vega_resonance": { "status": "online", "power": 100 },
  "agents": [
    { "name": "ae_agent", "state": "syncing" },
    { "name": "ae_symbol_agent", "state": "active" },
    { "name": "miracore", "state": "active" }
  ],
  "infinity_loop": {
    "active": true,
    "current_phase": 5
  }
}
```

---

## Data Relationships

```
time_crystal.json
    │
    ├── meta ─────────────────► System metadata, iteration count
    │
    ├── *_resonance ──────────► Displayed in UI core panels
    │                           Updated by infinity-loop/iterate
    │
    ├── agents ───────────────► Displayed in #agents section
    │                           CRUD via /api/agents
    │
    ├── modules ──────────────► Displayed in #modules section
    │                           Updated by infinity-loop/iterate
    │
    ├── infinity_loop ────────► Controls phase cycling
    │                           Displayed in hero phase indicator
    │
    ├── analytics ────────────► Displayed in footer/stats
    │                           SIMULATED values
    │
    └── apis, deployment ─────► Not actively used in UI
```

---

## Backup and Recovery

### Manual Backup
```bash
cp vtc/time_crystal.json vtc/time_crystal_backup_$(date +%Y%m%d).json
```

### Reset to Default
1. Stop server
2. Delete or rename time_crystal.json
3. Create new file with minimal structure
4. Restart server

### Minimal Valid State
```json
{
  "meta": { "vtc_version": "2.0.0" },
  "alpha_resonance": { "status": "offline", "power": 0 },
  "omega_resonance": { "status": "offline", "power": 0 },
  "vega_resonance": { "status": "offline", "power": 0 },
  "agents": [],
  "modules": {},
  "infinity_loop": { "active": false, "current_phase": 3 },
  "analytics": { "pageViews": 0, "visitors": 0 }
}
```
