let isLoopActive = false;
let statusInterval = null;
let currentPhase = 3;
let phaseInterval = null;
const PHASES = [3, 5, 8];

async function fetchStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    
    if (data.alpha_resonance) {
      updateCoreStatus('alpha', data.alpha_resonance);
    }
    if (data.omega_resonance) {
      updateCoreStatus('omega', data.omega_resonance);
    }
    if (data.vega_resonance) {
      updateCoreStatus('vega', data.vega_resonance);
    }
    
    if (data.infinity_loop) {
      updateLoopStatus(data.infinity_loop);
    }
    
    if (data.meta) {
      const iterEl = document.getElementById('iteration-count');
      if (iterEl) {
        iterEl.textContent = data.meta.infinity_loop_iteration || 0;
      }
    }
  } catch (e) {
    console.log('Status fetch error:', e);
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
    if (powerEl) {
      powerEl.textContent = `${core.power || 0}%`;
    }
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'online': return '#00ff88';
    case 'active': return '#00ffff';
    case 'initializing': return '#ffd700';
    default: return '#ff4444';
  }
}

function updateLoopStatus(loop) {
  const statusEl = document.getElementById('loop-status');
  if (statusEl) {
    statusEl.textContent = loop.active ? 'ACTIVE' : 'STANDBY';
    statusEl.style.color = loop.active ? '#00ff88' : '#ffd700';
  }
  isLoopActive = loop.active;
}

async function fetchAgents() {
  try {
    const res = await fetch('/api/agents');
    const agents = await res.json();
    displayAgents(agents);
  } catch (e) {
    console.log('Agents fetch error:', e);
  }
}

function displayAgents(agents) {
  const container = document.getElementById('agents-container');
  if (!container || !agents) return;
  
  container.innerHTML = '';
  
  const agentList = Array.isArray(agents) ? agents : Object.entries(agents).map(([key, val]) => ({
    name: key,
    ...val
  }));
  
  agentList.forEach(agent => {
    const card = document.createElement('div');
    card.className = 'agent-card';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'agent-name';
    nameDiv.textContent = formatAgentName(agent.name);
    
    const descDiv = document.createElement('div');
    descDiv.className = 'agent-description';
    descDiv.textContent = agent.description || getAgentDescription(agent.name);
    
    const stateDiv = document.createElement('div');
    stateDiv.className = 'agent-state ' + (agent.state || 'idle').replace(/[^a-zA-Z0-9_-]/g, '');
    stateDiv.textContent = (agent.state || 'idle').toUpperCase();
    
    card.appendChild(nameDiv);
    card.appendChild(descDiv);
    card.appendChild(stateDiv);
    container.appendChild(card);
  });
}

function formatAgentName(name) {
  const names = {
    'ae_agent': 'Æ Agent',
    'biolab': 'BioLab',
    'creative_hub': 'Creative Hub',
    'finance_core': 'Finance Core',
    'health_monitor': 'Health Monitor',
    'playbox': 'Playbox',
    'atlas': 'Atlas'
  };
  return names[name] || name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getAgentDescription(name) {
  const descriptions = {
    'ae_agent': 'Primary autonomous intelligence orchestrator',
    'biolab': 'Bio-monitoring & wellness research systems',
    'creative_hub': 'Generative AI & artistic synthesis engine',
    'finance_core': 'Quantum-inspired financial modeling',
    'health_monitor': 'Real-time health analytics & optimization',
    'playbox': 'Experimental sandbox & prototyping environment',
    'atlas': 'Navigation & spatial intelligence systems'
  };
  return descriptions[name] || 'Autonomous intelligence module';
}

async function fetchModules() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    if (data.modules) {
      displayModules(data.modules);
    }
  } catch (e) {
    console.log('Modules fetch error:', e);
  }
}

