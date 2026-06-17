require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('WARNING: OPENAI_API_KEY is not set. Set it in a .env file before running the server.');
}

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant embedded in a hacking guide website. Answer in Indonesian unless the user asks in another language.' },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 300
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'Maaf, AI tidak dapat membuat jawaban sekarang.';
    res.json({ reply });
  } catch (error) {
    console.error('AI backend error:', error);
    res.status(500).json({ error: 'Gagal menghubungi layanan AI.' });
  }
});

app.listen(port, () => {
  console.log(`AI backend listening at http://localhost:${port}`);
});
