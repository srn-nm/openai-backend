const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = "1234567redjksandfjkdfsasdf234";

app.use(express.json());

app.post('/openai', async (req, res) => {
    const { question, dataset } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Missing 'question' in request body" });
    }

    const prompt = `You are a Data Analyst that gives short answer questions about data.\n Question:${question}\n Dataset: ${dataset}\n\n Answer:`;

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 50,
                n: 1,
                stop: null,
                temperature: 0.5
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data });
        }

        res.json({ answer: data.choices[0].text.trim() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message ?? error.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
