import { Request, Response } from "express";
import { geminiService } from "../llm/gemini.service";

interface IFData {
    location: string;
    priceMin: number;
    priceMax: number;
    amenities: string[];
    communities: {
        uid: string;
        name: string;
    }[];
    floorplans: {
        uid: string;
        name: string;
    }[];
    siteplans: {
        uid: string;
        name: string;
    }[];
}

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
        let data: IFData = {
            location: result.location,
            priceMin: result.priceMin,
            priceMax: result.priceMax,
            amenities: result.amenities,
            communities: result.communities,
            floorplans: result.floorplans,
            siteplans: result.siteplans,
        };
     
        res.json({
            success: true,
            response: {
                prompt: result.text,
                toolsUsed: result.toolsUsed,
                sessionId: result.sessionId,
                data
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