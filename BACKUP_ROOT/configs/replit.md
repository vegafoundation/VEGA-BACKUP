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