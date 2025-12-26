import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const router = Router();

const anthropic = new Anthropic();
const openai = new OpenAI();

const redblooodState = {
  active: false,
  iteration: 0,
  lastVisual: null,
  lastMusic: null,
  phase: 3,
  subdomains: [
    'vega.foundation',
    'music.vega.foundation',
    'visuals.vega.foundation',
    'portfolio.vega.foundation',
    'admin.vega.foundation'
  ]
};

router.get('/status', (req, res) => {
  res.json({
    name: 'RedBlood-Agent Godmaster',
    version: '1.0',
    mode: 'Full Orchestration',
    status: redblooodState.active ? 'running' : 'ready',
    iteration: redblooodState.iteration,
    phase: redblooodState.phase,
    subdomains: redblooodState.subdomains,
    apis: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      xai: !!process.env.xAI_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      suno: !!process.env.SUNO_API_KEY
    }
  });
});

router.post('/generate-visual', async (req, res) => {
  const { theme = 'cosmic ambient vega soundscape' } = req.body;
  
  try {
    redblooodState.active = true;
    
    let visualDescription = '';
    
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Create a vivid visual soundscape description for: "${theme}". 
          Include: colors, shapes, movement, atmosphere, cosmic elements.
          Make it immersive and synesthetic. Keep under 200 words.`
        }]
      });
      visualDescription = response.content[0].text;
    } else if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Create a vivid visual soundscape description for: "${theme}". 
          Include: colors, shapes, movement, atmosphere, cosmic elements.
          Make it immersive and synesthetic. Keep under 200 words.`
        }],
        max_tokens: 500
      });
      visualDescription = response.choices[0].message.content;
    }
    
    redblooodState.lastVisual = {
      theme,
      description: visualDescription,
      timestamp: new Date().toISOString()
    };
    redblooodState.iteration++;
    redblooodState.active = false;
    
    res.json({
      success: true,
      visual: redblooodState.lastVisual,
      iteration: redblooodState.iteration
    });
    
  } catch (e) {
    redblooodState.active = false;
    res.status(500).json({ error: e.message });
  }
});

router.post('/generate-music-prompt', async (req, res) => {
  const { style = 'cosmic ambient' } = req.body;
  
  try {
    let musicPrompt = '';
    
    if (process.env.xAI_API_KEY) {
      const xaiClient = new OpenAI({
        apiKey: process.env.xAI_API_KEY,
        baseURL: 'https://api.x.ai/v1'
      });
      const response = await xaiClient.chat.completions.create({
        model: 'grok-2-1212',
        messages: [{
          role: 'user',
          content: `Create a Suno AI music prompt for a ${style} track.
          Include: genre, mood, instruments, tempo, vocal style (or instrumental).
          Format for Suno API. Keep concise.`
        }],
        max_tokens: 300
      });
      musicPrompt = response.choices[0].message.content;
    } else if (process.env.OPENAI_API_KEY) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Create a Suno AI music prompt for a ${style} track.
          Include: genre, mood, instruments, tempo, vocal style (or instrumental).
          Format for Suno API. Keep concise.`
        }],
        max_tokens: 300
      });
      musicPrompt = response.choices[0].message.content;
    }
    
    redblooodState.lastMusic = {
      style,
      prompt: musicPrompt,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      musicPrompt: redblooodState.lastMusic
    });
    
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/infinity-cycle', async (req, res) => {
  const phases = [3, 5, 8];
  const currentIdx = phases.indexOf(redblooodState.phase);
  redblooodState.phase = phases[(currentIdx + 1) % phases.length];
  redblooodState.iteration++;
  
  const tasks = [];
  
  if (process.env.OPENAI_API_KEY) {
    tasks.push(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: 'You are the VEGA Infinity Loop Oracle. Provide a brief cosmic insight.'
        }, {
          role: 'user',
          content: `Phase ${redblooodState.phase} insight for iteration ${redblooodState.iteration}`
        }],
        max_tokens: 100
      }).then(r => ({ source: 'openai', insight: r.choices[0].message.content }))
        .catch(e => ({ source: 'openai', error: e.message }))
    );
  }
  
  if (process.env.ANTHROPIC_API_KEY) {
    tasks.push(
      anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `VEGA Phase ${redblooodState.phase}, iteration ${redblooodState.iteration}. One-line cosmic resonance update.`
        }]
      }).then(r => ({ source: 'anthropic', insight: r.content[0].text }))
        .catch(e => ({ source: 'anthropic', error: e.message }))
    );
  }
  
  const results = await Promise.all(tasks);
  
  res.json({
    success: true,
    phase: redblooodState.phase,
    iteration: redblooodState.iteration,
    insights: results,
    timestamp: new Date().toISOString()
  });
});

router.get('/subdomains', (req, res) => {
  res.json({
    subdomains: redblooodState.subdomains,
    status: redblooodState.subdomains.map(s => ({ domain: s, status: 'configured' }))
  });
});

export default router;
