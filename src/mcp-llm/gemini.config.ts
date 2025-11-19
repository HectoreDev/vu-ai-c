import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createToolSchema } from "../tools/agent.tools";
// import { prompts } from "../prompts/prompts";
import { it } from "node:test";
import { tPrompts } from "../controllers/i18n";
import { IFHistory } from "./gemini.service";
import { Lang } from "../types/types";

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY no encontrada en variables de entorno");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const createChatModel = (lang: Lang, history: IFHistory[]) => {
  // systemInstruction ya traducido vía i18next
  const systemInstruction = tPrompts("systemInstructions", lang) as string;

  const initialUserMessage =
    lang === "es"
      ? "Iniciando chat para buscar casa"
      : "Starting chat to search for a home";

  const apiHistory = [
    ...history.map((h) => ({
      role: h.role,
      parts: h.parts,
    })),
    {
      role: "user",
      parts: [{ text: initialUserMessage }],
    },
  ];

  return ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction,
     
    },
    history: apiHistory,
  });
};

// export const model = ai.chats.create({
//   model: "gemini-2.0-flash",
//   config: {
//     systemInstruction: prompts.systemInstructions,
//     tools: [
//       {
//         functionDeclarations: tools,
//       },
//     ],
//     //  responseMimeType: "application/json",
//     //  stopSequences: ["[END]"],
//   },
//   history: [
//     // Initial history for the chat session
//     {
//       role: "user",
//       parts: [{ text: "Iniciando chat para buscar casa" }],
//     },
//   ],
// });
