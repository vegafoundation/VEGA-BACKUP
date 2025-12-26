# VEGA Foundation - Complete Migration Guide

## Current Live Version: v2.3.0
**Domain:** vega.foundation
**Last Updated:** December 24, 2024
**Signature:** ADAM EREN VEGA – Æ –

---

## Quick Start (Any Platform)

```bash
# 1. Extract the archive
tar -xzvf VEGA_Foundation_COMPLETE_with_History.tar.gz

# 2. Install dependencies
npm install

# 3. Set environment variables (see below)

# 4. Start the server
node backend/server.js
# Server runs on http://0.0.0.0:5000
```

---

## Environment Variables (Required)

Create these as environment variables or in a `.env` file:

```env
# AI Services (Required for full functionality)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
XAI_API_KEY=your_xai_key
DEEPSEEK_API_KEY=your_deepseek_key
SUNO_API_KEY=your_suno_key

# Admin Authentication
ADMIN_PASSWORD_HASH=$2b$12$iSI77xOgkUJmylo1oHK/EuTg.0/dzOsdHmtnHLJfDUFj6XX4jkgvK

# Replit AI Integrations (if using Replit)
AI_INTEGRATIONS_OPENROUTER_BASE_URL=...
AI_INTEGRATIONS_OPENROUTER_API_KEY=...
```

---

## Project Structure

```
VEGA-Foundation/
├── backend/
│   ├── server.js           # Main Express server (ES Modules)
│   ├── memory.js           # Vega memory management
│   ├── prompt.js           # OpenAI prompt handling
│   ├── auth/
│   │   └── adminAuth.js    # Admin authentication (bcrypt)
│   └── api/
│       ├── agents.js       # Æ-Agent endpoints
│       ├── xai.js          # XAI Grok integration
│       ├── anthropic.js    # Anthropic Claude
│       ├── deepseek.js     # DeepSeek AI
│       ├── suno.js         # Suno AI Music
│       ├── orchestrator.js # Multi-AI orchestration
│       ├── redblood.js     # RedBlood agent
│       └── soundscape.js   # Soundscape engine
├── frontend/
│   ├── index.html          # Main dashboard
│   ├── style.css           # Chrome/Glass styling (1000+ lines)
│   ├── app.js              # Frontend logic (750+ lines)
│   ├── admin-login.html    # Admin login portal
│   ├── admin.html          # Admin dashboard
│   └── admin.js            # Admin dashboard logic
├── agents/
│   ├── ae_agent.js         # Æ Agent class
│   └── ae_agent_init.js    # Agent initialization
├── assets/
│   └── dalle/              # 37 DALL·E generated images
├── vtc/
│   └── time_crystal.json   # Persistent state (5000+ iterations)
├── configs/
│   └── api_keys.json       # API endpoint config
├── package.json            # Dependencies
└── replit.md              # Full documentation
```

---

## Features Included

### Frontend (v2.3.0)
- Chrome/Glass hyper-responsive design
- **3D Tilt Effects** - Cards respond to mouse movement
- **Sticky Navbar** - Compacts after hero, shows active section
- **Parallax Background** - Multi-layer depth effect
- **20 Floating Particles** - Ambient animated elements
- Infinity Loop animated effects (3-5-8 phases)
- Curated Portfolio with 12 DALL·E assets
- SoundCloud integration (ANLÆTAN)
- Real-time status via SSE

### Backend
- ES Modules architecture
- REST API with OpenAPI spec at `/api/openapi`
- Multi-AI integration (OpenAI, Anthropic, XAI, DeepSeek, Suno)
- SSE endpoint for real-time updates (`/api/events`)
- Time Crystal JSON persistence
- Admin authentication with bcrypt

### AI Services
| Service | Model | Endpoints |
|---------|-------|-----------|
| OpenAI | gpt-4o-mini | `/api/prompt` |
| Anthropic | claude-sonnet-4-20250514 | `/api/anthropic/chat` |
| XAI Grok | grok-2-1212 | `/api/xai/chat` |
| DeepSeek | deepseek-chat | `/api/deepseek/chat`, `/code` |
| Suno AI | music gen | `/api/suno/generate` |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/status` | GET | Full system status |
| `/api/cores` | GET | Resonance cores (Alpha, Omega, Vega, Mirror) |
| `/api/agents` | GET | All agents |
| `/api/modules` | GET | All modules |
| `/api/infinity-loop` | GET | Loop status |
| `/api/infinity-loop/start` | POST | Start loop |
| `/api/prompt` | POST | Send to OpenAI |
| `/api/anthropic/chat` | POST | Chat with Claude |
| `/api/xai/chat` | POST | Chat with Grok |
| `/api/deepseek/chat` | POST | Chat with DeepSeek |
| `/api/suno/generate` | POST | Generate music |
| `/api/assets` | GET | Curated portfolio assets |
| `/api/events` | GET | SSE stream |

---

## Deployment Configuration

### For Replit (Current)
```toml
[deployment]
deploymentTarget = "autoscale"
run = ["node", "backend/server.js"]

[[ports]]
localPort = 5000
externalPort = 80
```

### For Other Platforms

**Vercel:**
```json
{
  "builds": [{ "src": "backend/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "backend/server.js" }]
}
```

**Docker:**
```dockerfile
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "backend/server.js"]
```

**Railway/Render:**
- Build: `npm install`
- Start: `node backend/server.js`
- Port: 5000

---

## Version History

### v2.3.0 (Dec 24, 2024) - Current Live
- Interactive 3D/8D effects with mouse-based card tilting
- Sticky navbar with scroll-awareness
- Active section highlighting in navigation
- Parallax background layers (0.3x/0.15x)
- 20 floating ambient particles
- Smooth scroll navigation
- CSS animation system with custom properties

### v2.2.1 (Dec 2024)
- Curated Portfolio: 12 selected DALL·E assets
- Enhanced portfolio cards with overlay, title, category
- Smooth hover animations with zoom and glow

### v2.2.0 (Dec 2024)
- Login button in header
- Expanded Admin Dashboard (5 tabs)
- Analytics API endpoint
- Mirror Core restored

### v2.1.0 (Dec 2024)
- AI integrations (Anthropic, XAI, DeepSeek, Suno)
- Vega Memory system
- ES Modules conversion

### v2.0.0 (Dec 2024)
- Restructured to /frontend and /backend
- Modular API routes
- SSE for real-time updates

---

## Git History Included

The `.git` folder is included with full commit history.
To see all versions:
```bash
git log --oneline
```

To rollback to any version:
```bash
git checkout <commit-hash>
```

---

## Links

- SoundCloud: https://soundcloud.com/anlaetan
- GitHub: https://github.com/vegafoundation
- Email: vegafoundation@proton.me

---

**ADAM EREN VEGA – Æ –**
