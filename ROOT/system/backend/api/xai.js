import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

function getClient() {
  if (!process.env.XAI_API_KEY) {
    return null;
  }
  return new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: process.env.XAI_API_KEY
  });
}

router.get('/status', (req, res) => {
  const hasKey = !!process.env.XAI_API_KEY;
  res.json({
    status: hasKey ? 'ready' : 'needs_key',
    service: 'xAI Grok',
    model: 'grok-2-1212',
    version: '1.0.0',
    endpoints: ['/api/xai/status', '/api/xai/chat', '/api/xai/analyze']
  });
});

router.post('/chat', async (req, res) => {
  const { prompt, system } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  const client = getClient();
  if (!client) {
    return res.status(503).json({ error: 'XAI_API_KEY not configured' });
  }
  
  try {
    const response = await client.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        { role: 'system', content: system || 'You are Grok, an AI assistant for the VEGA Foundation. Signature: ADAM EREN VEGA – Æ –' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048
    });
    
    res.json({
      success: true,
      response: response.choices[0].message.content,
      model: 'grok-2-1212',
      usage: response.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze', async (req, res) => {
  const { text, type } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text required' });
  }
  
  const client = getClient();
  if (!client) {
    return res.status(503).json({ error: 'XAI_API_KEY not configured' });
  }
  
  try {
    const response = await client.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        { 
          role: 'system', 
          content: type === 'sentiment' 
            ? 'Analyze sentiment. Return JSON: {"sentiment": "positive/negative/neutral", "confidence": 0-1, "summary": "explanation"}'
            : 'Analyze thoroughly and provide insights.'
        },
        { role: 'user', content: text }
      ],
      max_tokens: 1024,
      response_format: type === 'sentiment' ? { type: "json_object" } : undefined
    });
    
    res.json({
      success: true,
      analysis: response.choices[0].message.content,
      type: type || 'general',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
