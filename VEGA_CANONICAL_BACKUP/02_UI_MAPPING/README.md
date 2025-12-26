# 02_UI_MAPPING - Component Inventory and Data Sources

Generated: 2025-12-25

## Overview

This document maps every UI component to its:
- File location
- Displayed values
- Data source (hardcoded / simulated / real API)
- Dependencies

## Component Inventory

### Header Components

| Component | Location | Data Source | Values |
|-----------|----------|-------------|--------|
| Logo (Æ symbol) | index.html:17 | Hardcoded | "Æ" text |
| Logo text | index.html:18 | Hardcoded | "VEGA.foundation" |
| Navigation links | index.html:21-31 | Hardcoded | 10 static links |
| Login button | index.html:34 | Hardcoded | Links to /admin-login |
| Loop status indicator | index.html:35-38 | Real API | /api/status → infinity_loop.active |

### Hero Section (id="home")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Infinity ring animation | index.html:43-52 | CSS animation | Pure visual |
| Æ monolith | index.html:55-58 | Hardcoded | Static visual |
| Title "VEGA.foundation" | index.html:59 | Hardcoded | Static text |
| Subtitle | index.html:60 | Hardcoded | Static tagline |
| "Activate System" button | index.html:63 | Triggers API | POST /api/infinity-loop/start |
| SoundCloud link | index.html:64-66 | Hardcoded URL | soundcloud.com/anlaetan |
| Signature | index.html:68 | Hardcoded | "ADAM EREN VEGA – Æ –" |
| Core mini displays | index.html:71-84 | Real API | /api/status → resonance powers |

### Vision Section (id="about")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Section title | index.html:90 | Hardcoded | "Our Vision" |
| Intro text | index.html:91 | Hardcoded | Static description |
| Alpha Resonance status | index.html:93-95 | Real API | /api/status → alpha_resonance |
| Omega Resonance status | index.html:97-99 | Real API | /api/status → omega_resonance |
| Vega Resonance status | index.html:101-103 | Real API | /api/status → vega_resonance |

### Services Section (id="services")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Service cards (4) | index.html:114-134 | Hardcoded | Static descriptions |
| AI Integration | index.html:114-118 | Hardcoded | Description only |
| Soundscape Engine | index.html:119-123 | Hardcoded | Description only |
| Autonomous Agents | index.html:124-128 | Hardcoded | Description only |
| Time Crystal | index.html:129-133 | Hardcoded | Description only |

### Agents Section (id="agents")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Section title | index.html:140 | Hardcoded | "Autonomous Agents" |
| Agent cards container | index.html:142 | Real API | /api/agents dynamically populated |
| Card content | app.js:81-113 | Real API + Fallback | agent.name, description, state from API |

#### Agent Card Structure (Dynamic)

```javascript
{
  name: "ae_agent",           // From Time Crystal
  description: "...",         // From Time Crystal or fallback
  state: "idle|active|running|syncing"  // From Time Crystal
}
```

### Modules Section (id="modules")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Section title | index.html:148 | Hardcoded | "VEGA Modules" |
| Module cards container | index.html:150 | Real API | /api/status → modules |
| Card content | app.js:153-185 | Real API + Fallback | module names, descriptions, status |

#### Module Card Structure (Dynamic)

```javascript
{
  name: "health|consciousness|...",
  description: "...",         // From Time Crystal or fallback
  status: "active|inactive"   // From Time Crystal
}
```

