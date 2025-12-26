# System Snapshot - Source File Reference

## Backend Files

### Core Server

| File | Path | Purpose | Lines |
|------|------|---------|-------|
| server.js | backend/server.js | Express server, route registration, Time Crystal I/O | ~250 |
| prompt.js | backend/prompt.js | OpenAI prompt handler with memory context | ~30 |
| memory.js | backend/memory.js | In-memory key-value store | ~10 |

### API Routes

| File | Path | Endpoints | Dependencies |
|------|------|-----------|--------------|
| agents.js | backend/api/agents.js | GET /, GET /:name, POST /update, POST /:name/activate | Time Crystal |
| xai.js | backend/api/xai.js | GET /status, POST /chat, POST /analyze | XAI_API_KEY |
| anthropic.js | backend/api/anthropic.js | GET /status, POST /chat, POST /analyze | ANTHROPIC_API_KEY |
| deepseek.js | backend/api/deepseek.js | GET /status, POST /chat, POST /code | DEEPSEEK_API_KEY |
| suno.js | backend/api/suno.js | GET /status, POST /generate, GET /tracks | SUNO_API_KEY |
| soundscape.js | backend/api/soundscape.js | GET /status, GET /tracks, POST /sync | None |
| orchestrator.js | backend/api/orchestrator.js | GET /status, POST /query, POST /synthesize | Multi-AI |
| redblood.js | backend/api/redblood.js | GET /status, POST /generate-visual, POST /generate-music-prompt, POST /infinity-cycle | Multi-AI |

### Authentication

| File | Path | Functions |
|------|------|-----------|
| adminAuth.js | backend/auth/adminAuth.js | validateCredentials(), vegaSafetyCheck(), requireAdmin() |

## Frontend Files

| File | Path | Purpose |
|------|------|---------|
| index.html | frontend/index.html | Main dashboard, all sections |
| admin.html | frontend/admin.html | Admin control panel |
| admin-login.html | frontend/admin-login.html | Admin login form |
| app.js | frontend/app.js | API calls, UI updates, WebAudio soundscape |
| style.css | frontend/style.css | Chrome/Glass styling |

## State Files

| File | Path | Purpose |
|------|------|---------|
| time_crystal.json | vtc/time_crystal.json | Persistent system state |

## Agent Files

| File | Path | Purpose |
|------|------|---------|
| ae_agent.js | agents/ae_agent.js | AE Agent class (CommonJS) |
| ae_agent_init.js | agents/ae_agent_init.js | Agent initialization |

## Configuration Files

| File | Path | Purpose |
|------|------|---------|
| api_keys.json | configs/api_keys.json | API key documentation (no secrets) |
| .env.example | .env.example | Environment variable template |
| package.json | package.json | NPM dependencies |

## Asset Directories

| Directory | Path | Contents |
|-----------|------|----------|
| DALL-E | assets/dalle/ | AI-generated images (~40 files) |
| Attachments | attached_assets/ | User-attached files |

## Key Dependencies (package.json)

```json
{
  "@anthropic-ai/sdk": "AI SDK",
  "bcrypt": "Password hashing",
  "cors": "Cross-origin support",
  "express": "Web framework",
  "express-session": "Session management",
  "openai": "OpenAI/xAI/DeepSeek SDK",
  "zod": "Schema validation"
}
```

## Environment Variables Required

| Variable | Used By | Required |
|----------|---------|----------|
| OPENAI_API_KEY | prompt.js, orchestrator.js | Yes |
| ANTHROPIC_API_KEY | anthropic.js, orchestrator.js, redblood.js | Yes |
| XAI_API_KEY | xai.js, orchestrator.js, redblood.js | Yes |
| DEEPSEEK_API_KEY | deepseek.js, orchestrator.js | Optional |
| SUNO_API_KEY | suno.js | Optional |
| SESSION_SECRET | server.js | Yes |
| ADMIN_PASSWORD_HASH | adminAuth.js | Yes |
