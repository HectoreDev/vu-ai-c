import { geminiService, IFHistory } from "../mcp-llm/gemini.service";
import { Lang } from "../types/types";
import { initI18n } from "./i18n";

export interface GeminiRequestBody {
  text: string;
  history: IFHistory[]; // aquí puedes usar tu IFHistory[]
  lang: Lang;
  sessionId?: number;
}

export const chatWithGeminiLogic = async ({
  history,
  lang,
  text,
  sessionId,
}: GeminiRequestBody) => {
  await initI18n(lang);

  if (!text) {
    throw new Error("Message Required!");
  }

  const result = await geminiService.chatWithTools(
    text,
    history,
    lang,
    sessionId
  );

  return result;
};
