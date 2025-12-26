const StateObserverAgent = (function() {
  const name = 'State Observer';
  const type = 'monitor';
  
  let isActive = false;
  let transitionLog = [];
  let anomalies = [];
  let lastState = null;
  let rapidTransitionThreshold = 3;
  let rapidTransitionWindow = 5000;

  function start() {
    isActive = true;
    transitionLog = [];
    anomalies = [];
    lastState = null;
    console.log('State Observer Agent: ACTIVE');
  }

  function stop() {
    isActive = false;
    console.log('State Observer Agent: STOPPED');
  }

  function observe(context) {
    if (!isActive || !context.state) return null;
    
    const currentState = context.state.currentState;
    const now = Date.now();
    const stateChanged = lastState !== null && lastState !== currentState;
    
    const observation = {
      type: 'state_observation',
      currentState,
      transitionCount: context.state.transitionCount,
      stateChanged,
      anomalies: []
    };
    
    if (stateChanged) {
      transitionLog.push({
        from: lastState,
        to: currentState,
        timestamp: now,
        transitionCount: context.state.transitionCount
      });
      
      if (transitionLog.length > 100) transitionLog.shift();
      
      observation.transition = { from: lastState, to: currentState };
      
      const recentTransitions = transitionLog.filter(
        t => now - t.timestamp < rapidTransitionWindow
      );
      
      if (recentTransitions.length >= rapidTransitionThreshold) {
        const anomaly = {
          type: 'rapid_transitions',
          count: recentTransitions.length,
          window: rapidTransitionWindow,
          timestamp: now,
          message: `Rapid state changes detected: ${recentTransitions.length} transitions in ${rapidTransitionWindow}ms`
        };
        anomalies.push(anomaly);
        observation.anomalies.push(anomaly);
        
        if (anomalies.length > 20) anomalies.shift();
      }
      
      const validTransitions = getValidTransitions(lastState);
      if (!validTransitions.includes(currentState)) {
        const anomaly = {
          type: 'invalid_transition',
          from: lastState,
          to: currentState,
          timestamp: now,
          message: `Invalid transition detected: ${lastState} → ${currentState}`
        };
        anomalies.push(anomaly);
        observation.anomalies.push(anomaly);
      }
    }
    
    lastState = currentState;
    
    return observation;
  }

  function getValidTransitions(state) {
    const transitions = {
      VOID: ['ENTRY'],
      ENTRY: ['CALIBRATION'],
      CALIBRATION: ['RESONANCE', 'ENTRY'],
      RESONANCE: ['FLOW', 'CALIBRATION'],
      FLOW: ['INTEGRATION'],
      INTEGRATION: ['RESONANCE']
    };
    return transitions[state] || [];
  }

  function getAnomalies() {
    return [...anomalies];
  }

  function getTransitionLog() {
    return [...transitionLog];
  }

  function getMetrics() {
    return {
      name,
      type,
      isActive,
      transitionCount: transitionLog.length,
      anomalyCount: anomalies.length,
      lastState
    };
  }

  return {
    name,
    type,
    start,
    stop,
    observe,
    getAnomalies,
    getTransitionLog,
    getMetrics
  };
})();

if (typeof module !== 'undefined') module.exports = StateObserverAgent;
