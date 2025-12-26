let isLoopActive = false;
let sonicActive = false;
let visualActive = false;
let agentsActive = false;

const agentData = [
  { name: 'ae_agent', type: 'Primary', state: 'active', description: 'Primary intelligence orchestrator' },
  { name: 'ae_symbol_agent', type: 'Secondary', state: 'running', description: 'Symbol processing and meta-cognition' },
  { name: 'miracore', type: 'Utility', state: 'idle', description: 'Invisible guardian for security oversight' }
];

const moduleData = [
  { name: 'health', enabled: true, status: 'active' },
  { name: 'consciousness', enabled: true, status: 'active' },
  { name: 'relax', enabled: true, status: 'active' },
  { name: 'spirits', enabled: true, status: 'active' },
  { name: 'grid', enabled: true, status: 'active' },
  { name: 'soundscape', enabled: true, status: 'active' }
];

function getStatusColor(status) {
  switch (status) {
    case 'online': return '#00ff88';
    case 'active': return '#00ffff';
    case 'initializing': return '#ffd700';
    default: return '#ff4444';
  }
}

function updateCoreStatus(name, core) {
  const statusEl = document.querySelector(`#${name}-status .core-value`);
  if (statusEl) {
    statusEl.textContent = (core.status || 'offline').toUpperCase();
    statusEl.style.color = getStatusColor(core.status);
  }
  
  const miniEl = document.getElementById(`${name}-mini`);
  if (miniEl) {
    const powerEl = miniEl.querySelector('.core-power');
    if (powerEl) powerEl.textContent = `${Math.round(core.power) || 0}%`;
  }
}

function updateLoopStatus() {
  const statusEl = document.getElementById('loop-status');
  if (statusEl) {
    statusEl.textContent = isLoopActive ? 'ACTIVE' : 'STANDBY';
    statusEl.style.color = isLoopActive ? '#00ff88' : '#ffd700';
  }
}

function displayAgents(agents) {
  const container = document.getElementById('agents-container');
  if (!container) return;
  
  container.innerHTML = agents.map(agent => `
    <div class="agent-card">
      <div class="agent-header">
        <span class="agent-name">${agent.name}</span>
        <span class="agent-type">${agent.type}</span>
      </div>
      <div class="agent-state ${agent.state}">${agent.state.toUpperCase()}</div>
      <div class="agent-desc">${agent.description || ''}</div>
    </div>
  `).join('');
}

function displayModules(modules) {
  const container = document.getElementById('modules-container');
  if (!container) return;
  
  container.innerHTML = modules.map(mod => `
    <div class="module-card ${mod.status}">
      <div class="module-name">${mod.name}</div>
      <div class="module-status">${mod.status.toUpperCase()}</div>
    </div>
  `).join('');
}

function updateMetricsDisplay() {
  const metrics = VEGAMetricsEngine.getAll();
  const stateMetrics = VEGAStateMachine.getMetrics();
  const sonicMetrics = VEGASonicEngine.getMetrics();
  const promptMetrics = VEGAPromptEngine.getMetrics();
  
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  
  setEl('metric-state', stateMetrics.currentState);
  setEl('metric-transitions', stateMetrics.transitionCount);
  setEl('metric-audio', sonicMetrics.isPlaying ? 'ON' : 'OFF');
  setEl('metric-visual', visualActive ? 'ON' : 'OFF');
  setEl('metric-prompts', promptMetrics.historyLength);
  setEl('metric-fps', metrics.fps);
  setEl('iteration-count', metrics.infinityLoop.iteration);
  
  const agentStatus = VEGAAgentRegistry.getStatus();
  setEl('metric-agents', `${agentStatus.activeCount}/${agentStatus.agentCount}`);
  
  const stateDisplay = document.getElementById('state-display');
  if (stateDisplay) stateDisplay.textContent = stateMetrics.currentState;
  
  Object.entries(metrics.coreResonance).forEach(([name, core]) => {
    updateCoreStatus(name, core);
  });
  
  updateNarrativeDisplay();
}

function updateNarrativeDisplay() {
  const display = document.getElementById('narrative-display');
  if (!display) return;
  
  const narrator = VEGAAgentRegistry.get('metrics-narrator');
  if (narrator && narrator.instance) {
    const latest = narrator.instance.getLatestNarrative();
    if (latest) {
      display.textContent = latest.summary;
      display.style.opacity = '1';
    }
  }
}

