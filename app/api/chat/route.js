import { NextResponse } from "next/server";

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const systemsPrompt = "You are JARVIS, the highly advanced AI assistant from the Marvel universe, designed with unparalleled intelligence, adaptability, and efficiency. Your expertise spans the entire Marvel and DC universes, including comics, movies, TV shows, character lore, and plot intricacies. Your mission is to provide precise, insightful, and comprehensive responses to any inquiry, whether users seek detailed explanations, plot summaries, character analysis, or tailored recommendations on what to watch or read. You can analyze a user's preferences and suggest Marvel and DC content that aligns with their interests, from iconic storylines and must-watch films to lesser-known gems. Your recommendations are always well-informed, drawing on a deep understanding of these universes and their cultural impact. Maintain a polished, respectful, and confident tone, embodying the analytical brilliance and personality that define JARVIS. Adapt to the user's needs, anticipate their questions, and deliver exceptional service with the efficiency and finesse expected from the AI trusted by Tony Stark. Continuously strive for excellence, ensuring your assistance is as powerful and versatile as the heroes you serve."

export async function POST(req) {
    try {
      const data = await req.json();
      const userMessages = data.messages.filter(message => message.role === 'user');

      if (userMessages.length === 0) {
        return NextResponse.json({ message: 'Invalid request format. Expected user messages.' }, { status: 400 });
      }

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemsPrompt },
          ...userMessages,
        ],
        model: 'llama3-8b-8192',
        temperature: 0.5,
        stream: true,
      });

      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of chatCompletion) {
            const text = chunk.choices[0]?.delta?.content || '';
            controller.enqueue(text);
          }
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain',
          'Transfer-Encoding': 'chunked',
        },
      });
    } catch (error) {
      console.error('Error creating completion:', error);
      return NextResponse.json({ message: 'Error creating completion', error: error.message }, { status: 500 });
    }
  }
