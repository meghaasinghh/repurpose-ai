import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

if (!GEMINI_API_KEY) {
  throw new Error("Please define the GEMINI_API_KEY environment variable inside .env.local");
}

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const GEMINI_MODEL = "gemini-2.5-flash";

export async function generateText(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return response.text;
}