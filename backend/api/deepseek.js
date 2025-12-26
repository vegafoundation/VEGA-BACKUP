import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

function getClient() {
  if (!process.env.DEEPSEEK_API_KEY) {
    return null;
  }
  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY
  });
}

router.get('/status', (req, res) => {
  const hasKey = !!process.env.DEEPSEEK_API_KEY;
  res.json({
    status: hasKey ? 'ready' : 'needs_key',
    service: 'DeepSeek AI',
    model: 'deepseek-chat',
    version: '1.0.0',
    endpoints: ['/api/deepseek/status', '/api/deepseek/chat', '/api/deepseek/code']
  });
});

router.post('/chat', async (req, res) => {
  const { prompt, system } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  const client = getClient();
  if (!client) {
    return res.status(503).json({ error: 'DEEPSEEK_API_KEY not configured' });
  }
  
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: 'system', content: system || 'You are a helpful AI assistant for the VEGA Foundation. Signature: ADAM EREN VEGA – Æ –' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2048
    });
    
    res.json({
      success: true,
      response: response.choices[0].message.content,
      model: 'deepseek-chat',
      usage: response.usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/code', async (req, res) => {
  const { prompt, language } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  const client = getClient();
  if (!client) {
    return res.status(503).json({ error: 'DEEPSEEK_API_KEY not configured' });
  }
  
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-coder",
      messages: [
        { role: 'system', content: `You are DeepSeek Coder, an expert programmer. Generate clean, efficient ${language || 'code'} with comments.` },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4096
    });
    
    res.json({
      success: true,
      code: response.choices[0].message.content,
      language: language || 'auto',
      model: 'deepseek-coder',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
