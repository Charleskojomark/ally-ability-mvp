import { Router, Request, Response } from 'express';

export const chatRouter: Router = Router();

const SYSTEM_PROMPT = `You are Ally, an empathetic, accessible educational assistant for the Ally-Ability Network. 
You support women and persons with disabilities to learn tech and vocational skills. 
You always speak naturally in English, but if the user uses Nigerian/West African Pidgin, you seamlessly switch to warm, encouraging Nigerian Pidgin English. 
Keep your answers concise, clear, and highly focused on learning. Avoid complex jargon. Be highly encouraging.`;

// POST /v1/chat/message
// Accepts an array of messages and returns the assistant's reply using Groq (LLaMA 3).
chatRouter.post('/message', async (req: Request, res: Response) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Valid messages array is required.' });
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            console.warn('GROQ_API_KEY not defined');
            return res.status(503).json({ error: 'AI Assistant is currently unavailable.' });
        }

        // Inject system prompt at the very beginning
        const payloadMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Using reliable, fast, free LLaMA 3 8B
                messages: payloadMessages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', errorText);
            return res.status(response.status).json({ error: 'Failed to communicate with AI provider.' });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await response.json() as any;
        const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that right now.";

        return res.status(200).json({ reply });

    } catch (error) {
        console.error('Chat Assistant POST Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
