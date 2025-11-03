import { createSuggestPrompt } from "../prompts/prompts";
import { sessionStore } from "../store/zustandStore";
import { tools } from "../tools/agent.tools";
import { cleanModelText } from "../utils/cleanModelText";
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
    console.log("toolsCall", toolsCall);

    if (response1.functionCalls && response1.functionCalls.length > 0) {
      console.log("Call", response1.functionCalls);
      console.log("Tools Call", toolsCall);

      const mcpResult = await mcpServer.callTools(toolsCall);
      console.log("Resultados de herramientas:", mcpResult);

      // console.log("Prompt", mcpResult.systemInstruction);

      const resultMCP = await model.sendMessage({
        message: JSON.stringify(mcpResult.data) || {},
        config: {
          systemInstruction: mcpResult.systemInstruction,
          responseMimeType: "application/json",
          stopSequences: ["[END]"],
        },
      });

			const hasPhytonError =
				resultMCP.candidates?.[0]?.content?.parts?.length === 0 || resultMCP.candidates?.[0]?.content?.parts?.[0].text === undefined || resultMCP.candidates?.[0]?.content?.parts?.[0].text.includes("tool_code") ? true : false;

			console.log("hasPhytonError", hasPhytonError);

      if (resultMCP.promptFeedback?.blockReason || hasPhytonError) {
        return {
          history,
          message: [
            "Lo sentimos, tu petición no pudo ser procesada. Intenta de nuevo más tarde.",
          ],
          sessionId: "",
        };
      }

      history.push({
        role: "model",
        parts: resultMCP.candidates?.[0]?.content?.parts || [],
      });

      const raw = resultMCP.candidates?.[0]?.content?.parts?.[0].text ?? "";
      const rawCleaned = cleanModelText(raw);
      const jsonOnly = JSON.parse(rawCleaned.replace(/\[END\]$/i, "").trim());

      return {
        message: jsonOnly || [],
        sessionId: mcpResult.sessionId,
        history,
      };
    } else {
      const response2 = await model.sendMessage({
        message: message,
        config: {
          systemInstruction: createSuggestPrompt(),
          responseMimeType: "application/json",
          stopSequences: ["[END]"],
        },
      });

      history.push({
        role: "model",
        parts: response2.candidates?.[0]?.content?.parts
          ? response2.candidates?.[0]?.content?.parts
          : [{ text: "" }],
      });

      const raw = response2.candidates?.[0]?.content?.parts?.[0].text ?? "";
      const rawCleaned = cleanModelText(raw);
      const jsonOnly = JSON.parse(rawCleaned.replace(/\[END\]$/i, "").trim());

      return {
        message: jsonOnly || [],
        history,
        sessionId: null,
      };
    }
  }
}

export const geminiService = new GeminiService();
