# 05_DEPLOYMENT_AND_RUNTIME - Deployment Guide

Generated: 2025-12-25

## Current Deployment

### Replit Environment

| Property | Value |
|----------|-------|
| Platform | Replit |
| Runtime | Node.js 20.x |
| Entry Point | backend/server.js |
| Port | 5000 |
| Host | 0.0.0.0 |

### How the Current Site Runs

1. Replit starts the Node.js environment
2. Executes `node backend/server.js`
3. Express server binds to 0.0.0.0:5000
4. Static files served from /frontend and /assets
5. API endpoints available at /api/*
6. If infinity_loop.active is true in time_crystal.json, the loop auto-starts

---

## Local Development Setup

### Prerequisites

- Node.js 18+ (tested on 20.x)
- npm 9+
- Git (optional)

### Steps to Run Locally

```bash
# 1. Clone or extract project
git clone <repository-url>
cd vega-foundation

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env with your API keys

# 4. Start server
node backend/server.js

# 5. Access site
open http://localhost:5000
```

### Required Environment Variables

Create a `.env` file with:

```bash
# Required for AI features
OPENAI_API_KEY=sk-...

# Required for Claude features
ANTHROPIC_API_KEY=sk-ant-...

# Optional AI integrations
XAI_API_KEY=xai-...
DEEPSEEK_API_KEY=sk-...
SUNO_API_KEY=...

# Security
SESSION_SECRET=your-random-secret-here
ADMIN_PASSWORD_HASH=$2b$10$...  # bcrypt hash

# Generate password hash:
# node -e "require('bcrypt').hash('your-password', 10).then(console.log)"
```

---

## Deployment to Other Platforms

### Vercel / Netlify (NOT RECOMMENDED)

These platforms are designed for static sites or serverless functions. This project requires:
- Persistent file system (for time_crystal.json)
- Long-running process (for SSE and Infinity Loop)
- Port binding

**Not compatible without significant refactoring.**

### Railway / Render

```bash
# railway.json or render.yaml
{
  "build": {
    "command": "npm install"
  },
  "start": {
    "command": "node backend/server.js"
  },
  "env": {
    "PORT": "5000",
    "NODE_ENV": "production"
  }
}
```

**Note**: File-based persistence (time_crystal.json) will reset on each deploy. Requires migration to database.

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "backend/server.js"]
```

```bash
# Build and run
docker build -t vega-foundation .
docker run -p 5000:5000 \
  -e OPENAI_API_KEY=sk-... \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e SESSION_SECRET=random-secret \
  -v $(pwd)/vtc:/app/vtc \
  vega-foundation
```

**Important**: Mount /vtc as a volume to persist state.

### VPS (DigitalOcean, AWS EC2, etc.)

```bash
# 1. SSH into server
ssh user@your-server

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone project
git clone <repository-url>
cd vega-foundation

# 4. Install dependencies
npm install --production

# 5. Set up environment
nano .env
# Add all required variables

# 6. Install PM2 for process management
sudo npm install -g pm2

# 7. Start application
pm2 start backend/server.js --name vega

# 8. Set up startup script
pm2 startup
pm2 save

# 9. (Optional) Set up nginx reverse proxy
sudo apt install nginx
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name vega.foundation;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # SSE support
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
```

---

## Production Considerations

### What Needs to Change

| Issue | Current State | Production Requirement |
|-------|---------------|----------------------|
| State persistence | JSON file | PostgreSQL database |
| Session storage | RAM | Redis or database |
| Error handling | Console logs | Structured logging + monitoring |
| Cache headers | Disabled | Proper caching strategy |
| SSL/TLS | None (Replit provides) | Let's Encrypt or similar |
| Process management | None | PM2 or systemd |
| Rate limiting | None | Add express-rate-limit |
| Input validation | Minimal | Full validation |

### Security Checklist

- [ ] All API keys in environment variables (not in code)
- [ ] ADMIN_PASSWORD_HASH is a proper bcrypt hash
- [ ] SESSION_SECRET is cryptographically random
- [ ] HTTPS enabled
- [ ] CORS configured properly for production domain
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation on all POST endpoints
- [ ] No debug information exposed in errors

### Performance Considerations

| Area | Current | Recommended |
|------|---------|-------------|
| File reads | Every API call | Cache with invalidation |
| SSE connections | Unlimited | Set max connections |
| AI calls | No rate limiting | Add queue/throttling |
| Static assets | No CDN | Use CDN for images |

---

## Deployment Risks

### File System Dependency

The current architecture assumes:
1. The /vtc directory exists and is writable
2. time_crystal.json survives deployments
3. No concurrent write conflicts

**Risk**: Most cloud platforms use ephemeral file systems.

### SSE Connection Limits

Server-Sent Events connections:
- Each browser tab = 1 persistent connection
- No cleanup for stale connections
- Could exhaust server resources

**Risk**: Memory leak under heavy usage.

### Missing Steps

Currently missing for production:

1. **No health check endpoint with dependencies**
   - /api/health only returns static OK
   - Should check database, file system, AI connectivity

2. **No graceful shutdown**
   - Doesn't close SSE connections cleanly
   - Doesn't save state before exit

3. **No backup strategy**
   - time_crystal.json has no backup
   - No restore procedure documented

4. **No monitoring**
   - No metrics endpoint
   - No error tracking integration
   - No uptime monitoring

---

## Quick Start Commands

### Development

```bash
npm install
node backend/server.js
```

### Production (with PM2)

```bash
npm ci --only=production
pm2 start backend/server.js --name vega -i max
```

### Docker

```bash
docker build -t vega .
docker run -d -p 5000:5000 --env-file .env -v vega-data:/app/vtc vega
```

---

## File Permissions

Required permissions:

| Path | Permission | Purpose |
|------|------------|---------|
| /vtc/time_crystal.json | Read/Write | State persistence |
| /frontend/* | Read | Static file serving |
| /assets/* | Read | Image serving |
| /node_modules/* | Read | Dependencies |
