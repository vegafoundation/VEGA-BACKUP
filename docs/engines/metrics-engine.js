const VEGAMetricsEngine = (function() {
  let startTime = Date.now();
  let frameCount = 0;
  let lastFrameTime = Date.now();
  let fps = 0;
  let listeners = [];
  let metricsInterval = null;

  const metrics = {
    uptime: 0,
    fps: 0,
    memoryUsed: 0,
    coreResonance: {
      alpha: { power: 0, status: 'initializing' },
      omega: { power: 0, status: 'initializing' },
      vega: { power: 0, status: 'initializing' },
      mirror: { power: 0, status: 'initializing' }
    },
    infinityLoop: {
      iteration: 0,
      phase: 3,
      active: false
    },
    engines: {
      state: null,
      sonic: null,
      visual: null,
      prompt: null
    }
  };

  function updateFPS() {
    frameCount++;
    const now = Date.now();
    const delta = now - lastFrameTime;
    
    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastFrameTime = now;
    }
    
    requestAnimationFrame(updateFPS);
  }

  function computeCoreResonance() {
    const time = Date.now();
    const baseVariation = Math.sin(time / 5000) * 10;
    
    metrics.coreResonance.alpha = {
      power: Math.round(75 + baseVariation + Math.sin(time / 3000) * 8),
      status: 'online'
    };
    metrics.coreResonance.omega = {
      power: Math.round(82 + baseVariation + Math.cos(time / 4000) * 6),
      status: 'online'
    };
    metrics.coreResonance.vega = {
      power: Math.round(88 + baseVariation + Math.sin(time / 2500) * 5),
      status: 'online'
    };
    metrics.coreResonance.mirror = {
      power: Math.round(70 + baseVariation + Math.cos(time / 3500) * 10),
      status: 'online'
    };
  }

  function updateInfinityLoop() {
    metrics.infinityLoop.iteration++;
    const phases = [3, 5, 8];
    const currentIndex = phases.indexOf(metrics.infinityLoop.phase);
    metrics.infinityLoop.phase = phases[(currentIndex + 1) % phases.length];
  }

  function setIterationFromState(transitionCount) {
    metrics.infinityLoop.iteration = 9000 + transitionCount;
    const phases = [3, 5, 8];
    metrics.infinityLoop.phase = phases[transitionCount % 3];
  }

  function collectEngineMetrics() {
    if (typeof VEGAStateMachine !== 'undefined') {
      metrics.engines.state = VEGAStateMachine.getMetrics();
    }
    if (typeof VEGASonicEngine !== 'undefined') {
      metrics.engines.sonic = VEGASonicEngine.getMetrics();
    }
    if (typeof VEGAVisualEngine !== 'undefined') {
      metrics.engines.visual = VEGAVisualEngine.getMetrics();
    }
    if (typeof VEGAPromptEngine !== 'undefined') {
      metrics.engines.prompt = VEGAPromptEngine.getMetrics();
    }
  }

  function getAll() {
    metrics.uptime = Date.now() - startTime;
    metrics.fps = fps;
    
    if (performance && performance.memory) {
      metrics.memoryUsed = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
    
    computeCoreResonance();
    collectEngineMetrics();
    
    return JSON.parse(JSON.stringify(metrics));
  }

  function get(path) {
    const parts = path.split('.');
    let value = metrics;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    return value;
  }

  function onUpdate(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }

  function startMonitoring(intervalMs = 1000) {
    if (metricsInterval) clearInterval(metricsInterval);
    
    metricsInterval = setInterval(() => {
      const current = getAll();
      listeners.forEach(fn => fn(current));
    }, intervalMs);
    
    metrics.infinityLoop.active = true;
    updateFPS();
  }

  function stopMonitoring() {
    if (metricsInterval) {
      clearInterval(metricsInterval);
      metricsInterval = null;
    }
    metrics.infinityLoop.active = false;
  }

  function getSummary() {
    const m = getAll();
    return {
      uptime: formatUptime(m.uptime),
      fps: m.fps,
      memory: m.memoryUsed + ' MB',
      cores: Object.entries(m.coreResonance).map(([k, v]) => `${k}:${v.power}%`).join(' | '),
      loop: `${m.infinityLoop.phase} (${m.infinityLoop.iteration})`,
      engines: Object.entries(m.engines).filter(([k, v]) => v).map(([k, v]) => k).join(', ')
    };
  }

  function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }

  function initialize() {
    startTime = Date.now();
    frameCount = 0;
    lastFrameTime = Date.now();
    metrics.infinityLoop.iteration = Math.floor(Math.random() * 1000) + 9000;
    return getAll();
  }

  return {
    initialize,
    getAll,
    get,
    getSummary,
    onUpdate,
    startMonitoring,
    stopMonitoring,
    updateInfinityLoop,
    setIterationFromState
  };
})();

if (typeof module !== 'undefined') module.exports = VEGAMetricsEngine;
