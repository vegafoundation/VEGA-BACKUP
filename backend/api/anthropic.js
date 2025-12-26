import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

const DEFAULT_MODEL = "claude-sonnet-4-20250514";

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

router.get('/status', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    status: hasKey ? 'ready' : 'needs_key',
    service: 'Anthropic Claude',
    model: DEFAULT_MODEL,
    version: '1.0.0',
    endpoints: ['/api/anthropic/status', '/api/anthropic/chat', '/api/anthropic/analyze']
  });
});

router.post('/chat', async (req, res) => {
  const { prompt, system } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  const client = getClient();
  if (!client) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }
  
  try {
    const message = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 2048,
      system: system || 'You are a helpful AI assistant for the VEGA Foundation. Signature: ADAM EREN VEGA – Æ –',
      messages: [{ role: 'user', content: prompt }]
    });
    
    res.json({
      success: true,
      response: message.content[0].text,
      model: DEFAULT_MODEL,
      usage: message.usage,
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
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }
  
  try {
    const systemPrompt = type === 'sentiment' 
      ? 'Analyze sentiment and respond with JSON: {"sentiment": "positive/negative/neutral", "confidence": 0-1, "summary": "brief explanation"}'
      : 'Analyze the following text thoroughly and provide insights.';
    
    const message = await client.messages.create({
      model: DEFAULT_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: text }]
    });
    
    res.json({
      success: true,
      analysis: message.content[0].text,
      type: type || 'general',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
