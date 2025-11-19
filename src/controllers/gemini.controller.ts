import { Request, Response } from "express";
import { geminiService } from "../mcp-llm/gemini.service";
import { initI18n } from "./i18n";

export const chatWithGemini = async (req: Request, res: Response): Promise<void> => {
	try {

		const { text, history, sessionId, lang = "en" } = req.body;

		await initI18n(lang);

		if (!text) {
			res.status(400).json({ success: false, error: "Mensaje requerido" });
			return;
		}

		const result = await geminiService.chatWithTools(text, history, lang, sessionId);

		res.cookie('sessionId', result.sessionId, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 día

		res.json({ success: true, response: result });
	} catch (error) {
		const errMsg = error instanceof Error ? error.message : String(error);
		res.status(500).json({ success: false, error: errMsg });
	}
};
