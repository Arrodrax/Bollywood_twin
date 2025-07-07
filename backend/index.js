require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

function getDatasetForCeleb(name) {
  const filePath = path.join(__dirname, 'datasets', `${name.toLowerCase().replace(/ /g, '_')}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return null;
}

app.get('/api/celebs', async (req, res) => {
  try {
    const celebs = await prisma.celebrity.findMany();
    res.json(celebs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch celebrities from DB' });
  }
});

app.get('/api/celebs/file', (req, res) => {
  const dataPath = path.join(__dirname, 'datasets', 'celebs.json');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error (file read)' });
    }
    try {
      const celebs = JSON.parse(data);
      res.json(celebs);
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

app.post('/api/chat/:celebId', async (req, res) => {
  const { celebId } = req.params;
  const { message } = req.body;

  try {
    const celeb = await prisma.celebrity.findUnique({ where: { id: Number(celebId) } });
    if (!celeb) return res.status(404).json({ error: 'Celebrity not found' });

    const dataset = getDatasetForCeleb(celeb.name);

    const messages = [
      { role: 'system', content: celeb.prompt || `You are now acting as ${celeb.name}.` }
    ];

    if (dataset?.typicalPhrases) {
      messages.push({ role: 'system', content: `Use phrases: ${dataset.typicalPhrases.join(', ')}` });
    }

    messages.push({ role: 'user', content: message });

    console.log('OpenAI chat messages:', messages);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    });

    const aiReply = completion.choices[0].message.content;
    res.json({ reply: aiReply });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to process chat with AI' });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running. Use /api/celebs, /api/celebs/file, or /api/chat/:celebId');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
