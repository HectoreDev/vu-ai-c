import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY no encontrada en variables de entorno");
}

export const genAI = new GoogleGenerativeAI(API_KEY);
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 