# UI Components Mapping

## Section Overview

| Section ID | Name | Data Source | Type |
|------------|------|-------------|------|
| #home | Hero | API + Hardcoded | Mixed |
| #about | Vision | API | Real |
| #services | Core Services | Hardcoded | Static |
| #agents | Autonomous Agents | API | Real |
| #modules | VEGA Modules | API | Real |
| #portfolio | DALL-E Assets | API | Real |
| #music | ANLÆTAN Music | Hardcoded + WebAudio | Mixed |
| #whitepapers | Whitepapers | Hardcoded | Simulated |
| #admin | Admin | Link only | N/A |
| #contact | Contact | Hardcoded | Static |

---

## Detailed Component Analysis

### Header

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Logo | .ae-symbol, .logo-text | Hardcoded | "Æ" symbol + "VEGA.foundation" |
| Navigation | nav ul | Hardcoded | 10 section links |
| Login Button | .login-btn | Hardcoded | Links to /admin-login |
| Infinity Indicator | #loop-status | API: /api/infinity-loop | Real-time status |

### Hero Section (#home)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Infinity Loop Visual | .infinity-loop-visual | CSS Animation | Visual only |
| Phase Indicator | .phase-indicator .phase-dot | API: /api/status | Phases 3, 5, 8 |
| AE Monolith | .ae-monolith | Hardcoded | Static "Æ" symbol |
| Title/Subtitle | .hero-title, .hero-subtitle | Hardcoded | Static text |
| Activate Button | .btn-primary | onclick: startInfinityLoop() | Calls /api/infinity-loop/start |
| SoundCloud Link | .btn-secondary | Hardcoded | External link |
| Core Mini Panels | #alpha-mini, #omega-mini, #vega-mini | API: /api/status | Power percentages |

### Vision Section (#about)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Section Title | .section-title | Hardcoded | "Our Vision" |
| Intro Text | .section-intro | Hardcoded | Static description |
| Alpha Status | #alpha-status .core-value | API: /api/status → alpha_resonance | Real |
| Omega Status | #omega-status .core-value | API: /api/status → omega_resonance | Real |
| Vega Status | #vega-status .core-value | API: /api/status → vega_resonance | Real |

### Services Section (#services)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Service Cards | .service-card | Hardcoded | 4 static cards |
| AI Integration | - | Hardcoded | Description only |
| Soundscape Engine | - | Hardcoded | Description only |
| Autonomous Agents | - | Hardcoded | Description only |
| Time Crystal | - | Hardcoded | Description only |

### Agents Section (#agents)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Container | #agents-container | API: /api/agents | Dynamic |
| Agent Cards | .agent-card | API data | Name, description, state |
| Agent Names | .agent-name | API: time_crystal.json agents[] | Real |
| Agent Descriptions | .agent-description | Fallback to frontend hardcoded | Mixed |
| Agent State | .agent-state | API: agents[].state | Real |

**Frontend Fallback Descriptions (app.js):**
```javascript
{
  'ae_agent': 'Primary autonomous intelligence orchestrator',
  'biolab': 'Bio-monitoring & wellness research systems',
  'creative_hub': 'Generative AI & artistic synthesis engine',
  'finance_core': 'Quantum-inspired financial modeling',
  'health_monitor': 'Real-time health analytics & optimization',
  'playbox': 'Experimental sandbox & prototyping environment',
  'atlas': 'Navigation & spatial intelligence systems'
}
```

### Modules Section (#modules)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Container | #modules-container | API: /api/status → modules | Dynamic |
| Module Cards | .module-card | API data | Name, description, status |
| Module Names | .module-name | API: time_crystal.json modules{} | Real |
| Module Descriptions | .module-description | Fallback to frontend hardcoded | Mixed |
| Module Status | .module-status | API: modules[key].status | Real |

**Available Modules:**
health, consciousness, relax, spirits, creative_hub, playbox, atlas, vision, finance, beyond, mind, tongue, roots, desire, safety, anlaetan

### Portfolio Section (#portfolio)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Container | #portfolio-container | API: /api/status → assets | Dynamic |
| Image Cards | .portfolio-item | Filesystem: assets/dalle/ | Real files |

### Music Section (#music)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Soundscape Visualizer | #soundscape-visualizer | WebAudio API | Real-time generated |
| Canvas | #audio-canvas | JavaScript rendering | Procedural |
| SoundCloud Embed | iframe | Hardcoded | External embed |
| Play Soundscape | #play-soundscape | onclick: toggleSoundscape() | WebAudio synthesis |

**Soundscape Generation (app.js):**
- Uses Web Audio API
- Creates oscillators for ambient tones
- No stored audio files
- Real-time synthesis based on infinity loop phase

### Whitepapers Section (#whitepapers)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Container | #whitepapers-container | Hardcoded in HTML | SIMULATED |
| Whitepaper Cards | .whitepaper-card | Static HTML | No actual PDFs |

**Simulated Whitepapers:**
1. "Infinity Loop Architecture" - Download disabled
2. "Time Crystal Protocol" - Download disabled
3. "Æ Symbol System" - Download disabled

### Contact Section (#contact)

| Element | ID/Class | Data Source | Notes |
|---------|----------|-------------|-------|
| Contact Form | form | Hardcoded | Form only, no backend |
| Social Links | .social-links | Hardcoded | Static links |

---

## API Polling Intervals

| Endpoint | Interval | Purpose |
|----------|----------|---------|
| /api/status | 5000ms | Core status, agents, modules, loop |
| /api/analytics | On load | Page view tracking |

## Data Update Flow

```
Page Load
    │
    ├─► fetchStatus() ─► /api/status ─► updateCoreStatus()
    │                                   updateLoopStatus()
    │
    ├─► fetchAgents() ─► /api/agents ─► displayAgents()
    │
    ├─► fetchModules() ─► via /api/status ─► displayModules()
    │
    └─► loadPortfolio() ─► via /api/status ─► displayPortfolio()
```
