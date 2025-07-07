require('dotenv').config();
const OpenAI = require('openai');

(async () => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello from test script!' }],
    });
    console.log('OpenAI response:', response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI test error:', error);
  }
})();
