
import OpenAI from "openai";
import { ChatMessage } from "../types";

export async function getChatResponse(
  context: string,
  messages: ChatMessage[],
  aiPersona: string,
): Promise<string> {

  // 1. UNIVERSAL API KEY EXTRACTION
  let apiKey = "";
  try {
    // This method is for Vite environments
    apiKey = (import.meta as any).env.VITE_CEREBRAS_API_KEY || "";
  } catch (e) {
    // This will fail in a non-Vite environment, which is fine.
  }

  if (!apiKey && typeof process !== "undefined") {
    // This is for Node.js environments
    apiKey = process.env.CEREBRAS_API_KEY || "";
  }
  
  if (!apiKey) {
    // Fallback if no environment variable is found
    apiKey = ""; 
  }

  if (!apiKey) {
    throw new Error("Cerebras API Key is missing. Please set it in your environment variables (e.g., VITE_CEREBRAS_API_KEY in a .env file).");
  }

  // 2. INITIALIZE CLIENT
  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.cerebras.ai/v1",
    dangerouslyAllowBrowser: true 
  });

  const systemInstruction = `${aiPersona}. Your goal is to answer questions and discuss topics based *only* on the provided study materials. Do not use any external knowledge. If the answer is not in the materials, say "I can't find that information in the study materials." Be friendly and encouraging.

Here are the study materials:
---
${context}
---
`;

  const openaiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
  }));

  try {
    const response = await client.chat.completions.create({
      model: "gpt-oss-120b", 
      messages: [
        { role: "system", content: systemInstruction },
        ...openaiMessages,
      ],
      temperature: 0.6,
      max_tokens: 1024,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) throw new Error("Received an empty response from the Cerebras API.");

    return resultText;

  } catch (error: any) {
    console.error("Cerebras API Error:", error);
    if (error.status === 404) {
       throw new Error(`Model not found (404). 'llama-3.3-70b' or 'llama3.1-8b' are the currently supported model IDs.`);
    }
    // Re-throw with a more user-friendly message
    throw new Error(error.message || "An unknown error occurred while contacting the Cerebras API.");
  }
}
