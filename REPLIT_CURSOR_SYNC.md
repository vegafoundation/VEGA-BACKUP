# Replit ↔ Cursor Synchronisation

**Projekt:** VEGA Foundation v2.3.0  
**Stand:** Dezember 2024

---

## Übersicht

Replit und Cursor sind separate Plattformen ohne direkte API-Verbindung.  
Synchronisation erfolgt über **Git** oder **Export-Pakete**.

---

## Option 1: Git-Synchronisation

### Setup (einmalig)

**In Replit (bereits konfiguriert):**
```bash
# Repository ist bereits verbunden:
# GitHub: vegafoundation/vega-foundation
```

**In Cursor:**
```bash
git clone https://github.com/vegafoundation/vega-foundation
cd vega-foundation
npm install
```

### Workflow

| Aktion | Replit | Cursor |
|--------|--------|--------|
| Änderungen pushen | Shell → `git push` | Terminal → `git push` |
| Änderungen holen | Shell → `git pull` | Terminal → `git pull` |
| Deployment | Automatisch (Autoscale) | Manuell via Replit |

---

## Option 2: Export-Paket

### Verfügbare Pakete

| Datei | Größe | Inhalt |
|-------|-------|--------|
| `VEGA_CORE_EXPORT.tar.gz` | 32 MB | Quellcode + Config |
| `VEGA_GIT_HISTORY.tar` | 2.1 GB | Vollständige Git History |

### In Cursor öffnen

```bash
# 1. Entpacken
tar -xzvf VEGA_CORE_EXPORT.tar.gz
cd vega_replit_export/storage
tar -xvf project_files.tar

# 2. Git History hinzufügen (optional)
tar -xvf VEGA_GIT_HISTORY.tar
cp -r git_history/.git ./

# 3. Dependencies installieren
npm install

# 4. Starten (lokal)
node backend/server.js
```

---

## Empfohlener Workflow

```
┌─────────────┐     Git Push/Pull     ┌─────────────┐
│   REPLIT    │ ◄──────────────────► │   CURSOR    │
│  (Cloud)    │                       │  (Lokal)    │
│             │                       │             │
│ • Deployment│                       │ • Power-Edit│
│ • Live-Test │                       │ • Offline   │
│ • AI Agent  │                       │ • AI Assist │
└─────────────┘                       └─────────────┘
        │                                    │
        ▼                                    ▼
   vega.foundation                    localhost:5000
```

---

## Secrets/API Keys

**Wichtig:** Secrets werden NICHT synchronisiert.

In Cursor müssen diese manuell gesetzt werden:

```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
export XAI_API_KEY=xai-...
export DEEPSEEK_API_KEY=sk-...
export SUNO_API_KEY=...
```

Oder in `.env` Datei (nicht committen!):
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Vorteile beider Plattformen

| Replit | Cursor |
|--------|--------|
| Cloud-basiert, kein Setup | Lokale Kontrolle |
| Instant Deployment | VS Code Extensions |
| Replit Agent (autonom) | Große Codebases |
| Echtzeit-Collaboration | Offline-fähig |

---

## Fazit

- **Replit** = Produktions-Server + Deployment
- **Cursor** = Lokales Editing + AI-Assist
- **Git** = Brücke zwischen beiden

Änderungen in Cursor → `git push` → Replit zieht automatisch oder manuell `git pull`

---

**ADAM EREN VEGA – Æ –**