function startInfinityLoop() {
  if (isLoopActive) return;
  
  isLoopActive = true;
  updateLoopStatus();
  
  VEGAStateMachine.onTransition((data) => {
    VEGAPromptEngine.generatePrompt(data.to);
    if (sonicActive) VEGASonicEngine.updateForState(data.to);
    if (visualActive) VEGAVisualEngine.setState(data.to);
    updateMetricsDisplay();
  });
  
  VEGAMetricsEngine.initialize();
  VEGAPromptEngine.initialize();
  VEGAStateMachine.initialize();
  
  const initialState = VEGAStateMachine.getMetrics();
  VEGAMetricsEngine.setIterationFromState(initialState.transitionCount);
  updateMetricsDisplay();
  
  VEGAStateMachine.startAutoTransition(8000);
  VEGAMetricsEngine.startMonitoring(1000);
  
  VEGAMetricsEngine.onUpdate(() => {
    const stateMetrics = VEGAStateMachine.getMetrics();
    VEGAMetricsEngine.setIterationFromState(stateMetrics.transitionCount);
    updateMetricsDisplay();
  });
  
  console.log('∞ INFINITY LOOP ACTIVATED – 3•5•8 – Æ');
}

function iterateLoop() {
  if (!isLoopActive) startInfinityLoop();
  
  const state = VEGAStateMachine.getState();
  const valid = VEGAStateMachine.getValidTransitions(state.current);
  if (valid.length > 0) {
    VEGAStateMachine.transition(valid[0]);
  }
}

function toggleSonic() {
  if (!sonicActive) {
    VEGASonicEngine.initialize();
    const state = VEGAStateMachine.getState();
    VEGASonicEngine.playDrone(state.current);
    
    VEGASonicEngine.onAnalysis((data) => {
      if (visualActive) VEGAVisualEngine.updateAudioData(data);
    });
    
    sonicActive = true;
    console.log('Sonic Engine: ON');
  } else {
    VEGASonicEngine.stopDrone();
    sonicActive = false;
    console.log('Sonic Engine: OFF');
  }
  updateMetricsDisplay();
}

function toggleVisual() {
  if (!visualActive) {
    VEGAVisualEngine.initialize('vega-visual-canvas');
    VEGAVisualEngine.start();
    const state = VEGAStateMachine.getState();
    VEGAVisualEngine.setState(state.current);
    visualActive = true;
    console.log('Visual Engine: ON');
  } else {
    VEGAVisualEngine.stop();
    visualActive = false;
    console.log('Visual Engine: OFF');
  }
  updateMetricsDisplay();
}

function initializeAgents() {
  VEGAAgentRegistry.register('state-observer', StateObserverAgent);
  VEGAAgentRegistry.register('metrics-narrator', MetricsNarratorAgent);
  
  VEGAAgentRegistry.onEvent((event) => {
    if (event.type === 'observation' && event.agentId === 'metrics-narrator') {
      updateNarrativeDisplay();
    }
  });
  
  console.log('Meta Agents: Registered');
}

function toggleAgents() {
  if (!agentsActive) {
    if (!isLoopActive) startInfinityLoop();
    VEGAAgentRegistry.startAll();
    agentsActive = true;
    console.log('Meta Agents: ACTIVE');
  } else {
    VEGAAgentRegistry.stopAll();
    agentsActive = false;
    console.log('Meta Agents: STOPPED');
  }
  updateMetricsDisplay();
}

function createParticles() {
  const container = document.querySelector('.infinity-bg');
  if (!container) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: rgba(0, 255, 255, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s infinite ease-in-out;
    `;
    container.appendChild(particle);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayAgents(agentData);
  displayModules(moduleData);
  updateLoopStatus();
  createParticles();
  initializeAgents();
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  const activateBtn = document.querySelector('.btn-primary');
  if (activateBtn) {
    activateBtn.addEventListener('click', () => {
      startInfinityLoop();
      toggleSonic();
      toggleVisual();
      activateBtn.textContent = 'SYSTEM ACTIVE';
      activateBtn.classList.add('active');
    });
  }
  
  console.log('VEGA Foundation – INFINITY LOOP Ready');
  console.log('Signature: ADAM EREN VEGA – Æ –');
});
