require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const prisma = new PrismaClient();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const authRoutes = require('./routes/authRoutes');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Utility to fetch celeb-specific dataset file if exists
function getDatasetForCeleb(name) {
  const filePath = path.join(__dirname, 'datasets', `${name.toLowerCase().replace(/ /g, '_')}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }
  return null;
}

// Get all celebs
app.get('/api/celebs', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'datasets', 'celebs.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const celebs = JSON.parse(data);

    const celebsWithIds = celebs.map((celeb, index) => ({
      id: index + 1,
      name: celeb.name,
      prompt: celeb.chatPersona || `Talk like ${celeb.name}`,
      icon: celeb.icon || null,
    }));

    res.json(celebsWithIds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch celebrities from DB' });
  }
});

// Fallback JSON file
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

// POST: Chat with celeb using Gemini API
app.post('/api/chat/:celebId', async (req, res) => {
  const { celebId } = req.params;
  const { message } = req.body;

  try {
    const filePath = path.join(__dirname, 'datasets', 'celebs.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const celebs = JSON.parse(data);

    const celeb = celebs[Number(celebId) - 1];

    if (!celeb) return res.status(404).json({ error: 'Celebrity not found' });

    const prompt = celeb.prompt || `Talk like ${celeb.name}`;
    const userPrompt = `${prompt}\n\nUser: ${message}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ error: 'Failed to process chat with AI' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
