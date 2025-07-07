require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

const app = express();
const prisma = new PrismaClient();
<<<<<<< HEAD
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
=======
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const authRoutes = require('./routes/authRoutes');
>>>>>>> d88f2ff (Final save before rest)

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

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
    const filePath = path.join(__dirname, 'datasets', 'celebs.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const celebs = JSON.parse(data);

    // Add ids to each celeb
    const celebsWithIds = celebs.map((celeb, index) => ({
      id: index + 1,
      name: celeb.name,
      prompt: celeb.chatPersona || `Talk like ${celeb.name}`,
      icon: celeb.icon || null,
    }));

    res.json(celebsWithIds);
  } catch (error) {
<<<<<<< HEAD
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
=======
    console.error("Error reading celeb dataset:", error);
    res.status(500).json({ error: 'Failed to read celeb data' });
  }
});

>>>>>>> d88f2ff (Final save before rest)

app.post('/api/chat/:celebId', async (req, res) => {
  const { celebId } = req.params;
  const { message } = req.body;

  try {
    // Read the full celeb list from JSON
    const filePath = path.join(__dirname, 'datasets', 'celebs.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const celebs = JSON.parse(data);

    const celeb = celebs[Number(celebId) - 1]; // IDs are 1-based index

    if (!celeb) return res.status(404).json({ error: 'Celebrity not found' });

<<<<<<< HEAD
    const dataset = getDatasetForCeleb(celeb.name);
=======
    const systemPrompt = celeb.chatPersona || `Talk like ${celeb.name}`;
>>>>>>> d88f2ff (Final save before rest)

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
<<<<<<< HEAD
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to process chat with AI' });
=======
    console.error("Gemini Error:", error.message || error);
    res.status(500).json({ error: 'Failed to chat with Gemini' });
  }
});


app.post('/api/test', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const result = await model.generateContent("Hello, who are you?");
    const response = await result.response.text();

    res.json({ reply: response });
  } catch (error) {
    console.error("Gemini Test Error:", error.message || error);
    res.status(500).json({ error: 'Gemini test failed' });
  }
});


app.get('/api/test-db', async (req, res) => {
  try {
    const celebs = await prisma.celebrity.findMany();
    res.json({ success: true, data: celebs });
  } catch (error) {
    console.error("DB Test Error:", error);
    res.status(500).json({ success: false, error: error.message });
>>>>>>> d88f2ff (Final save before rest)
  }
});

app.get('/', (req, res) => {
  res.send('✅ Backend is running. Use /api/celebs, /api/celebs/file, or /api/chat/:celebId');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
