const VEGAStateMachine = (function() {
  const STATES = {
    VOID: { name: 'VOID', color: '#1a1a2e', description: 'Pre-initialization void' },
    ENTRY: { name: 'ENTRY', color: '#16213e', description: 'System entry point' },
    CALIBRATION: { name: 'CALIBRATION', color: '#0f3460', description: 'Calibrating resonance' },
    RESONANCE: { name: 'RESONANCE', color: '#00ff88', description: 'Resonance active' },
    FLOW: { name: 'FLOW', color: '#00ffff', description: 'Flow state achieved' },
    INTEGRATION: { name: 'INTEGRATION', color: '#ffd700', description: 'Full integration' }
  };

  const TRANSITIONS = [
    ['VOID', 'ENTRY'],
    ['ENTRY', 'CALIBRATION'],
    ['CALIBRATION', 'RESONANCE'],
    ['RESONANCE', 'FLOW'],
    ['FLOW', 'INTEGRATION'],
    ['INTEGRATION', 'RESONANCE'],
    ['RESONANCE', 'CALIBRATION'],
    ['CALIBRATION', 'ENTRY']
  ];

  let currentState = 'VOID';
  let transitionCount = 0;
  let stateHistory = [];
  let listeners = [];
  let autoTransitionInterval = null;

  function getValidTransitions(from) {
    return TRANSITIONS.filter(t => t[0] === from).map(t => t[1]);
  }

  function transition(to) {
    const valid = getValidTransitions(currentState);
    if (!valid.includes(to)) {
      console.warn(`Invalid transition: ${currentState} → ${to}`);
      return false;
    }
    
    const from = currentState;
    currentState = to;
    transitionCount++;
    stateHistory.push({ from, to, timestamp: Date.now() });
    
    if (stateHistory.length > 100) stateHistory.shift();
    
    listeners.forEach(fn => fn({ from, to, state: STATES[to], count: transitionCount }));
    return true;
  }

  function autoAdvance() {
    const valid = getValidTransitions(currentState);
    if (valid.length > 0) {
      const next = valid[Math.floor(Math.random() * valid.length)];
      transition(next);
    }
  }

  function startAutoTransition(intervalMs = 5000) {
    if (autoTransitionInterval) clearInterval(autoTransitionInterval);
    autoTransitionInterval = setInterval(autoAdvance, intervalMs);
  }

  function stopAutoTransition() {
    if (autoTransitionInterval) {
      clearInterval(autoTransitionInterval);
      autoTransitionInterval = null;
    }
  }

  function onTransition(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }

  function getState() {
    return { current: currentState, info: STATES[currentState], count: transitionCount };
  }

  function getHistory() {
    return [...stateHistory];
  }

  function getMetrics() {
    return {
      currentState,
      transitionCount,
      historyLength: stateHistory.length,
      validNext: getValidTransitions(currentState),
      uptime: stateHistory.length > 0 ? Date.now() - stateHistory[0].timestamp : 0
    };
  }

  function initialize() {
    currentState = 'VOID';
    transitionCount = 0;
    stateHistory = [];
    transition('ENTRY');
    return getState();
  }

  return {
    STATES,
    TRANSITIONS,
    initialize,
    transition,
    getState,
    getHistory,
    getMetrics,
    getValidTransitions,
    onTransition,
    startAutoTransition,
    stopAutoTransition
  };
})();

if (typeof module !== 'undefined') module.exports = VEGAStateMachine;
