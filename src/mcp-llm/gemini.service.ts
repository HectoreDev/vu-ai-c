import { createSuggestPrompt } from "../prompts/prompts";
import { sessionStore } from "../store/zustandStore";
import { tools } from "../tools/agent.tools";
import { model } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { Part, Type } from "@google/genai";

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

    if (response1.promptFeedback?.blockReason) {
      return {
        history,
        message: [
          {
            text: "Lo sentimos, tu petición no pudo ser procesada. Intenta de nuevo más tarde.",
          },
        ],
        sessionId: "",
      };
    }

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

			const hasPhytonError =
				resultMCP.candidates?.[0]?.content?.parts?.length === 0 || resultMCP.candidates?.[0]?.content?.parts?.[0].text === undefined || resultMCP.candidates?.[0]?.content?.parts?.[0].text.includes("tool_code") ? true : false;

			console.log("hasPhytonError", hasPhytonError);

      if (resultMCP.promptFeedback?.blockReason || hasPhytonError) {
        return {
          history,
          message: [
            {
              text: "Lo sentimos, tu petición no pudo ser procesada. Intenta de nuevo más tarde.",
            },
          ],
          sessionId: "",
        };
      }

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
      const response2 = await model.sendMessage({
        message: message,
        config: {
          systemInstruction: createSuggestPrompt(),
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
