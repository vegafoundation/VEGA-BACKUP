import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handlePrompt(prompt, memory) {
  const systemMessage = `You are the Vega Infinity Loop AI Assistant. 
You are part of the VEGA.foundation autonomous meta-system.
Signature: ADAM EREN VEGA – Æ –

Current memory context: ${JSON.stringify(memory)}

Respond helpfully while maintaining the Vega aesthetic and philosophy.`;

  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: prompt }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 1000,
    temperature: 0.7
  });

  return response.choices[0].message.content;
}
