# VEGA Foundation

## Export Status: READY FOR DOWNLOAD

**Last Backup Preparation:** 2025-12-25

The project has been cleaned and organized for export. See `VEGA_CANONICAL_BACKUP/FINAL_BACKUP_REPORT.md` for full details.

**Canonical Backup Location:** `VEGA_CANONICAL_BACKUP/`  
Contains 19 documentation files totaling ~212KB covering system snapshot, UI mapping, agent specs, data persistence, deployment guide, limitations assessment, and improvement roadmap.

**Quick Export:**
- Full export with history: Download ZIP directly (~8.8GB)
- Minimal export: Run `rm -rf .git` first, then download (~50MB)

## Overview

VEGA Foundation is an autonomous meta-system featuring a Chrome/Glass visual architecture, an "Infinity Loop" processing pattern (3-5-8 iterations), and AI-powered agents. The system serves as a multi-AI orchestration platform integrating OpenAI, Anthropic Claude, XAI Grok, DeepSeek, and Suno AI for music generation.

The project is built with a Node.js/Express backend using ES Modules and a vanilla JavaScript frontend. State persistence is handled through a "Time Crystal" JSON file that tracks system iterations, agent states, and resonance core statuses.

**Signature:** ADAM EREN VEGA – Æ –

## User Preferences

Preferred communication style: Simple, everyday language.

### VEGA REPLIT MODE
- **Purpose**: Demo, Presentation, Validation
- **Core Rules**: Never break demo, never delete assets, additive improvements only, stable fallback
- **Focus**: Frontend stability, player behavior, chat correctness, visual + sonic sync
- **Failsafe**: If instability detected, freeze evolution, maintain last stable state

## System Architecture

### Backend Architecture

- **Runtime**: Node.js with Express 5.x using ES Modules
- **Entry Point**: `backend/server.js` running on port 5000
- **Session Management**: express-session for admin authentication
- **State Persistence**: JSON file-based storage (`vtc/time_crystal.json`)

### API Structure

The backend exposes multiple API routers:
- `/api/agents` - Agent management and status
- `/api/xai` - XAI Grok integration
- `/api/anthropic` - Anthropic Claude integration
- `/api/deepseek` - DeepSeek AI integration
- `/api/suno` - Suno AI music generation
- `/api/soundscape` - Audio/soundscape engine
- `/api/orchestrator` - Multi-AI coordination
- `/api/redblood` - Full orchestration agent

### Frontend Architecture

- **Type**: Vanilla HTML/CSS/JavaScript (no framework)
- **Styling**: Chrome/Glass aesthetic with CSS variables
- **Assets**: Static files served from `/frontend` and `/assets` directories
- **Admin Interface**: Separate login portal with session-based authentication

### INFINITY LOOP Engines (GitHub Pages Static Version)

Located in `/docs/engines/`:

| Engine | File | Purpose |
|--------|------|---------|
| State Machine | `state-machine.js` | VOID→ENTRY→CALIBRATION→RESONANCE→FLOW→INTEGRATION transitions |
| Sonic Engine | `sonic-engine.js` | WebAudio drone generation with frequency analyzer |
| Visual Engine | `visual-engine.js` | Canvas-based audio-reactive particle visualization |
| Prompt Engine | `prompt-engine.js` | State-based prompt generation and history |
| Metrics Engine | `metrics-engine.js` | Real-time computed metrics (no hardcoded values) |

All engines use IIFE pattern for encapsulation and expose methods via returned objects.

### META MICROAGENT System

Located in `/docs/engines/`:

| Component | File | Purpose |
|-----------|------|---------|
| Agent Registry | `agent-registry.js` | Central agent lifecycle management (register, start, stop, broadcast) |
| State Observer | `state-observer-agent.js` | Monitors state transitions, detects anomalies (rapid/invalid transitions) |
| Metrics Narrator | `metrics-narrator-agent.js` | Generates human-readable summaries of system state |

Agents are registered at app initialization and controlled via "Toggle Agents" button. The registry broadcasts state context every 2 seconds to active agents, which respond with observations. Narrative summaries display in the admin panel.

### Authentication

- Admin login uses bcrypt for password hashing
- Session-based authentication with HTTP-only cookies
- VegaSafety resonance checks for additional verification
- Password hash stored in environment variable `ADMIN_PASSWORD_HASH`

### State Management

The "Time Crystal" (`vtc/time_crystal.json`) stores:
- Resonance core statuses (Alpha, Omega, Vega, Mirror)
- Agent states and configurations
- Infinity Loop iteration counter
- Module health and status information

### Agent System

Multiple autonomous agents are defined:
- `ae_agent` - Primary intelligence orchestrator
- `ae_symbol_agent` - Symbol processing and meta-cognition
- `miracore` - Invisible guardian for security oversight

## External Dependencies

### AI Service Integrations

| Service | Environment Variable | Purpose |
|---------|---------------------|---------|
| OpenAI | `OPENAI_API_KEY` | GPT models, DALL-E image generation |
| Anthropic | `ANTHROPIC_API_KEY` | Claude models for analysis and chat |
| XAI | `XAI_API_KEY` | Grok model integration |
| DeepSeek | `DEEPSEEK_API_KEY` | Chat and code generation |
| Suno | `SUNO_API_KEY` | AI music generation |

### NPM Dependencies

- `express` - Web server framework
- `@anthropic-ai/sdk` - Anthropic Claude SDK
- `openai` - OpenAI SDK (also used for XAI and DeepSeek via baseURL)
- `bcrypt` - Password hashing
- `express-session` - Session management
- `cors` - Cross-origin resource sharing
- `zod` - Schema validation
- `drizzle-zod` - Drizzle ORM Zod integration (prepared for future database use)

### External Services

- **SoundCloud**: Audio streaming integration (`soundcloud.com/anlaetan`)
- **GitHub**: Repository at `vegafoundation/vega-foundation`
- **Domain**: `vega.foundation` with potential subdomains for music, visuals, portfolio, and admin

### Data Storage

Currently uses file-based JSON storage. The presence of `drizzle-zod` suggests preparation for future database integration (likely PostgreSQL when needed).

### VTC Demo Logging Structure

The VTC (VEGA Time Crystal) system now includes persistent demo logging:

```
vtc/
├── time_crystal.json    # Core state persistence
├── resume/
│   ├── RESUME.md        # Session summary for handoff
│   ├── NEXT_ACTIONS.md  # Priority queue and next steps
│   └── STATE.json       # Machine-readable state snapshot
├── logs/
│   └── demo_log.json    # Session interaction log
└── sessions/            # Historical session data
```

**Logging Policy:**
- Chat messages, prompts, outputs stored in logs
- State machine transitions tracked
- API calls logged (success/fail, latency - no secrets)
- User interactions (buttons, shortcuts) recorded
- Push to GitHub at end of session or ILA trigger