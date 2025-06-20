export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt, role } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Falta el prompt' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `Eres un asistente aduanero experto para el rol: ${role}. Responde en español y de forma clara y breve.` },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    const data = await openaiRes.json();
    const response = data.choices?.[0]?.message?.content || 'No se pudo obtener respuesta de la IA.';
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con OpenAI' });
  }
} 