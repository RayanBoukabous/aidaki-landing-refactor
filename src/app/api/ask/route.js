// /src/app/api/ask/route.js
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    const response = chat.choices[0].message.content;
    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'appel à OpenAI." }),
      { status: 500 }
    );
  }
}
