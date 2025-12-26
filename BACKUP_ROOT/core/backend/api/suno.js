import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
  const hasKey = !!process.env.SUNO_API_KEY;
  res.json({
    status: hasKey ? 'ready' : 'needs_key',
    service: 'Suno AI Music',
    version: '1.0.0',
    description: 'AI-powered music generation',
    endpoints: ['/api/suno/status', '/api/suno/generate', '/api/suno/tracks']
  });
});

router.post('/generate', async (req, res) => {
  const { prompt, style, duration } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  if (!process.env.SUNO_API_KEY) {
    return res.status(503).json({ error: 'SUNO_API_KEY not configured' });
  }
  
  try {
    const response = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        style: style || 'electronic ambient',
        duration: duration || 30
      })
    });
    
    if (!response.ok) {
      throw new Error(`Suno API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({
      success: true,
      track: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tracks', async (req, res) => {
  if (!process.env.SUNO_API_KEY) {
    return res.json({
      success: true,
      tracks: [],
      note: 'SUNO_API_KEY not configured - showing placeholder'
    });
  }
  
  try {
    const response = await fetch('https://api.suno.ai/v1/tracks', {
      headers: {
        'Authorization': `Bearer ${process.env.SUNO_API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Suno API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json({
      success: true,
      tracks: data.tracks || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
