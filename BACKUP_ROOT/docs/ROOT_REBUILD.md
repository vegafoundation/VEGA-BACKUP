# ROOT Rebuild Guide

Step-by-step instructions to rebuild VEGA from ROOT.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18+ (recommended: 20.x) |
| npm | 9+ |
| Git | Any |

## Step 1: Install Dependencies

```bash
cd ROOT/system
npm init -y
npm pkg set type="module"
npm install express cors express-session bcrypt openai @anthropic-ai/sdk zod
```

## Step 2: Set Environment Variables

Create `.env` in ROOT/system/:

```
OPENAI_API_KEY=sk-...
SESSION_SECRET=random-string-here
ANTHROPIC_API_KEY=sk-ant-...  # optional
XAI_API_KEY=xai-...           # optional
DEEPSEEK_API_KEY=sk-...       # optional
ADMIN_PASSWORD_HASH=$2b$10$...
```

Generate password hash:
```bash
node -e "require('bcrypt').hash('yourpassword', 10).then(console.log)"
```

## Step 3: Copy State

```bash
mkdir -p vtc
cp ../state/time_crystal.json vtc/
```

## Step 4: Run

```bash
node backend/server.js
```

Server starts at `http://localhost:5000`

## Step 5: Verify

| Check | Expected |
|-------|----------|
| Homepage loads | Chrome/Glass UI visible |
| Cores display | 4 cores with percentages |
| Agents display | 3 agent cards |
| SSE works | Values update every 10 seconds |
| Admin login | `/admin-login` accessible |

## Deploy Options

### Replit
```toml
[deployment]
run = ["node", "backend/server.js"]
deploymentTarget = "autoscale"
```

### Docker
```dockerfile
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "backend/server.js"]
```

### VPS
```bash
npm install -g pm2
pm2 start backend/server.js --name vega
```

---

**ROOT is stable. Further work should branch, not overwrite.**
