import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const router = Router();

const anthropic = new Anthropic();
const openai = new OpenAI();

const orchestrationState = {
  active: false,
  currentTask: null,
  lastResponse: null,
  aiStatus: {
    openai: 'ready',
    anthropic: 'ready',
    xai: 'ready',
    deepseek: 'ready',
    suno: 'ready'
  }
};

router.get('/status', (req, res) => {
  res.json({
    status: 'ready',
    orchestration: orchestrationState,
    availableAIs: ['OpenAI GPT-4', 'Anthropic Claude', 'XAI Grok', 'DeepSeek', 'Suno AI'],
    configured: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      xai: !!process.env.xAI_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      suno: !!process.env.SUNO_API_KEY
    }
  });
});

router.post('/query', async (req, res) => {
  const { prompt, mode = 'auto' } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  orchestrationState.active = true;
  orchestrationState.currentTask = prompt;
  
  const responses = {};
  const errors = {};
  
  try {
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are part of the VEGA AI Orchestra. Provide concise, helpful responses.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500
        });
        responses.openai = openaiResponse.choices[0].message.content;
        orchestrationState.aiStatus.openai = 'active';
      } catch (e) {
        errors.openai = e.message;
        orchestrationState.aiStatus.openai = 'error';
      }
    }
    
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const claudeResponse = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [
            { role: 'user', content: `[VEGA Orchestra] ${prompt}` }
          ]
        });
        responses.anthropic = claudeResponse.content[0].text;
        orchestrationState.aiStatus.anthropic = 'active';
      } catch (e) {
        errors.anthropic = e.message;
        orchestrationState.aiStatus.anthropic = 'error';
      }
    }
    
    if (process.env.xAI_API_KEY) {
      try {
        const xaiClient = new OpenAI({
          apiKey: process.env.xAI_API_KEY,
          baseURL: 'https://api.x.ai/v1'
        });
        const grokResponse = await xaiClient.chat.completions.create({
          model: 'grok-2-1212',
          messages: [
            { role: 'system', content: 'You are Grok, part of the VEGA AI Orchestra.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500
        });
        responses.xai = grokResponse.choices[0].message.content;
        orchestrationState.aiStatus.xai = 'active';
      } catch (e) {
        errors.xai = e.message;
        orchestrationState.aiStatus.xai = 'error';
      }
    }
    
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const deepseekClient = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: 'https://api.deepseek.com/v1'
        });
        const deepseekResponse = await deepseekClient.chat.completions.create({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are DeepSeek, part of the VEGA AI Orchestra.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 500
        });
        responses.deepseek = deepseekResponse.choices[0].message.content;
        orchestrationState.aiStatus.deepseek = 'active';
      } catch (e) {
        errors.deepseek = e.message;
        orchestrationState.aiStatus.deepseek = 'error';
      }
    }
    
    let synthesized = '';
    const responseCount = Object.keys(responses).length;
    if (responseCount > 0) {
      synthesized = `[VEGA Orchestra - ${responseCount} AI(s) responded]\n\n`;
      for (const [ai, response] of Object.entries(responses)) {
        synthesized += `--- ${ai.toUpperCase()} ---\n${response}\n\n`;
      }
    } else {
      synthesized = 'No AI services responded. Please check API configurations.';
    }
    
    orchestrationState.lastResponse = synthesized;
    orchestrationState.active = false;
    
    res.json({
      success: true,
      responses,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      synthesized,
      aiCount: responseCount
    });
    
  } catch (e) {
    orchestrationState.active = false;
    res.status(500).json({ error: e.message });
  }
});

router.post('/synthesize', async (req, res) => {
  const { topic } = req.body;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic required' });
  }
  
  const prompts = {
    openai: `Analyze "${topic}" from a technical perspective. Be concise.`,
    anthropic: `Provide philosophical insights on "${topic}". Be concise.`,
    xai: `Give a unique, unconventional take on "${topic}". Be concise.`,
    deepseek: `Provide a deep analytical view of "${topic}". Be concise.`
  };
  
  const responses = {};
  
  for (const [ai, prompt] of Object.entries(prompts)) {
    try {
      if (ai === 'openai' && process.env.OPENAI_API_KEY) {
        const resp = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        });
        responses[ai] = resp.choices[0].message.content;
      } else if (ai === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        const resp = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{ role: 'user', content: prompt }]
        });
        responses[ai] = resp.content[0].text;
      } else if (ai === 'xai' && process.env.xAI_API_KEY) {
        const xaiClient = new OpenAI({
          apiKey: process.env.xAI_API_KEY,
          baseURL: 'https://api.x.ai/v1'
        });
        const resp = await xaiClient.chat.completions.create({
          model: 'grok-2-1212',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        });
        responses[ai] = resp.choices[0].message.content;
      } else if (ai === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
        const deepseekClient = new OpenAI({
          apiKey: process.env.DEEPSEEK_API_KEY,
          baseURL: 'https://api.deepseek.com/v1'
        });
        const resp = await deepseekClient.chat.completions.create({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300
        });
        responses[ai] = resp.choices[0].message.content;
      }
    } catch (e) {
      responses[ai] = `Error: ${e.message}`;
    }
  }
  
  let synthesis = `# VEGA Orchestra Synthesis: ${topic}\n\n`;
  for (const [ai, response] of Object.entries(responses)) {
    synthesis += `## ${ai.toUpperCase()} Perspective\n${response}\n\n`;
  }
  
  res.json({
    success: true,
    topic,
    responses,
    synthesis
  });
});

export default router;
