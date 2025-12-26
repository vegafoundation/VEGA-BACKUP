import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';

import { router as agentsRouter, init as agentsInit } from './api/agents.js';
import xaiRouter from './api/xai.js';
import anthropicRouter from './api/anthropic.js';
import deepseekRouter from './api/deepseek.js';
import sunoRouter from './api/suno.js';
import soundscapeRouter from './api/soundscape.js';
import orchestratorRouter from './api/orchestrator.js';
import redbloodRouter from './api/redblood.js';
import { handlePrompt } from './prompt.js';
import { updateMemory, getMemory } from './memory.js';
import { validateCredentials, vegaSafetyCheck, requireAdmin } from './auth/adminAuth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const HOST = '0.0.0.0';

const TIME_CRYSTAL = path.join(__dirname, '../vtc/time_crystal.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'vega-admin-secret-key-ae',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true, 
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

async function loadTimeCrystal() {
  try {
    const data = await fs.readFile(TIME_CRYSTAL, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

async function saveTimeCrystal(data) {
  data.meta = data.meta || {};
  data.meta.last_update = new Date().toISOString();
  await fs.writeFile(TIME_CRYSTAL, JSON.stringify(data, null, 2));
}

agentsInit(loadTimeCrystal, saveTimeCrystal);

app.use('/api/agents', agentsRouter);
app.use('/api/xai', xaiRouter);
app.use('/api/anthropic', anthropicRouter);
app.use('/api/deepseek', deepseekRouter);
app.use('/api/suno', sunoRouter);
app.use('/api/soundscape', soundscapeRouter);
app.use('/api/orchestrator', orchestratorRouter);
app.use('/api/redblood', redbloodRouter);

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin-login.html'));
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const safetyCheck = vegaSafetyCheck();
  if (!safetyCheck.passed) {
    return res.status(403).json({ success: false, ...safetyCheck });
  }
  const authResult = await validateCredentials(username, password);
  if (authResult.success) {
    req.session.isAdmin = true;
    req.session.username = username;
  }
  res.json({ ...authResult, resonance: safetyCheck });
});

app.get('/admin', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

app.post('/api/infinity-loop/stop', async (req, res) => {
  const data = await loadTimeCrystal();
  if (data) {
    data.infinity_loop = data.infinity_loop || {};
    data.infinity_loop.active = false;
    await saveTimeCrystal(data);
  }
  res.json({ success: true, message: 'Infinity Loop stopped' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/analytics', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.json({ pageViews: 0, visitors: 0 });
  data.analytics = data.analytics || { pageViews: 0, visitors: 0 };
  data.analytics.pageViews = (data.analytics.pageViews || 0) + 1;
  await saveTimeCrystal(data);
  res.json({
    pageViews: data.analytics.pageViews,
    visitors: data.analytics.visitors || Math.floor(data.analytics.pageViews * 0.3),
    avgTime: '2:34',
    bounceRate: '32%'
  });
});

app.post('/api/prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' });
    }
    const output = await handlePrompt(prompt, getMemory());
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memory-update', (req, res) => {
  try {
    const { update } = req.body;
    updateMemory(update);
    res.json({ status: 'updated', memory: getMemory() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/memory', (req, res) => {
  res.json({ memory: getMemory() });
});

app.get('/api/status', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
  res.json(data);
});

app.get('/api/cores', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
  res.json({
    alpha: data.alpha_resonance,
    omega: data.omega_resonance,
    vega: data.vega_resonance
  });
});

app.get('/api/modules', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
  res.json(data.modules || {});
});

app.get('/api/infinity-loop', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
  res.json(data.infinity_loop || { active: false, current_phase: 3 });
});

app.post('/api/infinity-loop/start', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
  data.infinity_loop = data.infinity_loop || {};
  data.infinity_loop.active = true;
  await saveTimeCrystal(data);
  res.json({ success: true, infinity_loop: data.infinity_loop });
});

