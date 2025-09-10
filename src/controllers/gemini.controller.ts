import {Request, Response} from "express";
import {geminiService} from "../llm/gemini.service";
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
        console.log("result-gemini-chat-with-tools", result);

        /*   let data: IFData = {
            location: result.location,
            priceMin: result.priceMin,
            priceMax: result.priceMax,
            amenities: result.amenities,
            communities: result.communities,
            floorplans: result.floorplans,
            siteplans: result.siteplans,
        }; */

        const parseRes = parseResponse(result.text);

        console.log('RES', parseRes);


        res.json({success: true, response: parseRes[0]});
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        res.status(500).json({success: false, error: errMsg});
    }
};
