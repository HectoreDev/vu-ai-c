import { createSuggestPrompt } from "../prompts/prompts";
import { cleanModelText } from "../utils/cleanModelText";
import { tPrompts } from "../controllers/i18n";
import { createChatModel } from "./gemini.config";
import { mcpServer } from "./mcp.server";
import { Part } from "@google/genai";
import { sessionStore } from "../store/zustandStore";
import { Lang } from "../types/types";
import { createToolSchema } from "../tools/agent.tools";

export interface IFHistory {
  role: "user" | "model";
  parts: Part[];
}

export class GeminiService {
  async chatWithTools(
    message: string,
    history: IFHistory[],
    lang: Lang,
    sessionId?: number
  ) {
    const { setLang } = sessionStore.getState();

    setLang(lang);

    const model = createChatModel(lang, history);

    const toolSchema = createToolSchema(lang);

    const tools = Object.values(toolSchema);

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
            text: tPrompts("errors.blockReason", lang) as string,
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

      const resultMCP = await model.sendMessage({
        message: JSON.stringify(mcpResult.data) || {},
        config: {
          systemInstruction: mcpResult.systemInstruction,
          responseMimeType: "application/json",
          stopSequences: ["[END]"],
        },
      });

      const hasPhytonError =
        resultMCP.candidates?.[0]?.content?.parts?.length === 0 ||
        resultMCP.candidates?.[0]?.content?.parts?.[0].text === undefined ||
        resultMCP.candidates?.[0]?.content?.parts?.[0].text.includes(
          "tool_code"
        )
          ? true
          : false;

      console.log("hasPhytonError", hasPhytonError);

      if (resultMCP.promptFeedback?.blockReason || hasPhytonError) {
        return {
          history,
          message: [tPrompts("errors.unexpected", lang) as string],
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
      console.log("res uno");

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
      console.log("res dos");

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
