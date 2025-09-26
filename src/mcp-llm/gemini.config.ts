import { Chat, GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
// import { generalTools } from "../tools/generalTools";
import { generalTools } from "../tools/agent.tools";

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY no encontrada en variables de entorno");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = 'Ayuda a encontrar una comunidad al usuario según los datos que te ha proporcionado, si no tienes suficiente información, haz preguntas adicionales para obtener más detalles sobre sus requisitos y gustos. Responde en español.';

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