import { Router, Request, Response } from "express";
import { chatWithGemini } from "../controllers/gemini.controller";
import { searchAlgolia } from "../functions/searchAlgolia";

const router = Router();

router.post("/gemini/chat", chatWithGemini);

router.post("/testAlgo", async (req: Request, res: Response): Promise<void> => {
  console.log("test algo route");

  const results = await searchAlgolia({
    location: ['Phoenix', 'Austin'],
    priceMin: 500000,
    priceMax: 1500000
  });

  console.log('Results', results);

  res.json({ success: true, results });

});

export default router; 