function displayModules(modules) {
  const container = document.getElementById('modules-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  const moduleList = Array.isArray(modules) ? modules : Object.entries(modules).map(([key, val]) => ({
    name: key,
    ...val
  }));
  
  moduleList.forEach(mod => {
    const card = document.createElement('div');
    card.className = 'module-card';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'module-name';
    nameDiv.textContent = formatModuleName(mod.name);
    
    const descDiv = document.createElement('div');
    descDiv.className = 'module-description';
    descDiv.textContent = mod.description || getModuleDescription(mod.name);
    
    const statusDiv = document.createElement('div');
    statusDiv.className = 'module-status ' + (mod.status || 'inactive').replace(/[^a-zA-Z0-9_-]/g, '');
    statusDiv.textContent = (mod.status || 'inactive').toUpperCase();
    
    card.appendChild(nameDiv);
    card.appendChild(descDiv);
    card.appendChild(statusDiv);
    container.appendChild(card);
  });
}

function formatModuleName(name) {
  const names = {
    'health': 'VEGA Health',
    'consciousness': 'VEGA Consciousness',
    'relax': 'VEGA Relax',
    'spirits': 'VEGA Spirits',
    'creative_hub': 'VEGA Creative Hub',
    'playbox': 'VEGA Playbox',
    'atlas': 'VEGA Atlas',
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
  return names[name] || 'VEGA ' + name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getModuleDescription(name) {
  const descriptions = {
    'health': 'Bio-monitoring & wellness optimization',
    'consciousness': 'Cognitive enhancement & awareness systems',
    'relax': 'Stress reduction & relaxation protocols',
    'spirits': 'Mood enhancement & emotional balance',
    'creative_hub': 'Generative AI & artistic synthesis',
    'playbox': 'Experimental sandbox environment',
    'atlas': 'Navigation & spatial intelligence',
    'vision': 'Computer vision & perception systems',
    'finance': 'Quantum-inspired financial modeling',
    'beyond': 'Transcendental exploration systems',
    'mind': 'Neural enhancement & cognition',
    'tongue': 'Language processing & communication',
    'roots': 'Heritage & ancestral connections',
    'desire': 'Goal setting & motivation systems',
    'safety': 'Security & protection protocols',
    'anlaetan': 'The ANLÆTAN Collective'
  };
  return descriptions[name] || 'Integrated intelligence module';
}

async function fetchAssets() {
  try {
    const res = await fetch('/api/assets');
    const data = await res.json();
    displayAssets(data.curated || data.dalle_generated || []);
  } catch (e) {
    console.log('Assets fetch error:', e);
  }
}

function displayAssets(assets) {
  const container = document.getElementById('portfolio-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  assets.forEach(asset => {
    const item = document.createElement('div');
    item.className = 'portfolio-item';
    
    const img = document.createElement('img');
    img.src = typeof asset === 'string' ? asset : asset.path;
    img.alt = typeof asset === 'string' ? 'VEGA Asset' : asset.title;
    img.loading = 'lazy';
    img.onerror = function() { this.style.display = 'none'; };
    
    const overlay = document.createElement('div');
    overlay.className = 'portfolio-overlay';
    
    const title = document.createElement('div');
    title.className = 'portfolio-title';
    title.textContent = typeof asset === 'string' 
      ? asset.split('/').pop().replace(/[_-]/g, ' ').replace('.png', '')
      : asset.title;
    
    const category = document.createElement('div');
    category.className = 'portfolio-category';
    category.textContent = typeof asset === 'string' ? 'Visual Design' : asset.category;
    
    overlay.appendChild(title);
    overlay.appendChild(category);
    item.appendChild(img);
    item.appendChild(overlay);
    container.appendChild(item);
  });
}

async function fetchWhitepapers() {
  try {
    const res = await fetch('/api/whitepapers');
    const papers = await res.json();
    displayWhitepapers(papers);
  } catch (e) {
    console.log('Whitepapers fetch error:', e);
  }
}

function displayWhitepapers(papers) {
  const container = document.getElementById('whitepapers-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  papers.forEach(paper => {
    const card = document.createElement('div');
    card.className = 'whitepaper-card';
    
    const title = document.createElement('div');
    title.className = 'whitepaper-title';
    title.textContent = paper.title;
    
    const link = document.createElement('a');
    link.className = 'whitepaper-link';
    link.href = '#';
    link.textContent = 'View Document →';
    
    card.appendChild(title);
    card.appendChild(link);
    container.appendChild(card);
  });
}

