# VEGA Foundation - Rebuild Guide

**Generated**: 2025-12-25  
**Purpose**: Step-by-step instructions to recreate this system from scratch

---

## Prerequisites

### Required Software
- Node.js 18+ (recommended: 20.x)
- npm 9+
- Git
- Text editor / IDE

### Required API Keys
- OpenAI API key (for GPT models)
- Anthropic API key (for Claude models)
- Optional: XAI, DeepSeek, Suno keys

---

## Step 1: Initialize Project

```bash
mkdir vega-foundation && cd vega-foundation
npm init -y
npm pkg set type="module"
```

## Step 2: Install Dependencies

```bash
npm install express cors express-session bcrypt \
  openai @anthropic-ai/sdk \
  zod drizzle-zod zod-validation-error \
  p-limit p-retry
```

## Step 3: Create Directory Structure

```bash
mkdir -p backend/api backend/auth frontend agents assets/dalle vtc configs
```

## Step 4: Create Core Source Files

### Required File Manifest

| Path | Purpose | Lines | Required |
|------|---------|-------|----------|
| backend/server.js | Express main entry | ~300 | Yes |
| backend/memory.js | Volatile state store | 9 | Yes |
| backend/prompt.js | OpenAI chat wrapper | 29 | Yes |
| backend/auth/adminAuth.js | bcrypt auth + session | 49 | Yes |
| backend/api/agents.js | Agent CRUD endpoints | 70 | Yes |
| backend/api/orchestrator.js | Multi-AI coordinator | 232 | Optional |
| backend/api/anthropic.js | Claude integration | 95 | Optional |
| backend/api/xai.js | Grok integration | 100 | Optional |
| backend/api/deepseek.js | DeepSeek integration | 95 | Optional |
| backend/api/suno.js | Music generation | 87 | Optional |
| backend/api/soundscape.js | Audio sync | 44 | Optional |
| backend/api/redblood.js | Orchestration agent | 207 | Optional |
| frontend/index.html | Main dashboard | ~300 | Yes |
| frontend/style.css | Chrome/Glass styling | ~1000 | Yes |
| frontend/app.js | Frontend logic | ~750 | Yes |
| frontend/admin-login.html | Admin portal | 270 | Optional |
| frontend/admin.html | Admin dashboard | ~900 | Optional |
| frontend/admin.js | Admin logic | ~150 | Optional |
| agents/ae_agent.js | Agent class definition | ~50 | Optional |
| vtc/time_crystal.json | Persistent state | JSON | Yes |

### 4.1 Backend Entry Point (backend/server.js)

