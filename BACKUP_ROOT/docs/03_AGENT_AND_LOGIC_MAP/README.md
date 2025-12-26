# 03_AGENT_AND_LOGIC_MAP - Technical Specifications

Generated: 2025-12-25

## Overview

This document describes each agent, module, and logic component in plain technical terms:
- What it does
- What inputs it expects
- What outputs it produces
- Implementation status (Implemented / Conceptual / Placeholder)

---

## AGENTS

### ae_agent (Æ Agent)

| Property | Value |
|----------|-------|
| File | agents/ae_agent.js |
| Class | AEAgent |
| Status | **CLASS DEFINED, NOT INSTANTIATED IN SERVER** |

#### Description
Primary autonomous intelligence orchestrator. Intended to coordinate other agents and manage the Infinity Loop.

#### Implementation

```javascript
class AEAgent {
  constructor() {
    this.name = 'ae_agent';
    this.state = 'idle';
    this.capabilities = [
      'system_orchestration',
      'agent_coordination',
      'infinity_loop_management',
      'resonance_synchronization'
    ];
  }
  activate() { this.state = 'active'; }
  deactivate() { this.state = 'idle'; }
  sync() { /* 1s timeout, returns Promise */ }
  getStatus() { /* returns status object */ }
}
```

#### Input/Output
- **Input**: None (methods are manual calls)
- **Output**: State object with name, state, capabilities

#### Reality Check
- The class exists but is **never imported or used** by server.js
- Agent states shown in UI come from time_crystal.json, not this class
- No actual orchestration logic exists

---

### ae_symbol_agent

| Property | Value |
|----------|-------|
| File | N/A |
| Status | **CONCEPTUAL - No implementation** |

#### Description
Listed in time_crystal.json as "Symbol processing & meta-cognition"

#### Reality Check
- Only exists as a data entry in time_crystal.json
- No code, no class, no functionality

---

### miracore

| Property | Value |
|----------|-------|
| File | N/A |
| Status | **CONCEPTUAL - No implementation** |

#### Description
Listed as "Invisible guardian agent - security & oversight"

#### Reality Check
- Only exists as a data entry in time_crystal.json
- No code, no class, no functionality

---

## MODULES (VEGA Subsystems)

All modules are **conceptual entries** in time_crystal.json with no backing implementation.

| Module | Description | Status Field | Implementation |
|--------|-------------|--------------|----------------|
| health | Bio-monitoring & wellness | active/inactive | None |
| consciousness | Cognitive enhancement | active/inactive | None |
| relax | Stress reduction | active/inactive | None |
| spirits | Mood enhancement | active/inactive | None |
| creative_hub | Generative AI synthesis | active/inactive | None |
| playbox | Experimental sandbox | active/inactive | None |
| atlas | Navigation & spatial intelligence | active/inactive | None |
| vision | Computer vision & perception | active/inactive | None |
| finance | Financial modeling | active/inactive | None |
| beyond | Transcendental exploration | active/inactive | None |
| mind | Neural enhancement | active/inactive | None |
| tongue | Language processing | active/inactive | None |
| roots | Heritage connections | active/inactive | None |
| desire | Goal setting | active/inactive | None |
| safety | Security protocols | active/inactive | None |
| anlaetan | ANLÆTAN Collective | active/inactive | None |

---

## RESONANCE CORES

### Alpha Resonance

| Property | Value |
|----------|-------|
| Storage | time_crystal.json → alpha_resonance |
| Fields | status, power (0-100), last_update |
| Implementation | **SIMULATED** |

#### Behavior
- Power increases randomly (5-20%) on each Infinity Loop iteration
- Status changes based on power thresholds:
  - power > 80 → "online"
  - power > 40 → "active"
  - else → "initializing"
- No real measurement or computation

---

### Omega Resonance

| Property | Value |
|----------|-------|
| Storage | time_crystal.json → omega_resonance |
| Implementation | **SIMULATED** (same as Alpha) |

---

### Vega Resonance

| Property | Value |
|----------|-------|
| Storage | time_crystal.json → vega_resonance |
| Implementation | **SIMULATED** (same as Alpha) |

---

### Mirror Core

| Property | Value |
|----------|-------|
| Storage | time_crystal.json → mirror_core |
| Implementation | **DATA ONLY** - never updated by server |

---

## CORE SYSTEMS

### Infinity Loop (3-5-8 Pattern)

| Property | Value |
|----------|-------|
| File | backend/server.js:186-236, 336-392 |
| Status | **IMPLEMENTED** |

#### Description
A cycling timer that advances through phases 3 → 5 → 8 with corresponding delays (3s, 5s, 8s).

#### Input
- POST /api/infinity-loop/start - Activates the loop
- POST /api/infinity-loop/iterate - Manual single iteration
- POST /api/infinity-loop/stop - Deactivates the loop

#### Output
- Updates time_crystal.json:
  - infinity_loop.current_phase
  - infinity_loop.active
  - meta.infinity_loop_iteration (counter)
  - Randomly adjusts core powers
  - Randomly shuffles agent states
  - Randomly toggles module statuses
- Broadcasts updates via SSE to /api/events