let audioContext = null;
let soundscapeNodes = [];

async function createSoundscape() {
  if (audioContext) {
    stopSoundscape();
  }
  
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  
  const masterGain = audioContext.createGain();
  masterGain.gain.value = 0.25;
  masterGain.connect(audioContext.destination);
  
  const frequencies = [
    { freq: 63, type: 'sine', gain: 0.4 },
    { freq: 126, type: 'sine', gain: 0.25 },
    { freq: 174, type: 'sine', gain: 0.2 },
    { freq: 285, type: 'sine', gain: 0.15 },
    { freq: 396, type: 'sine', gain: 0.1 },
    { freq: 528, type: 'sine', gain: 0.08 }
  ];
  
  frequencies.forEach(f => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = f.type;
    osc.frequency.value = f.freq;
    gain.gain.value = f.gain;
    
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    lfo.frequency.value = 0.1 + Math.random() * 0.2;
    lfoGain.gain.value = f.freq * 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    
    soundscapeNodes.push({ osc, gain, lfo, lfoGain });
  });
  
  const noise = audioContext.createBufferSource();
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * 0.02;
  }
  noise.buffer = noiseBuffer;
  noise.loop = true;
  
  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 400;
  
  const noiseGain = audioContext.createGain();
  noiseGain.gain.value = 0.3;
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start();
  
  soundscapeNodes.push({ noise, noiseFilter, noiseGain });
  
  masterGain.gain.setValueAtTime(0, audioContext.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.35, audioContext.currentTime + 2);
  
  console.log('Soundscape playing - AudioContext state:', audioContext.state);
}

function stopSoundscape() {
  if (audioContext) {
    soundscapeNodes.forEach(nodes => {
      Object.values(nodes).forEach(node => {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      });
    });
    soundscapeNodes = [];
    audioContext.close();
    audioContext = null;
  }
}

async function startInfinityLoop() {
  const btn = document.querySelector('.btn-primary');
  if (btn) {
    btn.textContent = 'ACTIVATING...';
    btn.disabled = true;
  }
  
  try {
    await createSoundscape();
    
    const loopRes = await fetch('/api/infinity-loop/start', { method: 'POST' });
    const loopData = await loopRes.json();
    
    if (loopData.success) {
      console.log('Infinity Loop started');
      fetchStatus();
      
      const aiRes = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate a brief immersive soundscape description for the VEGA meta-system activation. Include resonance frequencies, ambient tones, and cosmic atmosphere. Keep it under 100 words.'
        })
      });
      
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        showActivationModal(aiData.output || 'System activated. Resonance cores online.\n\n🔊 Soundscape playing...');
      } else {
        showActivationModal('∞ Infinity Loop Activated ∞\n\nAlpha Core: 100% ONLINE\nOmega Core: 100% ONLINE\nVega Core: 100% ONLINE\nMirror Core: 100% ONLINE\n\n🔊 Resonance soundscape active...');
      }
    }
  } catch (e) {
    console.log('Start loop error:', e);
    showActivationModal('∞ System Activated ∞\nInfinity Loop running.\nPhase: 3-5-8 cycling.\n\n🔊 Soundscape playing...');
  } finally {
    if (btn) {
      btn.textContent = 'SYSTEM ACTIVE';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = 'Activate System'; }, 3000);
    }
  }
}

