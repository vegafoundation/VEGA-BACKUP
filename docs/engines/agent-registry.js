const VEGAAgentRegistry = (function() {
  const agents = new Map();
  let isRunning = false;
  let updateInterval = null;
  let listeners = [];

  function register(agentId, agent) {
    if (agents.has(agentId)) {
      console.warn(`Agent ${agentId} already registered, replacing...`);
    }
    
    agents.set(agentId, {
      id: agentId,
      name: agent.name || agentId,
      type: agent.type || 'utility',
      instance: agent,
      state: 'idle',
      lastRun: null,
      runCount: 0,
      observations: []
    });
    
    console.log(`Agent registered: ${agentId}`);
    return true;
  }

  function unregister(agentId) {
    if (agents.has(agentId)) {
      const agent = agents.get(agentId);
      if (agent.instance.stop) agent.instance.stop();
      agents.delete(agentId);
      return true;
    }
    return false;
  }

  function get(agentId) {
    return agents.get(agentId);
  }

  function getAll() {
    return Array.from(agents.values());
  }

  function startAgent(agentId) {
    const agent = agents.get(agentId);
    if (!agent) return false;
    
    if (agent.instance.start) {
      agent.instance.start();
    }
    agent.state = 'active';
    notifyListeners({ type: 'agent_started', agentId });
    return true;
  }

  function stopAgent(agentId) {
    const agent = agents.get(agentId);
    if (!agent) return false;
    
    if (agent.instance.stop) {
      agent.instance.stop();
    }
    agent.state = 'idle';
    notifyListeners({ type: 'agent_stopped', agentId });
    return true;
  }

  function runAgentCycle(agentId) {
    const agent = agents.get(agentId);
    if (!agent || !agent.instance.observe) return null;
    
    const context = buildContext();
    const observation = agent.instance.observe(context);
    
    agent.lastRun = Date.now();
    agent.runCount++;
    
    if (observation) {
      agent.observations.push({
        timestamp: Date.now(),
        data: observation
      });
      
      if (agent.observations.length > 50) {
        agent.observations.shift();
      }
      
      notifyListeners({ type: 'observation', agentId, observation });
    }
    
    return observation;
  }

  function buildContext() {
    const context = {
      timestamp: Date.now(),
      state: null,
      metrics: null,
      sonic: null,
      visual: null,
      prompts: null
    };
    
    if (typeof VEGAStateMachine !== 'undefined') {
      context.state = VEGAStateMachine.getMetrics();
    }
    if (typeof VEGAMetricsEngine !== 'undefined') {
      context.metrics = VEGAMetricsEngine.getAll();
    }
    if (typeof VEGASonicEngine !== 'undefined') {
      context.sonic = VEGASonicEngine.getMetrics();
    }
    if (typeof VEGAVisualEngine !== 'undefined') {
      context.visual = VEGAVisualEngine.getMetrics();
    }
    if (typeof VEGAPromptEngine !== 'undefined') {
      context.prompts = VEGAPromptEngine.getMetrics();
    }
    
    return context;
  }

  function startAll() {
    if (isRunning) return;
    isRunning = true;
    
    agents.forEach((agent, id) => {
      if (agent.instance.start) {
        agent.instance.start();
        agent.state = 'active';
      }
    });
    
    updateInterval = setInterval(() => {
      agents.forEach((agent, id) => {
        if (agent.state === 'active') {
          runAgentCycle(id);
        }
      });
    }, 2000);
    
    notifyListeners({ type: 'registry_started' });
    console.log('Agent Registry: All agents started');
  }

  function stopAll() {
    isRunning = false;
    
    if (updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
    
    agents.forEach((agent, id) => {
      if (agent.instance.stop) {
        agent.instance.stop();
      }
      agent.state = 'idle';
    });
    
    notifyListeners({ type: 'registry_stopped' });
    console.log('Agent Registry: All agents stopped');
  }

  function onEvent(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }

  function notifyListeners(event) {
    listeners.forEach(fn => fn(event));
  }

  function getStatus() {
    const agentList = getAll();
    return {
      isRunning,
      agentCount: agents.size,
      activeCount: agentList.filter(a => a.state === 'active').length,
      totalObservations: agentList.reduce((sum, a) => sum + a.observations.length, 0),
      agents: agentList.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        state: a.state,
        runCount: a.runCount,
        lastRun: a.lastRun
      }))
    };
  }

  return {
    register,
    unregister,
    get,
    getAll,
    startAgent,
    stopAgent,
    runAgentCycle,
    startAll,
    stopAll,
    onEvent,
    getStatus,
    buildContext
  };
})();

if (typeof module !== 'undefined') module.exports = VEGAAgentRegistry;
