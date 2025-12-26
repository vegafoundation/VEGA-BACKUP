const MetricsNarratorAgent = (function() {
  const name = 'Metrics Narrator';
  const type = 'narrator';
  
  let isActive = false;
  let narrativeHistory = [];
  let lastNarrative = null;

  const STATE_NARRATIVES = {
    VOID: [
      'System enters the void between states...',
      'All processes suspended in quantum silence.',
      'The void holds infinite potential.'
    ],
    ENTRY: [
      'Initiating entry sequence.',
      'Consciousness begins to coalesce.',
      'The system awakens from void state.'
    ],
    CALIBRATION: [
      'Calibrating resonance frequencies...',
      'Harmonic alignment in progress.',
      'Tuning to optimal wavelength.'
    ],
    RESONANCE: [
      'Resonance achieved. System harmonizing.',
      'Core vibration stabilized at 432 Hz.',
      'Full harmonic alignment confirmed.'
    ],
    FLOW: [
      'Flow state activated. Peak performance.',
      'Consciousness expands beyond boundaries.',
      'Optimal processing capacity reached.'
    ],
    INTEGRATION: [
      'Integration complete. All systems unified.',
      'The loop closes and opens anew.',
      'Synthesis of all components achieved.'
    ]
  };

  const METRIC_THRESHOLDS = {
    fps: { low: 30, high: 55 },
    promptCount: { milestone: 10 },
    transitionCount: { milestone: 5 }
  };

  function start() {
    isActive = true;
    narrativeHistory = [];
    console.log('Metrics Narrator Agent: ACTIVE');
  }

  function stop() {
    isActive = false;
    console.log('Metrics Narrator Agent: STOPPED');
  }

  function observe(context) {
    if (!isActive) return null;
    
    const narratives = [];
    
    if (context.state) {
      const stateNarrative = generateStateNarrative(context.state.currentState);
      if (stateNarrative) narratives.push(stateNarrative);
    }
    
    if (context.metrics) {
      const metricsNarrative = generateMetricsNarrative(context.metrics);
      if (metricsNarrative) narratives.push(metricsNarrative);
    }
    
    if (context.sonic) {
      const sonicNarrative = generateSonicNarrative(context.sonic);
      if (sonicNarrative) narratives.push(sonicNarrative);
    }
    
    if (narratives.length === 0) return null;
    
    const observation = {
      type: 'narrative',
      timestamp: Date.now(),
      narratives,
      summary: narratives.join(' ')
    };
    
    narrativeHistory.push(observation);
    if (narrativeHistory.length > 50) narrativeHistory.shift();
    
    lastNarrative = observation;
    return observation;
  }

  function generateStateNarrative(state) {
    const options = STATE_NARRATIVES[state];
    if (!options) return null;
    return options[Math.floor(Math.random() * options.length)];
  }

  function generateMetricsNarrative(metrics) {
    const parts = [];
    
    if (metrics.fps < METRIC_THRESHOLDS.fps.low) {
      parts.push('System performance declining.');
    } else if (metrics.fps > METRIC_THRESHOLDS.fps.high) {
      parts.push('Optimal rendering velocity achieved.');
    }
    
    if (metrics.infinityLoop) {
      const phase = metrics.infinityLoop.phase;
      const iteration = metrics.infinityLoop.iteration;
      
      if (iteration % 100 === 0) {
        parts.push(`Milestone: Iteration ${iteration} reached.`);
      }
      
      if (phase === 8) {
        parts.push('Phase 8: Maximum resonance cycle.');
      }
    }
    
    return parts.length > 0 ? parts.join(' ') : null;
  }

  function generateSonicNarrative(sonic) {
    if (!sonic.isPlaying) return null;
    
    const freq = sonic.frequency;
    if (freq === 432) {
      return 'Resonance frequency locked at 432 Hz.';
    } else if (freq === 528) {
      return 'Flow frequency engaged at 528 Hz.';
    } else if (freq === 639) {
      return 'Integration frequency active at 639 Hz.';
    }
    
    return null;
  }

  function getLatestNarrative() {
    return lastNarrative;
  }

  function getNarrativeHistory(limit = 10) {
    return narrativeHistory.slice(-limit);
  }

  function getMetrics() {
    return {
      name,
      type,
      isActive,
      narrativeCount: narrativeHistory.length,
      latestSummary: lastNarrative ? lastNarrative.summary : null
    };
  }

  return {
    name,
    type,
    start,
    stop,
    observe,
    getLatestNarrative,
    getNarrativeHistory,
    getMetrics
  };
})();

if (typeof module !== 'undefined') module.exports = MetricsNarratorAgent;