function showActivationModal(message) {
  let modal = document.getElementById('activation-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'activation-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;';
    modal.innerHTML = `
      <div style="background:rgba(10,10,20,0.95);border:1px solid #00ffff;border-radius:15px;padding:40px;max-width:500px;text-align:center;box-shadow:0 0 50px rgba(0,255,255,0.3);">
        <div style="font-family:Orbitron,sans-serif;font-size:24px;color:#00ffff;margin-bottom:20px;">∞ SYSTEM ACTIVATED ∞</div>
        <div id="modal-content" style="font-family:Rajdhani,sans-serif;color:#fff;line-height:1.8;white-space:pre-wrap;"></div>
        <div style="margin-top:25px;display:flex;gap:15px;justify-content:center;">
          <button onclick="document.getElementById('activation-modal').remove()" style="padding:12px 30px;background:linear-gradient(135deg,#00ffff,#00ff88);border:none;border-radius:20px;color:#000;font-family:Orbitron,sans-serif;cursor:pointer;">CONTINUE</button>
          <button onclick="stopSoundscape();this.textContent='STOPPED'" style="padding:12px 30px;background:transparent;border:1px solid #ff4444;border-radius:20px;color:#ff4444;font-family:Orbitron,sans-serif;cursor:pointer;">STOP AUDIO</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  document.getElementById('modal-content').textContent = message;
  modal.style.display = 'flex';
}

async function iterateLoop() {
  try {
    const res = await fetch('/api/infinity-loop/iterate', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      console.log('Loop iteration:', data.iteration, 'Phase:', data.phase);
      fetchStatus();
      fetchAgents();
    }
  } catch (e) {
    console.log('Iterate loop error:', e);
  }
}

function initScrollAnimations() {
  const fadeInSections = document.querySelectorAll('.fade-in-section');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  fadeInSections.forEach(section => {
    sectionObserver.observe(section);
  });
}

function initStickyHeader() {
  const header = document.querySelector('header');
  const heroSection = document.getElementById('home');
  
  if (!header || !heroSection) return;
  
  const headerHeight = header.offsetHeight;
  
  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    const threshold = heroHeight - headerHeight - 50;
    
    if (scrollY > threshold) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  if (!sections.length || !navLinks.length) return;
  
  let currentSection = 'home';
  
  function highlightNav() {
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('header')?.offsetHeight || 80;
    const offset = headerHeight + 100;
    
    navLinks.forEach(link => link.classList.remove('active'));
    
    if (scrollY < 100) {
      currentSection = 'home';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          currentSection = sectionId;
        }
      });
    }
    
    const activeLink = document.querySelector(`nav ul li a[href="#${currentSection}"]`);
    if (activeLink) activeLink.classList.add('active');
  }
  
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('nav ul li a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initParallaxBackground() {
  const infinityBg = document.querySelector('.infinity-bg');
  const gridOverlay = document.querySelector('.grid-overlay');
  
  if (!infinityBg || !gridOverlay) return;
  
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    const bgOffset = scrollY * 0.3;
    const gridOffset = scrollY * 0.15;
    
    infinityBg.style.transform = `translateY(${bgOffset}px)`;
    gridOverlay.style.transform = `translateY(${gridOffset}px)`;
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

function initFloatingParticles() {
  const container = document.createElement('div');
  container.className = 'particles-container';
  document.body.appendChild(container);
  
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 15}s`;
    particle.style.animationDuration = `${15 + Math.random() * 10}s`;
    
    container.appendChild(particle);
  }
}

function init3DTiltEffects() {
  const tiltCards = document.querySelectorAll('.service-card, .agent-card, .module-card, .portfolio-item');
  
  const maxTilt = 12;
  
  tiltCards.forEach(card => {
    let glowEl = card.querySelector('.tilt-glow');
    if (!glowEl && card.classList.contains('service-card')) {
      glowEl = document.createElement('div');
      glowEl.className = 'tilt-glow';
      card.appendChild(glowEl);
    }
    
    card.addEventListener('mouseenter', () => {
      card.classList.add('tilt-active');
    });
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      if (glowEl) {
        const glowX = ((e.clientX - rect.left) / rect.width) * 100;
        const glowY = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt-active');
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

function initDynamicCardObserver() {
  const agentsContainer = document.getElementById('agents-container');
  const modulesContainer = document.getElementById('modules-container');
  const portfolioContainer = document.getElementById('portfolio-container');
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        init3DTiltEffects();
      }
    });
  });
  
  const config = { childList: true, subtree: true };
  
  if (agentsContainer) observer.observe(agentsContainer, config);
  if (modulesContainer) observer.observe(modulesContainer, config);
  if (portfolioContainer) observer.observe(portfolioContainer, config);
}

