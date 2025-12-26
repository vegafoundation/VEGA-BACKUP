# Deployment and Runtime Guide

## Prerequisites

- Node.js 20+
- npm (included with Node.js)

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| OPENAI_API_KEY | OpenAI API key for GPT models | sk-... |
| ANTHROPIC_API_KEY | Anthropic API key for Claude | sk-ant-... |
| XAI_API_KEY | xAI API key for Grok | xai-... |
| SESSION_SECRET | Random string for session encryption | random-32-char-string |
| ADMIN_PASSWORD_HASH | bcrypt hash of admin password | $2b$10$... |

### Optional

| Variable | Description |
|----------|-------------|
| DEEPSEEK_API_KEY | DeepSeek API key |
| SUNO_API_KEY | Suno AI API key |

### Generate Admin Password Hash

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 10).then(h => console.log(h));"
```

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

```bash
# Create .env file (or set in Replit Secrets)
cp .env.example .env
# Edit .env with your API keys
```

### 3. Start Server

```bash
node backend/server.js
```

### 4. Access Application

```
http://localhost:5000
```

---

## Replit Deployment

### Workflow Configuration

The project uses Replit Workflows:

| Workflow | Command | Purpose |
|----------|---------|---------|
| VEGA Server | `node backend/server.js` | Main application |

### Set Secrets in Replit

1. Open Replit project
2. Go to "Secrets" (lock icon)
3. Add each required environment variable

### Start Workflow

- Workflows auto-start on Replit
- Or click "Run" button

---

## Production Deployment

### Replit Autoscale

Recommended configuration:

```json
{
  "deployment_target": "autoscale",
  "run": ["node", "backend/server.js"]
}
```

### Port Configuration

- Server binds to `0.0.0.0:5000`
- Replit exposes port 5000 to public

---

## Server Configuration

### Express Setup (backend/server.js)

```javascript
const PORT = 5000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Cache control (prevents stale content)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});
```

### Static File Serving

| Route | Directory |
|-------|-----------|
| / | frontend/ |
| /assets | assets/ |

---

## Health Check

```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok","timestamp":"2025-12-25T00:00:00.000Z"}
```

---

## Directory Structure for Deployment

```
/
├── backend/           # Server code (required)
├── frontend/          # Static files (required)
├── vtc/               # State storage (required)
│   └── time_crystal.json
├── assets/            # Static assets (optional)
├── package.json       # Dependencies (required)
└── package-lock.json  # Lockfile (required)
```

---

## Troubleshooting

### Server Won't Start

1. Check Node.js version: `node --version` (requires 20+)
2. Run `npm install` to install dependencies
3. Check for missing environment variables in logs

### API Returns 503

- API key not configured
- Check corresponding `*_API_KEY` environment variable

### Time Crystal Not Found

- Ensure `vtc/time_crystal.json` exists
- Check file permissions
- Verify valid JSON format

### Session Issues

- Ensure `SESSION_SECRET` is set
- Clear browser cookies
- Check `sameSite` cookie settings

### Admin Login Fails

1. Verify `ADMIN_PASSWORD_HASH` is set
2. Ensure hash was generated with bcrypt
3. Username must be exactly `AEVegaAdmin`

---

## Logs

### Console Output

Server logs to stdout:
- Route access
- Admin login attempts
- API errors

### View Logs on Replit

1. Open "Console" tab
2. Or use workflow logs

---

## Maintenance

### Restart Server

On Replit:
- Stop/Start workflow
- Or push new code (auto-restart)

### Update Dependencies

```bash
npm update
```

### Backup State

```bash
cp vtc/time_crystal.json vtc/backup_$(date +%Y%m%d).json
```