app.post('/api/infinity-loop/iterate', async (req, res) => {
  const data = await loadTimeCrystal();
  if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
  
  const phases = [3, 5, 8];
  data.infinity_loop = data.infinity_loop || { current_phase: 3, active: true };
  data.meta = data.meta || { infinity_loop_iteration: 0 };
  
  let currentIdx = phases.indexOf(data.infinity_loop.current_phase);
  currentIdx = (currentIdx + 1) % phases.length;
  data.infinity_loop.current_phase = phases[currentIdx];
  data.meta.infinity_loop_iteration = (data.meta.infinity_loop_iteration || 0) + 1;
  
  const coreKeys = ['alpha_resonance', 'omega_resonance', 'vega_resonance'];
  coreKeys.forEach(key => {
    if (data[key]) {
      data[key].power = Math.min(100, (data[key].power || 0) + Math.floor(Math.random() * 20) + 5);
      data[key].status = data[key].power > 80 ? 'online' : data[key].power > 40 ? 'active' : 'initializing';
      data[key].last_update = new Date().toISOString();
    }
  });
  
  if (data.agents && Array.isArray(data.agents)) {
    const states = ['idle', 'running', 'active', 'syncing'];
    data.agents.forEach(agent => {
      agent.state = states[Math.floor(Math.random() * states.length)];
    });
  }
  
  if (data.modules) {
    Object.keys(data.modules).forEach(key => {
      data.modules[key].status = Math.random() > 0.3 ? 'active' : 'inactive';
    });
  }
  
  await saveTimeCrystal(data);
  res.json({ 
    success: true, 
    iteration: data.meta.infinity_loop_iteration,
    phase: data.infinity_loop.current_phase
  });
});

app.get('/api/assets', async (req, res) => {
  const curatedAssets = [
    { file: 'chrome_glass_hero_background.png', title: 'Chrome Glass Architecture', category: 'Visual Design' },
    { file: 'golden_æ_logo_cosmic.png', title: 'Æ Cosmic Emblem', category: 'Logo & Identity' },
    { file: 'infinity_loop_3-5-8_visual.png', title: 'Infinity Loop 3-5-8', category: 'Core Systems' },
    { file: 'resonance_core_visualization.png', title: 'Resonance Core Matrix', category: 'Core Systems' },
    { file: 'neural_agent_network_art.png', title: 'Neural Agent Network', category: 'AI Architecture' },
    { file: 'soundscape_audio_visualization.png', title: 'ANLÆTAN Soundscape', category: 'Audio & Music' },
    { file: 'golden_portal_monolith_silhouette.png', title: 'Portal Monolith', category: 'Visual Design' },
    { file: 'ae_logo_chrome_holographic.png', title: 'Æ Holographic Logo', category: 'Logo & Identity' },
    { file: 'glowing_æ_logo_symbol.png', title: 'Glowing Æ Symbol', category: 'Logo & Identity' },
    { file: 'anlætan_gallery_panels.png', title: 'ANLÆTAN Gallery', category: 'Visual Design' },
    { file: 'golden_monolith_forest.png', title: 'Golden Monolith Forest', category: 'Visual Design' },
    { file: 'vega_main_dashboard_design.png', title: 'VEGA Dashboard', category: 'Interface Design' }
  ];
  
  res.json({
    dalle_generated: curatedAssets.map(a => `/assets/dalle/${a.file}`),
    curated: curatedAssets.map(a => ({
      path: `/assets/dalle/${a.file}`,
      title: a.title,
      category: a.category
    }))
  });
});

app.get('/api/whitepapers', async (req, res) => {
  res.json([
    { id: 1, title: 'VEGA Foundation Overview', file: 'vega_overview.pdf' },
    { id: 2, title: 'Infinity Loop Architecture', file: 'infinity_loop.pdf' },
    { id: 3, title: 'Time Crystal Persistence', file: 'time_crystal.pdf' },
    { id: 4, title: 'Æ Agent Protocol', file: 'ae_agent.pdf' }
  ]);
});

