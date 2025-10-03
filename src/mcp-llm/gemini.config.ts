import { Chat, GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { generalTools } from "../tools/generalTools";
import { tools } from "../tools/agent.tools";

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY no encontrada en variables de entorno");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = 'Eres un asistente útil que ayuda a los usuarios a encontrar casas basándote en sus necesidades y preferencias. Utiliza las herramientas proporcionadas para obtener información específica como el nombre del usuario, la ubicación, el presupuesto y las amenidades deseadas.';

export const model = ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
        systemInstruction: `${systemInstruction}`,
        tools: [
            {
                // @ts-ignore
                functionDeclarations: generalTools.tools
            }
        ],
    },
    history: [ // Initial history for the chat session
        {
            role: "user",
            parts: [{ text: "Iniciando chat para buscar casa" }],
        }
    ],
}); 