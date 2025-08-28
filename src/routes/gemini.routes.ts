import { Router } from "express";
import { chatWithGemini } from "../controllers/gemini.controller";

const router = Router();

router.post("/gemini/chat", chatWithGemini);

export default router; 