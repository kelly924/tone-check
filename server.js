const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const ACCESS_CODE = process.env.ACCESS_CODE || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MAX_CHARS = 4000;

if (!ANTHROPIC_API_KEY) {
  console.warn('Warning: ANTHROPIC_API_KEY is not set. /api/rewrite will fail until it is.');
}

// Tells the front end whether to show the access code field.
app.get('/api/config', (req, res) => {
  res.json({ accessCodeRequired: Boolean(ACCESS_CODE) });
});

app.post('/api/rewrite', async (req, res) => {
  const { text, accessCode } = req.body || {};

  if (ACCESS_CODE && accessCode !== ACCESS_CODE) {
    return res.status(401).json({ error: 'That access code is not correct.' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Paste in a message first.' });
  }
  if (text.length > MAX_CHARS) {
    return res.status(400).json({ error: `Keep it under ${MAX_CHARS} characters.` });
  }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        system: [
          "You rewrite workplace messages (Slack, email, texts) so they read as professional, respectful, and clear.",
          "Keep the sender's actual meaning, requests, and any factual specifics exactly intact. Don't add information, don't soften real substance or disagreement, don't apologize on the sender's behalf.",
          "Match a warm, direct, competent workplace tone. Not stiff, not corporate-speak, not overly formal.",
          "Return only the rewritten message. No preamble, no explanation, no quotation marks around it.",
        ].join(' '),
        messages: [{ role: 'user', content: text }],
      }),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error('Anthropic API error:', data);
      return res.status(502).json({ error: 'Something went wrong generating that. Try again in a moment.' });
    }

    const rewritten = (data.content || []).find((b) => b.type === 'text')?.text || '';
    res.json({ rewritten: rewritten.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on our end. Try again in a moment.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
