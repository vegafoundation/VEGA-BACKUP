# ROOT Reality Map

What is real, what is mock, what is planned.

---

## System Components

| Component | Path | Status | Notes |
|-----------|------|--------|-------|
| Express server | `system/backend/server.js` | REAL | Port 5000, working |
| Static file serving | `system/backend/server.js` | REAL | Serves frontend/ |
| SSE endpoint | `/api/events` | REAL | Broadcasts updates |
| Time Crystal persistence | `state/time_crystal.json` | REAL | JSON file I/O |
| Infinity Loop timer | `system/backend/server.js` | REAL | 10-second interval |
| Admin authentication | `system/backend/auth/` | REAL | bcrypt + sessions |

## AI Integrations

| Component | Path | Status | Notes |
|-----------|------|--------|-------|
| OpenAI GPT | `system/backend/prompt.js` | REAL | Requires API key |
| Anthropic Claude | `system/backend/api/anthropic.js` | REAL | Requires API key |
| XAI Grok | `system/backend/api/xai.js` | REAL | Requires API key |
| DeepSeek | `system/backend/api/deepseek.js` | REAL | Requires API key |
| Multi-AI Orchestrator | `system/backend/api/orchestrator.js` | REAL | Parallel queries |
| Suno AI | `system/backend/api/suno.js` | MOCK | Untested endpoint |

## Frontend Components

| Component | Path | Status | Notes |
|-----------|------|--------|-------|
| Chrome/Glass UI | `system/frontend/style.css` | REAL | Full theme |
| Main dashboard | `system/frontend/index.html` | REAL | All sections |
| Frontend logic | `system/frontend/app.js` | REAL | SSE, rendering |
| Admin dashboard | `system/frontend/admin.html` | REAL | 5 tabs |
| Admin login | `system/frontend/admin-login.html` | REAL | Form + auth |
| WebAudio soundscape | `system/frontend/app.js` | REAL | Oscillators |

## Data Values

| Value | Source | Status | Notes |
|-------|--------|--------|-------|
| Core power % | Loop iteration | MOCK | Random +5-20 each tick |
| Core status | Derived from power | MOCK | Thresholds only |
| Agent states | Loop iteration | MOCK | Random shuffle |
| Module statuses | Loop iteration | MOCK | 70/30 random |
| Analytics metrics | API endpoint | MOCK | Hardcoded formulas |
| VegaSafety score | Auth function | MOCK | Always 85-100, passes |
| Whitepapers list | API endpoint | MOCK | PDFs don't exist |

## Agents

| Agent | Path | Status | Notes |
|-------|------|--------|-------|
| ae_agent | `system/agents/ae_agent.js` | PLANNED | Class exists, no autonomy |
| ae_symbol_agent | Time Crystal | PLANNED | Label only |
| miracore | Time Crystal | PLANNED | Label only |

## Assets

| Asset | Path | Status | Notes |
|-------|------|--------|-------|
| DALL-E images | `assets/dalle/` | REAL | 37 images, ~32 MB |
| SoundCloud embed | `system/frontend/index.html` | REAL | External iframe |

---

## Summary

| Status | Count |
|--------|-------|
| REAL | 18 |
| MOCK | 8 |
| PLANNED | 3 |

---

**ROOT is stable. Further work should branch, not overwrite.**