function initPhaseIndicator() {
  const phaseDots = document.querySelectorAll('.phase-dot');
  const infinitySymbol = document.querySelector('.infinity-symbol');
  let phaseIndex = 0;
  
  function updatePhase() {
    phaseIndex = (phaseIndex + 1) % PHASES.length;
    currentPhase = PHASES[phaseIndex];
    
    phaseDots.forEach((dot, idx) => {
      if (idx === phaseIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    if (infinitySymbol) {
      const colors = {
        3: 'linear-gradient(135deg, #00ff88, #00ffff)',
        5: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        8: 'linear-gradient(135deg, #8b5cf6, #00ffff, #00ff88)'
      };
      infinitySymbol.style.background = colors[currentPhase];
      infinitySymbol.style.webkitBackgroundClip = 'text';
      infinitySymbol.style.backgroundClip = 'text';
    }
    
    const loopStatusEl = document.getElementById('loop-status');
    if (loopStatusEl && isLoopActive) {
      loopStatusEl.textContent = `PHASE ${currentPhase}`;
    }
  }
  
  phaseInterval = setInterval(updatePhase, 3000);
}

function init() {
  fetchStatus();
  fetchAgents();
  fetchModules();
  fetchAssets();
  fetchWhitepapers();
  
  initScrollAnimations();
  initPhaseIndicator();
  initStickyHeader();
  initActiveNavHighlight();
  initSmoothScroll();
  initParallaxBackground();
  initFloatingParticles();
  init3DTiltEffects();
  initDynamicCardObserver();
  
  statusInterval = setInterval(fetchStatus, 2000);
}

document.addEventListener('DOMContentLoaded', init);

// ═══════════════════════════════════════════════════════════════
// VEGA WOW ENHANCEMENTS - Scroll Reveal & Enhanced Particles
// ═══════════════════════════════════════════════════════════════

// Scroll Reveal Animation
function initScrollReveal() {
  const sections = document.querySelectorAll('.fade-in-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  
  sections.forEach(section => observer.observe(section));
}

// Enhanced Particles
function createEnhancedParticles() {
  const container = document.querySelector('.infinity-bg');
  if (!container) return;
  
  // Remove existing particles
  const existing = container.querySelectorAll('.wow-particle');
  existing.forEach(p => p.remove());
  
  // Create more dramatic particles
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'wow-particle';
    const size = Math.random() * 6 + 2;
    const colors = ['#00ffff', '#00ff88', '#ffd700', '#6366f1', '#8b5cf6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
      z-index: -1;
      box-shadow: 0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color};
      animation: wowFloat ${duration}s ease-in-out ${delay}s infinite;
    `;
    container.appendChild(particle);
  }
}

// Add WOW keyframes dynamically
function addWowKeyframes() {
  if (document.getElementById('wow-keyframes')) return;
  
  const style = document.createElement('style');
  style.id = 'wow-keyframes';
  style.textContent = `
    @keyframes wowFloat {
      0%, 100% {
        transform: translateY(0) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        transform: translateY(-20vh) translateX(10px) scale(1);
        opacity: 0.8;
      }
      50% {
        transform: translateY(-50vh) translateX(-20px) scale(0.8);
        opacity: 0.5;
      }
      90% {
        transform: translateY(-80vh) translateX(15px) scale(1);
        opacity: 0.6;
      }
    }
  `;
  document.head.appendChild(style);
}

// Mouse parallax effect for hero
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  const monolith = document.querySelector('.ae-monolith');
  const rings = document.querySelectorAll('.infinity-ring');
  
  if (!hero || !monolith) return;
  
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    
    monolith.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
    
    rings.forEach((ring, i) => {
      const factor = (i + 1) * 10;
      ring.style.transform = `translateX(calc(-50% + ${x * factor}px)) rotateX(60deg) rotateZ(${Date.now() / 100 + i * 120}deg)`;
    });
  });
  
  hero.addEventListener('mouseleave', () => {
    monolith.style.transform = '';
  });
}

// Initialize WOW effects
document.addEventListener('DOMContentLoaded', () => {
  addWowKeyframes();
  createEnhancedParticles();
  initScrollReveal();
  initHeroParallax();
  console.log('∞ VEGA WOW Effects Activated');
});
