# Agent and Logic Map

## Overview

The VEGA system has two types of "agents":
1. **State Agents**: Stored in time_crystal.json, tracked via API
2. **API Agents**: Backend routers that integrate with external AI services

---

## State Agents (time_crystal.json)

### Current Agents

| Name | State | Description |
|------|-------|-------------|
| ae_agent | syncing | Primary autonomous intelligence orchestrator |
| ae_symbol_agent | active | Æ-Agent - Symbol processing & meta-cognition |
| miracore | active | Invisible guardian agent - security & oversight |

### Agent Schema

```json
{
  "name": "string",
  "state": "idle | running | active | syncing",
  "description": "string"
}
```

### Agent API Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /api/agents | GET | - | Agent[] |
| /api/agents/:name | GET | name param | Agent |
| /api/agents/update | POST | { agents: Agent[] } | { success, agents } |
| /api/agents/:name/activate | POST | name param | { success, agent } |

### Agent State Machine

```
idle ──► running ──► active ──► syncing ──► idle
  │                    │           │
  └────────────────────┴───────────┘
```

---

## Modules (time_crystal.json)

### Module Schema

```json
{
  "moduleName": {
    "status": "active | inactive",
    "description": "string"
  }
}
```

### Current Modules

| Module | Status | Description |
|--------|--------|-------------|
| health | active | Bio-monitoring & wellness optimization |
| consciousness | active | Cognitive enhancement & awareness systems |
| relax | inactive | Stress reduction & relaxation protocols |
| spirits | inactive | Mood enhancement & emotional balance |
| creative_hub | active | Generative AI & artistic synthesis |
| playbox | active | Experimental sandbox environment |
| atlas | active | Navigation & spatial intelligence |
| vision | active | Computer vision & perception systems |
| finance | active | Quantum-inspired financial modeling |
| beyond | active | Transcendental exploration systems |
| mind | active | Neural enhancement & cognition |
| tongue | active | Language processing & communication |
| roots | active | Heritage & ancestral connections |
| desire | active | Goal setting & motivation systems |
| safety | active | Security & protection protocols |
| anlaetan | inactive | The ANLÆTAN Collective |

---

## API Agent Routers

### /api/xai (xAI Grok)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { status, service, model, endpoints } |
| /chat | POST | { prompt, system? } | { success, response, model, usage } |
| /analyze | POST | { text, type? } | { success, analysis, type } |

**Model**: grok-2-1212  
**Env**: XAI_API_KEY

### /api/anthropic (Claude)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { status, service, model, endpoints } |
| /chat | POST | { prompt, system? } | { success, response, model, usage } |
| /analyze | POST | { text, type? } | { success, analysis, type } |

**Model**: claude-sonnet-4-20250514  
**Env**: ANTHROPIC_API_KEY

### /api/deepseek (DeepSeek)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { status, service, model, endpoints } |
| /chat | POST | { prompt, system? } | { success, response, model, usage } |
| /code | POST | { prompt, language? } | { success, code, language, model } |

**Models**: deepseek-chat, deepseek-coder  
**Env**: DEEPSEEK_API_KEY

### /api/suno (Suno AI Music)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { status, service, endpoints } |
| /generate | POST | { prompt, style?, duration? } | { success, track } |
| /tracks | GET | - | { success, tracks[] } |

**Env**: SUNO_API_KEY

### /api/soundscape

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { status, service, soundcloud } |
| /tracks | GET | - | { success, profile, tracks[] } |
| /sync | POST | { visualState?, loopPhase? } | { success, sync } |

**Note**: Returns placeholder data, links to SoundCloud profile

### /api/orchestrator (Multi-AI)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { status, orchestration, availableAIs, configured } |
| /query | POST | { prompt, mode? } | { success, responses{}, errors{}, synthesized, aiCount } |
| /synthesize | POST | { topic } | { success, topic, responses{}, synthesis } |

**Behavior**: Queries all configured AIs in parallel, returns combined response

### /api/redblood (RedBlood-Agent Godmaster)

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| /status | GET | - | { name, version, mode, status, iteration, phase, subdomains, apis } |
| /generate-visual | POST | { theme? } | { success, visual, iteration } |
| /generate-music-prompt | POST | { style? } | { success, musicPrompt } |
| /infinity-cycle | POST | - | { success, phase, iteration, insights[] } |
| /subdomains | GET | - | { subdomains[], status[] } |

**Behavior**: Generates visual descriptions and music prompts using AI

---

## Core System Logic

### Infinity Loop

**Phases**: 3 → 5 → 8 → 3 (repeating)

| Phase | Name | Description |
|-------|------|-------------|
| 3 | initial_resonance_analysis | Initial Core Resonance Analysis |
| 5 | cross_module_optimization | Cross-Module Optimization & Integration |
| 8 | full_system_stabilization | Full System Stabilization & Deployment |

**Iteration Behavior** (/api/infinity-loop/iterate):
1. Advance phase (3→5→8→3)
2. Increment iteration counter
3. Update resonance core power (random +5 to +25, max 100)
4. Update agent states (random selection from idle/running/active/syncing)
5. Update module statuses (random active/inactive)
6. Save to time_crystal.json

### Resonance Cores

| Core | JSON Key | Power Range | Status Thresholds |
|------|----------|-------------|-------------------|
| Alpha | alpha_resonance | 0-100 | >80: online, >40: active, else: initializing |
| Omega | omega_resonance | 0-100 | >80: online, >40: active, else: initializing |
| Vega | vega_resonance | 0-100 | >80: online, >40: active, else: initializing |

### Analytics (SIMULATED)

```javascript
// /api/analytics endpoint
data.analytics.pageViews += 1;
visitors = Math.floor(pageViews * 0.3); // Simulated
avgTime = '2:34'; // Hardcoded
bounceRate = '32%'; // Hardcoded
```

---

## AE Agent Class (agents/ae_agent.js)

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
  sync() { /* async state change to syncing then active */ }
  getStatus() { /* returns full status object */ }
}
```

**Note**: This class is defined but not actively instantiated in the running server.
