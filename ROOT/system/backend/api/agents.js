import express from 'express';
const router = express.Router();

let timeCrystalLoader = null;
let timeCrystalSaver = null;

function init(loader, saver) {
  timeCrystalLoader = loader;
  timeCrystalSaver = saver;
}

router.get('/', async (req, res) => {
  try {
    const data = await timeCrystalLoader();
    if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
    res.json(data.agents || []);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:name', async (req, res) => {
  try {
    const data = await timeCrystalLoader();
    if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
    
    const agents = data.agents || [];
    const agent = agents.find(a => a.name === req.params.name);
    
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const data = await timeCrystalLoader();
    if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
    
    data.agents = req.body.agents || data.agents;
    await timeCrystalSaver(data);
    
    res.json({ success: true, agents: data.agents });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/:name/activate', async (req, res) => {
  try {
    const data = await timeCrystalLoader();
    if (!data) return res.status(500).json({ error: 'Time Crystal not found' });
    
    const agents = data.agents || [];
    const agent = agents.find(a => a.name === req.params.name);
    
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    
    agent.state = 'active';
    await timeCrystalSaver(data);
    
    res.json({ success: true, agent });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router, init };
