/**
 * Æ Agent Initialization
 * VEGA Foundation v2
 * Signature: ADAM EREN VEGA – Æ –
 */

const { AEAgent } = require('./ae_agent');

const AGENTS_CONFIG = [
  { name: 'ae_agent', displayName: 'Æ Agent', description: 'Primary autonomous intelligence orchestrator' },
  { name: 'biolab', displayName: 'BioLab', description: 'Bio-monitoring & wellness research systems' },
  { name: 'creative_hub', displayName: 'Creative Hub', description: 'Generative AI & artistic synthesis engine' },
  { name: 'finance_core', displayName: 'Finance Core', description: 'Quantum-inspired financial modeling' },
  { name: 'health_monitor', displayName: 'Health Monitor', description: 'Real-time health analytics & optimization' },
  { name: 'playbox', displayName: 'Playbox', description: 'Experimental sandbox & prototyping environment' },
  { name: 'atlas', displayName: 'Atlas', description: 'Navigation & spatial intelligence systems' }
];

function initializeAgents() {
  console.log('[VEGA] Initializing agents...');
  
  const agents = AGENTS_CONFIG.map(config => ({
    name: config.name,
    state: 'active',
    description: config.description
  }));
  
  console.log(`[VEGA] ${agents.length} agents initialized`);
  return agents;
}

function getAgentsConfig() {
  return AGENTS_CONFIG;
}

async function updateAgentsState(apiEndpoint) {
  try {
    const agents = initializeAgents();
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agents })
    });
    return await response.json();
  } catch (error) {
    console.error('[VEGA] Agent update error:', error);
    return null;
  }
}

module.exports = {
  AEAgent,
  AGENTS_CONFIG,
  initializeAgents,
  getAgentsConfig,
  updateAgentsState
};