app.get('/api/openapi', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'VEGA Foundation API',
      version: '2.0.0',
      description: 'Autonomous Meta-System API'
    },
    servers: [{ url: '/' }],
    paths: {
      '/api/health': { get: { summary: 'Health check' } },
      '/api/status': { get: { summary: 'Get system status' } },
      '/api/cores': { get: { summary: 'Get resonance cores status' } },
      '/api/agents': { get: { summary: 'Get all agents' } },
      '/api/modules': { get: { summary: 'Get all modules' } },
      '/api/infinity-loop': { get: { summary: 'Get infinity loop status' } },
      '/api/infinity-loop/start': { post: { summary: 'Start infinity loop' } },
      '/api/infinity-loop/iterate': { post: { summary: 'Iterate infinity loop' } },
      '/api/prompt': { post: { summary: 'Send prompt to OpenAI' } },
      '/api/memory': { get: { summary: 'Get Vega memory' } },
      '/api/memory-update': { post: { summary: 'Update Vega memory' } },
      '/api/assets': { get: { summary: 'Get DALL·E assets' } },
      '/api/whitepapers': { get: { summary: 'Get whitepapers' } },
      '/api/xai/status': { get: { summary: 'XAI Grok integration' } },
      '/api/xai/chat': { post: { summary: 'Chat with Grok' } },
      '/api/anthropic/status': { get: { summary: 'Anthropic Claude integration' } },
      '/api/anthropic/chat': { post: { summary: 'Chat with Claude' } },
      '/api/deepseek/status': { get: { summary: 'DeepSeek AI integration' } },
      '/api/deepseek/chat': { post: { summary: 'Chat with DeepSeek' } },
      '/api/deepseek/code': { post: { summary: 'Generate code with DeepSeek' } },
      '/api/suno/status': { get: { summary: 'Suno AI Music integration' } },
      '/api/suno/generate': { post: { summary: 'Generate music with Suno' } },
      '/api/soundscape/status': { get: { summary: 'Soundscape engine status' } }
    }
  });
});

const clients = new Set();

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  clients.add(res);
  
  res.write('data: {"type":"connected","message":"SSE connected"}\n\n');
  
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ loop: 'active', timestamp: new Date() })}\n\n`);
  }, 3000);
  
  req.on('close', () => {
    clearInterval(interval);
    clients.delete(res);
  });
});

function broadcast(event, data) {
  const message = `data: ${JSON.stringify({ type: event, ...data })}\n\n`;
  clients.forEach(client => client.write(message));
}

let infinityLoopInterval = null;

function startInfinityLoop() {
  if (infinityLoopInterval) return;
  
  const phases = [3000, 5000, 8000];
  let phaseIdx = 0;
  
  const runPhase = async () => {
    const data = await loadTimeCrystal();
    if (!data || !data.infinity_loop?.active) {
      clearTimeout(infinityLoopInterval);
      infinityLoopInterval = null;
      return;
    }
    
    const phase = [3, 5, 8][phaseIdx];
    data.infinity_loop.current_phase = phase;
    data.meta = data.meta || {};
    data.meta.infinity_loop_iteration = (data.meta.infinity_loop_iteration || 0) + 1;
    
    const coreKeys = ['alpha_resonance', 'omega_resonance', 'vega_resonance'];
    coreKeys.forEach(key => {
      if (data[key]) {
        data[key].power = Math.min(100, (data[key].power || 0) + Math.floor(Math.random() * 15) + 3);
        data[key].status = data[key].power > 80 ? 'online' : data[key].power > 40 ? 'active' : 'initializing';
        data[key].last_update = new Date().toISOString();
      }
    });
    
    await saveTimeCrystal(data);
    
    broadcast('loop_update', {
      iteration: data.meta.infinity_loop_iteration,
      phase: data.infinity_loop.current_phase,
      cores: {
        alpha: data.alpha_resonance,
        omega: data.omega_resonance,
        vega: data.vega_resonance
      }
    });
    
    phaseIdx = (phaseIdx + 1) % 3;
    infinityLoopInterval = setTimeout(runPhase, phases[phaseIdx]);
  };
  
  infinityLoopInterval = setTimeout(runPhase, phases[0]);
  console.log('Infinity Loop (3-5-8) started');
}

async function checkAndStartLoop() {
  const data = await loadTimeCrystal();
  if (data && data.infinity_loop?.active) {
    startInfinityLoop();
  }
}

checkAndStartLoop();

app.listen(PORT, HOST, () => {
  console.log(`Infinity Loop Backend running on port ${PORT}`);
  console.log('Signature: ADAM EREN VEGA – Æ –');
  console.log('Infinity Loop: 3-5-8 Ready');
  console.log('SSE endpoint: /api/events');
});