#### Behavior
```
Phase 3: Wait 3 seconds → update state → move to Phase 5
Phase 5: Wait 5 seconds → update state → move to Phase 8
Phase 8: Wait 8 seconds → update state → move to Phase 3
(repeat)
```

---

### Time Crystal (State Persistence)

| Property | Value |
|----------|-------|
| File | vtc/time_crystal.json |
| Status | **IMPLEMENTED** |

#### Description
JSON file serving as the single source of truth for system state.

#### Schema

```javascript
{
  meta: {
    signature: string,
    vtc_version: string,
    created: ISO timestamp,
    last_update: ISO timestamp,
    infinity_loop_iteration: number,
    open_source: boolean
  },
  alpha_resonance: { status, power, last_update },
  omega_resonance: { status, power, last_update },
  vega_resonance: { status, power, last_update },
  mirror_core: { status, power, last_update },
  agents: [{ name, state, description }],
  modules: { [name]: { status, description } },
  infinity_loop: {
    active: boolean,
    current_phase: 3|5|8,
    phases: { 3: {...}, 5: {...}, 8: {...} }
  },
  admin: { username, password_hash },
  subdomains: string[],
  apis: { [name]: status },
  assets: { canvas: [], soundscapes: [], logos: [] },
  analytics: { pageViews, visitors, sessions },
  deployment: { github_repo, replit_project, branch, status }
}
```

---

### Vega Memory (Volatile)

| Property | Value |
|----------|-------|
| File | backend/memory.js |
| Status | **IMPLEMENTED (minimal)** |

#### Description
In-memory key-value store. Resets on server restart.

#### API
- `getMemory()` → returns current memory object
- `updateMemory(update)` → merges update into memory

#### Endpoints
- GET /api/memory → returns memory
- POST /api/memory-update → merges request body into memory

---

## AI INTEGRATIONS

### OpenAI (GPT)

| Property | Value |
|----------|-------|
| File | backend/prompt.js, backend/api/orchestrator.js |
| Status | **IMPLEMENTED** |
| Model | gpt-4o-mini |

#### Endpoints
- POST /api/prompt → Direct GPT query with Vega personality
- POST /api/orchestrator/query → Multi-AI including GPT

---

### Anthropic (Claude)

| Property | Value |
|----------|-------|
| File | backend/api/anthropic.js |
| Status | **IMPLEMENTED** |
| Model | claude-sonnet-4-20250514 |

#### Endpoints
- GET /api/anthropic/status → Check if API key configured
- POST /api/anthropic/chat → Chat with Claude
- POST /api/anthropic/analyze → Analyze text (sentiment or general)

---

### XAI (Grok)

| Property | Value |
|----------|-------|
| File | backend/api/xai.js |
| Status | **IMPLEMENTED** |
| Model | grok-2-1212 |
| Base URL | https://api.x.ai/v1 |

#### Endpoints
- GET /api/xai/status → Check if API key configured
- POST /api/xai/chat → Chat with Grok
- POST /api/xai/analyze → Analyze text

---

### DeepSeek

| Property | Value |
|----------|-------|
| File | backend/api/deepseek.js |
| Status | **PARTIALLY IMPLEMENTED** |
| Model | deepseek-chat |
| Base URL | https://api.deepseek.com/v1 |

#### Endpoints
- POST /api/deepseek/chat → Chat
- POST /api/deepseek/code → Code generation

---

### Suno AI (Music)

| Property | Value |
|----------|-------|
| File | backend/api/suno.js |
| Status | **PLACEHOLDER** |

#### Reality Check
- Endpoint exists but returns mock data
- No actual Suno API integration

---

### Multi-AI Orchestrator

| Property | Value |
|----------|-------|
| File | backend/api/orchestrator.js |
| Status | **IMPLEMENTED** |

#### Description
Queries multiple AI services in parallel and synthesizes responses.

#### Input
- POST /api/orchestrator/query { prompt, mode }
- POST /api/orchestrator/synthesize { topic }

#### Output
- Object containing responses from each available AI
- Synthesized combined response
- Error report for failed services

---

## AUTHENTICATION

### Admin Auth

| Property | Value |
|----------|-------|
| File | backend/auth/adminAuth.js |
| Status | **IMPLEMENTED** |

#### Flow
1. User submits username/password to POST /api/admin/login
2. validateCredentials() checks username against "AEVegaAdmin"
3. bcrypt.compare() validates password against ADMIN_PASSWORD_HASH env var
4. Session cookie set if valid
5. requireAdmin middleware protects /admin route

#### VegaSafety Check
- Returns random score 85-100
- Always passes (decorative security theater)

---

## SOUNDSCAPE ENGINE

| Property | Value |
|----------|-------|
| File | frontend/app.js:316-404 |
| Status | **IMPLEMENTED (CLIENT-SIDE ONLY)** |

#### Description
Web Audio API-based ambient sound generator.

#### Frequencies Used
- 63 Hz (sub bass)
- 126 Hz (bass)
- 174 Hz
- 285 Hz
- 396 Hz
- 528 Hz (Solfeggio)

#### Behavior
- Creates oscillators with LFO modulation
- Adds filtered noise layer
- Fades in over 2 seconds
- Triggered by "Activate System" button