Create an Express ES Modules server that:
- Binds to port 5000
- Serves frontend/ as static files
- Registers API routes under /api/*
- Uses express-session for authentication
- Implements SSE at /api/events
- Runs an Infinity Loop interval (every 10 seconds)

**Skeleton structure:**
```javascript
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { promises as fs } from 'fs';
import path from 'path';

// Import API routers
import { router as agentsRouter, init as initAgents } from './api/agents.js';
import orchestratorRouter from './api/orchestrator.js';
// ... other routers

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));

// Time Crystal loader/saver
const VTC_PATH = './vtc/time_crystal.json';
async function loadVTC() { return JSON.parse(await fs.readFile(VTC_PATH, 'utf-8')); }
async function saveVTC(data) { await fs.writeFile(VTC_PATH, JSON.stringify(data, null, 2)); }

// Static files
app.use(express.static('./frontend'));
app.use('/assets', express.static('./assets'));

// API routes
app.use('/api/agents', agentsRouter);
app.use('/api/orchestrator', orchestratorRouter);
// ... mount other routers

// SSE endpoint
const sseClients = [];
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  sseClients.push(res);
  req.on('close', () => sseClients.splice(sseClients.indexOf(res), 1));
});

function broadcast(event, data) {
  sseClients.forEach(res => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
}

// Infinity Loop
setInterval(async () => {
  const vtc = await loadVTC();
  vtc.infinity_loop_iteration = (vtc.infinity_loop_iteration || 0) + 1;
  // Update core powers with random +5-20
  vtc.resonance_cores?.forEach(core => {
    core.power = Math.min(100, (core.power || 50) + Math.floor(Math.random() * 16) + 5);
  });
  await saveVTC(vtc);
  broadcast('vtc_update', vtc);
}, 10000);

app.listen(5000, '0.0.0.0', () => console.log('VEGA running on port 5000'));
```

### 4.2 Memory Store (backend/memory.js)

```javascript
let VEGA_MEMORY = {};
export function updateMemory(update) { VEGA_MEMORY = { ...VEGA_MEMORY, ...update }; }
export function getMemory() { return VEGA_MEMORY; }
```

### 4.3 OpenAI Prompt Handler (backend/prompt.js)

```javascript
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handlePrompt(prompt, memory) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `VEGA AI Assistant. Context: ${JSON.stringify(memory)}` },
      { role: 'user', content: prompt }
    ],
    max_tokens: 1000
  });
  return response.choices[0].message.content;
}
```

### 4.4 Admin Authentication (backend/auth/adminAuth.js)

```javascript
import bcrypt from 'bcrypt';

const ADMIN_USERNAME = 'AEVegaAdmin';

export async function validateCredentials(username, password) {
  if (username !== ADMIN_USERNAME) return { success: false, message: 'Invalid credentials' };
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return { success: false, message: 'Config error' };
  const valid = await bcrypt.compare(password, hash);
  return valid ? { success: true } : { success: false, message: 'Invalid credentials' };
}

export function vegaSafetyCheck() {
  const score = Math.floor(Math.random() * 16) + 85; // Always 85-100
  return { score, passed: true, message: 'Resonance aligned' };
}

export function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  res.redirect('/admin-login');
}
```

### 4.5 Time Crystal Initial State (vtc/time_crystal.json)

```json
{
  "system_active": true,
  "infinity_loop_iteration": 0,
  "last_update": "2025-01-01T00:00:00.000Z",
  "resonance_cores": [
    { "id": "alpha", "name": "Alpha Core", "power": 50, "status": "online" },
    { "id": "omega", "name": "Omega Core", "power": 50, "status": "online" },
    { "id": "vega", "name": "Vega Core", "power": 50, "status": "online" },
    { "id": "mirror", "name": "Mirror Core", "power": 50, "status": "online" }
  ],
  "agents": [
    { "name": "ae_agent", "type": "primary", "state": "idle" },
    { "name": "ae_symbol_agent", "type": "secondary", "state": "idle" },
    { "name": "miracore", "type": "utility", "state": "idle" }
  ],
  "modules": [
    { "name": "health", "enabled": true, "status": "active" },
    { "name": "consciousness", "enabled": true, "status": "active" },
    { "name": "relax", "enabled": true, "status": "active" },
    { "name": "spirits", "enabled": true, "status": "active" }
  ]
}
```

### 4.6 Frontend Index (frontend/index.html)

Create HTML with:
- Chrome/Glass design variables in CSS
- Header with Æ symbol and navigation
- Hero section with "Activate System" button
- Cores display with 4 status cards
- Agents section with agent cards
- Portfolio gallery grid
- SoundCloud embed iframe
- Footer with signature

### 4.7 Frontend Styles (frontend/style.css)

CSS variables for Chrome/Glass theme:
```css
:root {
  --primary: #00ffff;
  --secondary: #00ff88;
  --bg-dark: #0a0a0f;
  --text: #ffffff;
  --text-dim: rgba(255,255,255,0.6);
}
```

Key visual patterns:
- backdrop-filter: blur(20px) for glass effect
- box-shadow with cyan glow
- gradient borders using ::before pseudo-elements
- CSS animations for floating particles

## Step 5: Create Environment File

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...
DEEPSEEK_API_KEY=sk-...
SESSION_SECRET=your-random-secret
ADMIN_PASSWORD_HASH=$2b$10$...
```

Generate password hash:
```bash
node -e "require('bcrypt').hash('your-password', 10).then(console.log)"
```

## Step 6: Add Assets

Copy DALL-E images to assets/dalle/ or generate new ones.

## Step 7: Run

```bash
node backend/server.js
# Open http://localhost:5000
```

## Verification Checklist

- [ ] Homepage loads with animations
- [ ] "Activate System" plays soundscape
- [ ] Core percentages update via SSE
- [ ] Agent/module cards display
- [ ] Portfolio images load
- [ ] SoundCloud embed works
- [ ] Admin login works
- [ ] AI endpoints respond

## Production Deployment

See 05_DEPLOYMENT_AND_RUNTIME/README.md for Docker, VPS, and cloud platform instructions.
