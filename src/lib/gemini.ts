import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

if (!GEMINI_API_KEY) {
  throw new Error("Please define the GEMINI_API_KEY environment variable inside .env.local");
}

export const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const GEMINI_MODEL = "gemini-2.5-flash";

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("503") || message.includes("UNAVAILABLE") || message.includes("overloaded");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateText(prompt: string, maxRetries = 3): Promise<string> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response");
      }

      return response.text;
    } catch (error) {
      lastError = error;

      if (isRetryableError(error) && attempt < maxRetries) {
        const backoffMs = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
        console.warn(
          `Gemini overloaded (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${backoffMs}ms...`
        );
        await sleep(backoffMs);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}