# VEGA Foundation - Glossary

**Generated**: 2025-12-25  
**Purpose**: Define VEGA terms in plain technical language

---

## Core Concepts

### VEGA Foundation
**Definition**: The project name and brand identity.  
**Technical Reality**: A Node.js/Express web application with a Chrome/Glass themed frontend and multi-AI integration.

### AE (Ligature Symbol)
**Definition**: The project symbol, representing the founder's initials and brand identity.  
**Technical Reality**: A Unicode character displayed in the UI. Has no functional significance.

### Chrome/Glass Architecture
**Definition**: The visual design language of the project.  
**Technical Reality**: A CSS aesthetic using:
- Dark backgrounds (#0a0a0f)
- Cyan (#00ffff) and green (#00ff88) accent colors
- Backdrop blur effects
- Semi-transparent panels
- Glowing text shadows

---

## System Components

### Time Crystal
**Definition**: The persistent state storage system.  
**Technical Reality**: A JSON file (vtc/time_crystal.json) read/written by the Express server. No "quantum" or "temporal" properties.

### Infinity Loop (3-5-8)
**Definition**: The system's processing pattern.  
**Technical Reality**: A JavaScript timer cycling through 3-second, 5-second, and 8-second delays. On each iteration:
- Random power adjustments to "cores"
- Random state changes to agents
- Random status toggles for modules
- Increment of iteration counter

### Resonance Cores (Alpha, Omega, Vega, Mirror)
**Definition**: Core system components with power levels.  
**Technical Reality**: JSON objects with `power` (0-100) and `status` (string) fields. Power changes randomly. Status is derived:
- power > 80 = "online"
- power > 40 = "active"
- else = "initializing"

### SSE (Server-Sent Events)
**Definition**: Real-time update mechanism.  
**Technical Reality**: Standard HTTP SSE at /api/events. Broadcasts state changes to connected browsers.

---

## Agent System

### Agent
**Definition**: An autonomous intelligence module.  
**Technical Reality**: A JSON object with name, state, and description. No autonomous behavior. State changes randomly.

### AE Agent (ae_agent)
**Definition**: Primary autonomous intelligence orchestrator.  
**Technical Reality**: A JavaScript class that exists but is never instantiated by the server. UI displays data from time_crystal.json, not from this class.

### Agent State
**Definition**: Current operational mode of an agent.  
**Technical Reality**: One of: "idle", "active", "running", "syncing". Assigned randomly on each loop iteration.

---

## Module System

### Module
**Definition**: A specialized subsystem within VEGA.  
**Technical Reality**: A JSON object with name, description, and status ("active"/"inactive"). No implementation. Status toggles randomly.

### Module Names and Claims

| Name | Claimed Purpose | Implementation |
|------|-----------------|----------------|
| health | Bio-monitoring | None |
| consciousness | Cognitive enhancement | None |
| relax | Stress reduction | None |
| spirits | Mood enhancement | None |
| creative_hub | Generative AI | None |
| playbox | Sandbox | None |
| atlas | Navigation | None |
| vision | Computer vision | None |
| finance | Financial modeling | None |
| beyond | Transcendental | None |
| mind | Neural enhancement | None |
| tongue | Language processing | None |
| roots | Heritage | None |
| desire | Goal setting | None |
| safety | Security | None |
| anlaetan | Music collective | None |

---

## AI Integration

### Orchestrator
**Definition**: Multi-AI coordination system.  
**Technical Reality**: An Express router that calls OpenAI, Anthropic, and XAI APIs in parallel and concatenates responses.

### ANLAETAN
**Definition**: The music collective / audio brand within VEGA.  
**Technical Reality**: A SoundCloud profile (soundcloud.com/anlaetan) embedded via iframe. No programmatic integration.

### Soundscape Engine
**Definition**: AI-powered ambient sound generation.  
**Technical Reality**: Client-side Web Audio API oscillators at specific frequencies (63Hz, 126Hz, 174Hz, 285Hz, 396Hz, 528Hz). No AI involvement.

---

## Authentication

### VegaSafety
**Definition**: Security verification system.  
**Technical Reality**: A function that returns a random number 85-100 and always passes. Provides no actual security.

### Admin Auth
**Definition**: Protected access to admin panel.  
**Technical Reality**: Standard bcrypt password comparison against environment variable. Session-based authentication.

---

## External Services

### OpenAI
**Definition**: AI service provider.  
**Technical Reality**: GPT-4o-mini model used via official SDK. Requires OPENAI_API_KEY environment variable.

### Anthropic
**Definition**: AI service provider.  
**Technical Reality**: Claude models used via official SDK. Requires ANTHROPIC_API_KEY environment variable.

### XAI (Grok)
**Definition**: AI service provider.  
**Technical Reality**: Grok-2 model accessed via OpenAI-compatible API at api.x.ai. Requires XAI_API_KEY.

### DeepSeek
**Definition**: AI service provider.  
**Technical Reality**: DeepSeek chat model via OpenAI-compatible API. Requires DEEPSEEK_API_KEY.

### Suno AI
**Definition**: AI music generation service.  
**Technical Reality**: Placeholder endpoint only. No actual integration.

---

## Data Terms

### Iteration
**Definition**: One cycle of the Infinity Loop.  
**Technical Reality**: Incremented counter stored in time_crystal.json. Currently at ~9599.

### Power Level
**Definition**: Energy level of a resonance core.  
**Technical Reality**: Integer 0-100, increased by random(5,20) on each iteration, capped at 100.

### Status
**Definition**: Operational state of a component.  
**Technical Reality**: String value derived from power thresholds or assigned randomly.

---

## Design Terms

### Hero Section
**Definition**: The main landing area of the website.  
**Technical Reality**: Standard web design term. The full-viewport section with logo and call-to-action.

### Glass Panel
**Definition**: UI element with glass-like appearance.  
**Technical Reality**: CSS properties:
- background: rgba(255,255,255,0.05)
- backdrop-filter: blur(20px)
- border: 1px solid rgba(0,255,255,0.2)

### Tilt Effect
**Definition**: 3D card hover animation.  
**Technical Reality**: CSS transform with perspective and rotateX/rotateY on mousemove.
