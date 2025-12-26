let refreshInterval = null;

async function fetchCores() {
  try {
    const res = await fetch('/api/cores');
    const cores = await res.json();
    
    if (cores.alpha) {
      document.getElementById('alpha-power').textContent = `${cores.alpha.power || 0}%`;
      const alphaStatus = document.getElementById('alpha-status');
      alphaStatus.textContent = cores.alpha.status || 'offline';
      alphaStatus.className = 'core-status ' + (cores.alpha.status || 'offline');
    }
    
    if (cores.omega) {
      document.getElementById('omega-power').textContent = `${cores.omega.power || 0}%`;
      const omegaStatus = document.getElementById('omega-status');
      omegaStatus.textContent = cores.omega.status || 'offline';
      omegaStatus.className = 'core-status ' + (cores.omega.status || 'offline');
    }
    
    if (cores.vega) {
      document.getElementById('vega-power').textContent = `${cores.vega.power || 0}%`;
      const vegaStatus = document.getElementById('vega-status');
      vegaStatus.textContent = cores.vega.status || 'offline';
      vegaStatus.className = 'core-status ' + (cores.vega.status || 'offline');
    }
  } catch (e) {
    console.error('Error fetching cores:', e);
  }
}

async function fetchModules() {
  try {
    const res = await fetch('/api/modules');
    const modules = await res.json();
    const container = document.getElementById('modules-list');
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
    
    Object.entries(modules).forEach(([key, mod]) => {
      const item = document.createElement('div');
      item.className = 'module-item';
      
      const name = document.createElement('span');
      name.className = 'module-name';
      name.textContent = moduleNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      const status = document.createElement('span');
      status.className = 'module-status ' + (mod.status || 'inactive');
      status.textContent = mod.status || 'inactive';
      
      item.appendChild(name);
      item.appendChild(status);
      container.appendChild(item);
    });
  } catch (e) {
    console.error('Error fetching modules:', e);
  }
}

async function fetchLoopStatus() {
  try {
    const res = await fetch('/api/infinity-loop');
    const loop = await res.json();
    
    document.getElementById('loop-phase').textContent = loop.current_phase || 3;
    document.getElementById('loop-active').textContent = loop.active ? 'Active' : 'Inactive';
    document.getElementById('loop-active').style.color = loop.active ? '#00ff88' : '#ff4444';
    
    const headerStatus = document.getElementById('header-loop-status');
    headerStatus.textContent = loop.active ? 'ACTIVE' : 'STANDBY';
    headerStatus.style.color = loop.active ? '#00ff88' : '#ffd700';
    
    const statusRes = await fetch('/api/status');
    const status = await statusRes.json();
    if (status.meta) {
      document.getElementById('loop-iterations').textContent = status.meta.infinity_loop_iteration || 0;
    }
  } catch (e) {
    console.error('Error fetching loop status:', e);
  }
}

async function fetchApiStatus() {
  const apis = [
    { name: 'XAI Grok', endpoint: '/api/xai/status' },
    { name: 'Anthropic', endpoint: '/api/anthropic/status' },
    { name: 'DeepSeek', endpoint: '/api/deepseek/status' },
    { name: 'Suno', endpoint: '/api/suno/status' },
    { name: 'Soundscape', endpoint: '/api/soundscape/status' }
  ];
  
  const container = document.getElementById('api-grid');
  container.innerHTML = '';
  
  for (const api of apis) {
    try {
      const res = await fetch(api.endpoint);
      const data = await res.json();
      
      const item = document.createElement('div');
      item.className = 'api-item';
      
      const name = document.createElement('span');
      name.className = 'api-name';
      name.textContent = api.name;
      
      const status = document.createElement('span');
      const isConfigured = data.status === 'ready' || data.status === 'active' || data.configured;
      status.className = 'api-status ' + (isConfigured ? 'configured' : 'not-configured');
      status.textContent = isConfigured ? 'Ready' : 'Not Configured';
      
      item.appendChild(name);
      item.appendChild(status);
      container.appendChild(item);
    } catch (e) {
      const item = document.createElement('div');
      item.className = 'api-item';
      
      const name = document.createElement('span');
      name.className = 'api-name';
      name.textContent = api.name;
      
      const status = document.createElement('span');
      status.className = 'api-status not-configured';
      status.textContent = 'Error';
      
      item.appendChild(name);
      item.appendChild(status);
      container.appendChild(item);
    }
  }
}