### Portfolio Section (id="portfolio")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Section title | index.html:156 | Hardcoded | "DALL·E Assets" |
| Image grid | index.html:158 | Real API | /api/assets → curated list |
| Image paths | backend/server.js:238-262 | Hardcoded in server | Points to /assets/dalle/* |

### Music Section (id="music")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Section title | index.html:164 | Hardcoded | "ANLÆTAN Music" |
| SoundCloud embed | index.html:167-168 | External iframe | soundcloud.com/anlaetan |

### Whitepapers Section (id="whitepapers")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Section title | index.html:175 | Hardcoded | "Whitepaper Portal" |
| Whitepaper cards | app.js:278-311 | SIMULATED API | /api/whitepapers returns static array |
| Download links | N/A | NOT IMPLEMENTED | Files do not exist |

### Admin Section (id="admin")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Infinity Loop controls | index.html:188-191 | Triggers API | start/iterate buttons |
| Iteration counter | index.html:191 | Real API | /api/status → meta.infinity_loop_iteration |
| API status indicators | index.html:196-213 | HARDCODED | All show "Ready" regardless of actual state |

### Contact Section (id="contact")

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Email link | index.html:224-227 | Hardcoded | vegafoundation@proton.me |
| SoundCloud link | index.html:228-231 | Hardcoded | soundcloud.com/anlaetan |
| GitHub link | index.html:232-235 | Hardcoded | github.com/vegafoundation |

### Footer

| Component | Location | Data Source | Notes |
|-----------|----------|-------------|-------|
| Copyright | index.html:247-250 | Hardcoded | 2025 copyright |
| Floating SoundCloud button | index.html:254-256 | Hardcoded | Fixed position link |

## Data Source Classification

### REAL (Live from API/Backend)

| Data | Source | Notes |
|------|--------|-------|
| Resonance core powers | /api/status | From time_crystal.json |
| Resonance core statuses | /api/status | From time_crystal.json |
| Agent list and states | /api/agents | From time_crystal.json |
| Module list and statuses | /api/status | From time_crystal.json |
| Infinity loop iteration | /api/status | From time_crystal.json |
| Infinity loop active state | /api/status | From time_crystal.json |
| AI chat responses | /api/prompt, /api/anthropic/chat, etc. | Real API calls |

### SIMULATED (Fake data pretending to be real)

| Data | Source | Notes |
|------|--------|-------|
| Analytics (pageViews, visitors) | /api/analytics | Incrementing counter + random calculation |
| Whitepaper list | /api/whitepapers | Static array, files don't exist |
| Average time, bounce rate | /api/analytics | Hardcoded strings |
| VegaSafety resonance score | vegaSafetyCheck() | Random 85-100 |

### HARDCODED (Static in source)

| Data | Location |
|------|----------|
| All section titles | index.html |
| All service descriptions | index.html |
| Navigation structure | index.html |
| Contact information | index.html |
| Asset catalog | backend/server.js |
| API status indicators | index.html |
| Module/agent descriptions (fallback) | app.js |

## Dependency Graph

```
index.html
├── style.css (visual styling)
├── app.js (all interactive logic)
│   ├── fetchStatus() → /api/status
│   ├── fetchAgents() → /api/agents
│   ├── fetchModules() → /api/status
│   ├── fetchAssets() → /api/assets
│   ├── fetchWhitepapers() → /api/whitepapers
│   ├── startInfinityLoop() → /api/infinity-loop/start
│   │   └── createSoundscape() → Web Audio API
│   └── iterateLoop() → /api/infinity-loop/iterate
└── Orbitron + Rajdhani fonts (Google Fonts CDN)

backend/server.js
├── time_crystal.json (state persistence)
├── /api/* routes (all API handlers)
└── /assets/* (static file serving)
```

## Visual Component States

### Core Status Colors (app.js:53-60)

| State | Color |
|-------|-------|
| online | #00ff88 (green) |
| active | #00ffff (cyan) |
| initializing | #ffd700 (gold) |
| offline/other | #ff4444 (red) |

### Agent/Module State Colors (style.css:554-557)

| State | Background | Text |
|-------|------------|------|
| idle/inactive | rgba(255,255,255,0.1) | dim white |
| active | rgba(0,255,136,0.2) | green |
| running | rgba(0,255,255,0.2) | cyan |
| syncing | rgba(255,215,0,0.2) | gold |
