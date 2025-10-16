import { model } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { Part, Type } from "@google/genai";
import { prompts } from "../prompts/prompts";
import { tools, toolsNames } from "../tools/agent.tools";
import { invalidateSession } from "./mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";
import { sessionStore } from "../store/zustandStore";
import type { SessionState } from "./types/gemini.types";
import { FunctionCallingConfigMode } from "@google/genai";

interface IFHistory {
  role: "user" | "model";
  parts: Part[];
}

export class GeminiService {
  async chatWithTools(
    message: string,
    history: IFHistory[],
    sessionId?: number
  ) {
    const response1 = await model.sendMessage({
      message: message,
      config: {
        tools: [
          {
            functionDeclarations: tools,
          },
        ],
      },
    });

    history.push({
      role: "user",
      parts: [{ text: message }],
    });

    // console.log('text response', response1.candidates?.[0]?.content?.parts);
    // console.log('functionCalls', response1.functionCalls);

    const toolsCall = response1.candidates?.[0]?.content?.parts || [];
    // console.log('toolsCall', toolsCall.length);

    if (response1.functionCalls && response1.functionCalls.length > 0) {
      const mcpResult = await mcpServer.callTools(toolsCall);
      console.log("Resultados de herramientas:", mcpResult);

      console.log("Prompt", mcpResult.systemInstruction);

      const resultMCP = await model.sendMessage({
        message: JSON.stringify(mcpResult.data) || {},
        config: {
          systemInstruction: mcpResult.systemInstruction,
        },
      });

      history.push({
        role: "model",
        parts: resultMCP.candidates?.[0]?.content?.parts || [],
      });

      return {
        history,
        message: resultMCP.candidates?.[0]?.content?.parts || [],
        sessionId: mcpResult.sessionId,
      };
    } else {
      const results = sessionStore.getState().suggest();
      const { communities } = sessionStore.getState();

      const systemInstruction = `INSTRUCCIONES (NO MOSTRAR):
    - sugerencia de tool para proxima pregunta: ${results?.nextTool}.
    - Falta este dato este es el suggest: ${JSON.stringify(results.suggestion)}.
    - Pregunta SOLO por ese dato, tono cordial y por su nombre o amigo.
    - PROHIBIDO inventar, solo formular pregunta que este asociada con el suggest.
    - ${
      communities && communities.length > 0
        ? "Sugiere las comunidades que mejor se adapten al usuario pero siempre sigue preguntando hasta tener todos los datos necesarios para encontrar la mejor comunidad acorde a las necesidades del usuario."
        : "Sigue preguntando hasta tener todos los datos necesarios para encontrar la mejor comunidad acorde a las necesidades del usuario."
    }`;

      const response2 = await model.sendMessage({
        message: message,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      history.push({
        role: "model",
        parts: response2.candidates?.[0]?.content?.parts
          ? response2.candidates?.[0]?.content?.parts
          : [{ text: "" }],
      });

      return {
        history,
        message: response2.candidates?.[0]?.content?.parts,
        sessionId: null,
      };
    }
  }
}

export const geminiService = new GeminiService();
