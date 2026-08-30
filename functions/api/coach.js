const MODEL = '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

function clean(value, max = 600) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function extractJson(text) {
  const raw = String(text || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch (_) { return null; }
}

function fallbackCoach({ language, answer, natural }) {
  return {
    provider: 'local-fallback',
    natural: answer,
    note: `DeepSeek did not return a usable response yet. Compare your sentence with the phrase meaning: ${natural}.`,
    alternatives: [
      `Keep it short and direct in ${language}.`,
      'Match the register of the phrase before adding personality.',
      'Say it out loud once before saving it.'
    ]
  };
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch (_) { return json({ error: 'Invalid JSON.' }, 400); }

  const payload = {
    language: clean(body.language, 80),
    phrase: clean(body.phrase, 220),
    natural: clean(body.natural, 260),
    prompt: clean(body.prompt, 260),
    answer: clean(body.answer, 700)
  };

  if (!payload.answer) return json({ error: 'Write a reply before asking DeepSeek to improve it.' }, 400);

  const system = [
    'You are a compact language coach for a daily practice web app.',
    'Improve the learner reply into a natural native-feeling phrase.',
    'Do not over-explain. Do not invent a long lesson.',
    'Return only JSON with keys: natural, note, alternatives.',
    'alternatives must be an array of 2 or 3 short useful variants or tips.',
    'Keep register safety clear. If the learner answer is not in the target language, give a simple target-language version.'
  ].join(' ');

  const user = [
    `Target language: ${payload.language}`,
    `Practice phrase: ${payload.phrase}`,
    `Natural meaning: ${payload.natural}`,
    `Prompt: ${payload.prompt}`,
    `Learner reply: ${payload.answer}`
  ].join('\n');

  try {
    if (env.AI) {
      const result = await env.AI.run(MODEL, {
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        max_tokens: 1200
      });
      const text = result.response || result.text || JSON.stringify(result);
      const parsed = extractJson(text);
      if (parsed && parsed.natural) return json({ provider: 'deepseek-workers-ai', ...parsed });
    }
  } catch (error) {
    return json({ ...fallbackCoach(payload), note: `DeepSeek Workers AI was reached but did not complete cleanly. ${fallbackCoach(payload).note}` });
  }

  return json(fallbackCoach(payload));
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
