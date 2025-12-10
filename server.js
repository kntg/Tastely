const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('public'));

app.use(express.json());

const PROJECT_ID = 'midyear-castle-458914-u7';
const LOCATION = 'us-central1';

app.post('/generate', async (req, res) => {
  try {
    const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-001',
    });

    const userPrompt = req.body.prompt || "Give me a fun fact about turtles.";

    const response = await generativeModel.generateContent(userPrompt);
    const content = await response.response;

    const text = content?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    res.json({ result: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});