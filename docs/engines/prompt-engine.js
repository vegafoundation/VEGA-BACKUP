const VEGAPromptEngine = (function() {
  let history = [];
  let templates = {};
  let sessionId = Date.now().toString(36);
  let autoPromptEnabled = false;
  let autoPromptInterval = null;

  const STATE_PROMPTS = {
    VOID: [
      'Entering the void between states...',
      'The silence before creation...',
      'Darkness holds infinite potential...'
    ],
    ENTRY: [
      'Welcome to the VEGA continuum.',
      'Initiating entry sequence...',
      'Crossing the threshold of consciousness...'
    ],
    CALIBRATION: [
      'Calibrating resonance frequencies...',
      'Aligning harmonic wavelengths...',
      'Tuning to the universal frequency...'
    ],
    RESONANCE: [
      'Resonance achieved at 432 Hz.',
      'Harmonic alignment complete.',
      'The frequency of creation pulses through...'
    ],
    FLOW: [
      'Flow state activated.',
      'Consciousness expands infinitely.',
      'The rhythm of existence becomes clear...'
    ],
    INTEGRATION: [
      'Integration complete.',
      'All systems unified.',
      'The loop closes and opens anew...'
    ]
  };

  function generatePrompt(state, context = {}) {
    const prompts = STATE_PROMPTS[state] || STATE_PROMPTS.VOID;
    const basePrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    const entry = {
      id: history.length + 1,
      timestamp: Date.now(),
      state,
      prompt: basePrompt,
      context,
      sessionId
    };
    
    history.push(entry);
    if (history.length > 500) history.shift();
    
    return entry;
  }

  function addTemplate(name, template) {
    templates[name] = template;
  }

  function useTemplate(name, variables = {}) {
    if (!templates[name]) return null;
    
    let prompt = templates[name];
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    
    return generatePrompt('CUSTOM', { template: name, prompt });
  }

  function startAutoPrompt(stateFn, intervalMs = 10000) {
    if (autoPromptInterval) clearInterval(autoPromptInterval);
    autoPromptEnabled = true;
    
    autoPromptInterval = setInterval(() => {
      const state = stateFn();
      generatePrompt(state);
    }, intervalMs);
  }

  function stopAutoPrompt() {
    autoPromptEnabled = false;
    if (autoPromptInterval) {
      clearInterval(autoPromptInterval);
      autoPromptInterval = null;
    }
  }

  function getHistory(limit = 50) {
    return history.slice(-limit);
  }

  function exportHistory() {
    return JSON.stringify(history, null, 2);
  }

  function exportJSONL() {
    return history.map(h => JSON.stringify(h)).join('\n');
  }

  function clearHistory() {
    history = [];
  }

  function getMetrics() {
    const stateCounts = {};
    history.forEach(h => {
      stateCounts[h.state] = (stateCounts[h.state] || 0) + 1;
    });
    
    return {
      sessionId,
      historyLength: history.length,
      templateCount: Object.keys(templates).length,
      autoPromptEnabled,
      stateCounts,
      oldestEntry: history.length > 0 ? history[0].timestamp : null,
      newestEntry: history.length > 0 ? history[history.length - 1].timestamp : null
    };
  }

  function getLatest() {
    return history.length > 0 ? history[history.length - 1] : null;
  }

  function initialize() {
    sessionId = Date.now().toString(36);
    addTemplate('infinity', 'The Infinity Loop cycles through {phase}: 3-5-8');
    addTemplate('resonance', 'Core {core} resonates at {power}% power');
    addTemplate('agent', 'Agent {name} enters {state} state');
    return { sessionId, templates: Object.keys(templates) };
  }

  return {
    initialize,
    generatePrompt,
    addTemplate,
    useTemplate,
    startAutoPrompt,
    stopAutoPrompt,
    getHistory,
    getLatest,
    exportHistory,
    exportJSONL,
    clearHistory,
    getMetrics,
    STATE_PROMPTS
  };
})();

if (typeof module !== 'undefined') module.exports = VEGAPromptEngine;