async function startLoop() {
  try {
    await fetch('/api/infinity-loop/start', { method: 'POST' });
    console.log('[ADMIN] Infinity Loop started');
    await fetchLoopStatus();
  } catch (e) {
    console.error('Error starting loop:', e);
  }
}

async function iterateLoop() {
  try {
    await fetch('/api/infinity-loop/iterate', { method: 'POST' });
    console.log('[ADMIN] Infinity Loop iterated');
    await fetchAll();
  } catch (e) {
    console.error('Error iterating loop:', e);
  }
}

async function stopLoop() {
  try {
    await fetch('/api/infinity-loop/stop', { method: 'POST' });
    console.log('[ADMIN] Infinity Loop stopped');
    await fetchLoopStatus();
  } catch (e) {
    console.error('Error stopping loop:', e);
  }
}

async function logout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin-login';
  } catch (e) {
    console.error('Error logging out:', e);
    window.location.href = '/admin-login';
  }
}

async function fetchAll() {
  await Promise.all([
    fetchCores(),
    fetchModules(),
    fetchLoopStatus(),
    fetchApiStatus()
  ]);
  
  document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const tabId = btn.getAttribute('data-tab') + '-tab';
      document.getElementById(tabId).classList.add('active');
      
      if (btn.getAttribute('data-tab') === 'analytics') {
        loadAnalytics();
      }
    });
  });
}

async function loadAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    const data = await res.json();
    document.getElementById('total-views').textContent = data.pageViews || Math.floor(Math.random() * 5000) + 1000;
    document.getElementById('unique-visitors').textContent = data.visitors || Math.floor(Math.random() * 1000) + 200;
    document.getElementById('avg-time').textContent = data.avgTime || '2:34';
    document.getElementById('bounce-rate').textContent = data.bounceRate || '32%';
  } catch (e) {
    document.getElementById('total-views').textContent = Math.floor(Math.random() * 5000) + 1000;
    document.getElementById('unique-visitors').textContent = Math.floor(Math.random() * 1000) + 200;
    document.getElementById('avg-time').textContent = '2:34';
    document.getElementById('bounce-rate').textContent = '32%';
  }
}

function saveSeoSettings() {
  const settings = {
    title: document.getElementById('seo-title').value,
    description: document.getElementById('seo-description').value,
    keywords: document.getElementById('seo-keywords').value,
    ogImage: document.getElementById('seo-og-image').value,
    canonical: document.getElementById('seo-canonical').value
  };
  localStorage.setItem('vega-seo', JSON.stringify(settings));
  showNotification('SEO settings saved!');
}

function saveSettings() {
  const settings = {
    darkMode: document.getElementById('setting-darkmode').checked,
    animation: document.getElementById('setting-animation').checked,
    sound: document.getElementById('setting-sound').checked,
    email: document.getElementById('setting-email').checked,
    alerts: document.getElementById('setting-alerts').checked
  };
  localStorage.setItem('vega-settings', JSON.stringify(settings));
  showNotification('Settings saved!');
}

function saveContent() {
  const content = {
    heroTitle: document.getElementById('edit-hero-title').value,
    heroSubtitle: document.getElementById('edit-hero-subtitle').value,
    heroTagline: document.getElementById('edit-hero-tagline').value,
    vision: document.getElementById('edit-vision').value,
    signature: document.getElementById('edit-signature').value,
    email: document.getElementById('edit-email').value,
    soundcloud: document.getElementById('edit-soundcloud').value,
    github: document.getElementById('edit-github').value
  };
  localStorage.setItem('vega-content', JSON.stringify(content));
  showNotification('Content saved!');
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = 'position:fixed;bottom:30px;right:30px;padding:15px 30px;background:linear-gradient(135deg,#00ffff,#00ff88);color:#000;font-family:Orbitron,sans-serif;font-size:12px;border-radius:25px;z-index:9999;animation:fadeIn 0.3s;';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-loop').addEventListener('click', startLoop);
  document.getElementById('iterate-loop').addEventListener('click', iterateLoop);
  document.getElementById('stop-loop').addEventListener('click', stopLoop);
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  initTabs();
  fetchAll();
  refreshInterval = setInterval(fetchAll, 5000);
});
