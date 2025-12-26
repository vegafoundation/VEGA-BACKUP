// VEGA Admin Panel - Static Version for GitHub Pages
// No backend required - uses simulated data

// Simulated core data
const coreData = {
  alpha: { power: 87, status: 'online' },
  omega: { power: 92, status: 'online' },
  vega: { power: 78, status: 'active' }
};

// Simulated modules
const modulesData = {
  health: { enabled: true, status: 'active' },
  consciousness: { enabled: true, status: 'active' },
  relax: { enabled: true, status: 'active' },
  spirits: { enabled: true, status: 'active' },
  creative_hub: { enabled: true, status: 'active' },
  playbox: { enabled: false, status: 'inactive' },
  atlas: { enabled: true, status: 'active' },
  vision: { enabled: true, status: 'active' },
  finance: { enabled: false, status: 'inactive' },
  beyond: { enabled: true, status: 'active' },
  mind: { enabled: true, status: 'active' },
  tongue: { enabled: false, status: 'inactive' },
  roots: { enabled: true, status: 'active' },
  desire: { enabled: true, status: 'active' },
  safety: { enabled: true, status: 'active' },
  anlaetan: { enabled: true, status: 'active' }
};

// Simulated agents
const agentsData = [
  { name: 'ae_agent', type: 'Primary', state: 'active', description: 'Primary intelligence orchestrator' },
  { name: 'ae_symbol_agent', type: 'Secondary', state: 'running', description: 'Symbol processing and meta-cognition' },
  { name: 'miracore', type: 'Utility', state: 'idle', description: 'Invisible guardian for security oversight' }
];

// Simulated analytics
const analyticsData = {
  totalIterations: 9742,
  avgResonance: 85.7,
  uptime: '99.2%',
  activeModules: 13,
  peakPhase: 8
};

let refreshInterval = null;

function fetchCores() {
  // Simulate random fluctuations
  Object.keys(coreData).forEach(key => {
    coreData[key].power = Math.min(100, Math.max(50, coreData[key].power + (Math.random() * 6 - 3)));
  });
  
  document.getElementById('alpha-power').textContent = `${Math.round(coreData.alpha.power)}%`;
  const alphaStatus = document.getElementById('alpha-status');
  alphaStatus.textContent = coreData.alpha.status;
  alphaStatus.className = 'core-status ' + coreData.alpha.status;
  
  document.getElementById('omega-power').textContent = `${Math.round(coreData.omega.power)}%`;
  const omegaStatus = document.getElementById('omega-status');
  omegaStatus.textContent = coreData.omega.status;
  omegaStatus.className = 'core-status ' + coreData.omega.status;
  
  document.getElementById('vega-power').textContent = `${Math.round(coreData.vega.power)}%`;
  const vegaStatus = document.getElementById('vega-status');
  vegaStatus.textContent = coreData.vega.status;
  vegaStatus.className = 'core-status ' + coreData.vega.status;
}

function fetchModules() {
  const container = document.getElementById('modules-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  const moduleNames = {
    'health': 'VEGA Health',
    'consciousness': 'VEGA Consciousness',
    'relax': 'VEGA Relax',
    'spirits': 'VEGA Spirits',
    'creative_hub': 'Creative Hub',
    'playbox': 'Playbox',
    'atlas': 'Atlas',
    'vision': 'VEGA Vision',
    'finance': 'VEGA Finance',
    'beyond': 'VEGA Beyond',
    'mind': 'VEGA Mind',
    'tongue': 'VEGA Tongue',
    'roots': 'VEGA Roots',
    'desire': 'VEGA Desire',
    'safety': 'VEGA Safety',
    'anlaetan': 'ANLÆTAN'
  };
  
  Object.entries(modulesData).forEach(([key, mod]) => {
    const item = document.createElement('div');
    item.className = 'module-item';
    
    const name = document.createElement('span');
    name.className = 'module-name';
    name.textContent = moduleNames[key] || key;
    
    const status = document.createElement('span');
    status.className = 'module-status ' + mod.status;
    status.textContent = mod.status;
    
    item.appendChild(name);
    item.appendChild(status);
    container.appendChild(item);
  });
}

function fetchAgents() {
  const container = document.getElementById('agents-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  agentsData.forEach(agent => {
    const item = document.createElement('div');
    item.className = 'agent-item';
    
    const info = document.createElement('div');
    info.className = 'agent-info';
    
    const name = document.createElement('span');
    name.className = 'agent-name';
    name.textContent = agent.name;
    
    const type = document.createElement('span');
    type.className = 'agent-type';
    type.textContent = agent.type;
    
    info.appendChild(name);
    info.appendChild(type);
    
    const state = document.createElement('span');
    state.className = 'agent-state ' + agent.state;
    state.textContent = agent.state.toUpperCase();
    
    item.appendChild(info);
    item.appendChild(state);
    container.appendChild(item);
  });
}

function fetchAnalytics() {
  // Update with slight variations
  analyticsData.totalIterations++;
  analyticsData.avgResonance = 80 + Math.random() * 15;
  
  const iterEl = document.getElementById('total-iterations');
  if (iterEl) iterEl.textContent = analyticsData.totalIterations.toLocaleString();
  
  const resEl = document.getElementById('avg-resonance');
  if (resEl) resEl.textContent = analyticsData.avgResonance.toFixed(1) + '%';
  
  const upEl = document.getElementById('system-uptime');
  if (upEl) upEl.textContent = analyticsData.uptime;
  
  const modEl = document.getElementById('active-modules');
  if (modEl) modEl.textContent = analyticsData.activeModules;
}

function refreshAll() {
  fetchCores();
  fetchModules();
  fetchAgents();
  fetchAnalytics();
}

function startAutoRefresh() {
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(refreshAll, 5000);
  
  const btn = document.getElementById('auto-refresh-btn');
  if (btn) {
    btn.textContent = 'Auto-Refresh: ON';
    btn.classList.add('active');
  }
}

function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  
  const btn = document.getElementById('auto-refresh-btn');
  if (btn) {
    btn.textContent = 'Auto-Refresh: OFF';
    btn.classList.remove('active');
  }
}

function toggleAutoRefresh() {
  if (refreshInterval) {
    stopAutoRefresh();
  } else {
    startAutoRefresh();
  }
}

function logout() {
  // Static version - just redirect to login
  window.location.href = 'admin-login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  refreshAll();
  startAutoRefresh();
  
  // Bind buttons
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) refreshBtn.addEventListener('click', refreshAll);
  
  const autoRefreshBtn = document.getElementById('auto-refresh-btn');
  if (autoRefreshBtn) autoRefreshBtn.addEventListener('click', toggleAutoRefresh);
  
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  
  console.log('VEGA Admin Panel - Static Demo');
  console.log('Signature: ADAM EREN VEGA – Æ –');
});
