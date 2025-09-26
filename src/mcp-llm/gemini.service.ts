import { model } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { invalidateSession } from "./mcp.tools";
import { generalTools } from "../tools/generalTools";
import { SchemaType } from "@google/generative-ai";
import { useSessionStore } from "../store/zustandStore";
import { SessionHelper } from "../store/helper";
import type { SessionState } from "./types/gemini.types";
import { FunctionCallingConfigMode } from "@google/genai";
import { getName } from "../controllers/get-name.controller";

export class GeminiService {

	async chatWithTools(message: string, sessionId?: number) {

		const contextPrompt = 'quiero una receta de cocina con pollo y arroz';

		console.log('Generando respuesta contextual con Gemini...2');
		// @ts-ignore
		const response1 = await model.sendMessage({
      message: contextPrompt,
      config: {
        tools: [
          {
						// @ts-ignore
            functionDeclarations: generalTools.tools
          },
        ],
        toolConfig: {
          functionCallingConfig: {
            // Force the model to call the specified function
            mode: FunctionCallingConfigMode.ANY,
            // Specify the exact tool name to force
            allowedFunctionNames: generalTools.listTools
          }
        }
      }
    });

		console.log('text response', response1.candidates?.[0]?.content?.parts)

		console.log('tool', response1?.candidates?.[0]?.content?.parts?.[0]?.functionCall )
		const toolCall = response1?.candidates?.[0]?.content?.parts?.[0]?.functionCall;
		
		// const functionCalls = response1 && response1.functionCalls() ? response1.functionCalls() : [];

		if (toolCall) {
			const { name, args } = toolCall
			const mcpResult = await mcpServer.callTool(name ? name : 'getName', args);
			console.log('Resultados de herramientas:', mcpResult[0]);

			const resultMCP = await model.sendMessage({
				message: mcpResult,
				config: {
					systemInstruction: 'se te brindara un array de communities, tienes que seleccionar la mejor y describirla al usuario, si no hay ninguna que cumpla sus requisitos, haz preguntas adicionales para obtener más detalles sobre sus requisitos y gustos.'
				}
			});

			console.log('Respuesta final con datos de MCP:', resultMCP);


			return { text: response1.candidates?.[0]?.content?.parts || '',
				toolsUsed: [name]
			};

		} else {
			console.log('No se detectaron llamadas a herramientas en la respuesta.');
		}

		return {
			text: '',
			toolsUsed: []
		};

	}

}

export const geminiService = new GeminiService(); 