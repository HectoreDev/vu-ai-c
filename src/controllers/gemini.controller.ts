import { Request, Response } from "express";
import { geminiService } from "../llm/gemini.service";

export const chatWithGemini = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            res.status(400).json({
                success: false,
                error: "Mensaje requerido"
            });
            return;
        }

        const result = await geminiService.chatWithTools(message, sessionId);
        console.log("result-gemini-chat-with-tools", result);
        res.json({
            success: true,
            data: {
                response: result.text,
                toolsUsed: result.toolsUsed,
                sessionId: result.sessionId,
                communities: result.communities,
                community: result.community,
                amenities: result.amenities
            }
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            success: false,
            error: errMsg
        });
    }
};