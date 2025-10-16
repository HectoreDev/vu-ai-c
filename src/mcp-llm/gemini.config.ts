import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { tools } from "../tools/agent.tools";
import { prompts } from "../prompts/prompts";
import { it } from "node:test";

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY no encontrada en variables de entorno");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const model = ai.chats.create({
  model: "gemini-2.0-flash",
  config: {
    systemInstruction: prompts.systemInstructions,
    
  },
  history: [
    // Initial history for the chat session
    {
      role: "user",
      parts: [{ text: "Iniciando chat para buscar casa" }],
    },
  ],
});
