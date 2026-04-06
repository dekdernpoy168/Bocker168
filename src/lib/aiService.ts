import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

export async function generateAIContent(prompt: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;

  // Try Gemini first
  if (geminiKey) {
    try {
      console.log("Attempting to generate content with Gemini...");
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      if (response.text) {
        console.log("Gemini generation successful.");
        return response.text;
      }
    } catch (error) {
      console.error("Gemini failed, trying ChatGPT fallback:", error);
    }
  } else {
    console.warn("GEMINI_API_KEY not found, skipping to ChatGPT.");
  }

  // Fallback to ChatGPT
  if (openAIKey) {
    try {
      console.log("Attempting to generate content with ChatGPT...");
      const openai = new OpenAI({
        apiKey: openAIKey,
        dangerouslyAllowBrowser: true // Since we are calling from frontend
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        console.log("ChatGPT generation successful.");
        return content;
      }
    } catch (error) {
      console.error("ChatGPT also failed:", error);
      throw new Error("Both Gemini and ChatGPT failed to generate content.");
    }
  } else {
    console.error("Neither Gemini nor OpenAI API keys are available.");
    throw new Error("API keys for Gemini or OpenAI are missing.");
  }

  throw new Error("Failed to generate content from any AI provider.");
}
