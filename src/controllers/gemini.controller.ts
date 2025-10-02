import {Request, Response} from "express";
import {geminiService} from "../mcp-llm/gemini.service";
import {parseResponse} from "../utils/parse";

interface IFData {
    location: string;
    priceMin?: number;
    priceMax?: number;
    min?: number;
    max?: number;
    amenities?: string[];
    communities?: {
        uid: string;
        name: string;
    }[];
    floorplans?: {
        uid: string;
        name: string;
    }[];
    siteplans?: {
        uid: string;
        name: string;
    }[];
}

export const chatWithGemini = async (req : Request, res : Response) : Promise < void > => {
    try {
        const {message, sessionId} = req.body;

        if (!message) {
            res.status(400).json({success: false, error: "Mensaje requerido"});
            return;
        }

        const result = await geminiService.chatWithTools(message, sessionId);

        res.json({success: true, response: result.text});
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({success: false, error: errMsg});
    }
};
