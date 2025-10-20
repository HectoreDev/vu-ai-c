import { Router, Request, Response } from "express";
import { chatWithGemini } from "../controllers/gemini.controller";
import { searchAlgolia } from "../functions/searchAlgolia";
import { queryDocument } from "../search/search";

const router = Router();

router.post("/gemini/chat", chatWithGemini);

router.post("/testAlgo", async (req: Request, res: Response): Promise<void> => {
  console.log("test algo route");

  const results = await queryDocument({
    query:'',
    numericFilters: [],
    faceType: 'objectType:community',
    filters: [ 'city:Sacramento']
  });

  // console.log('Results', results);

  res.json({ success: true, results });

});

export default router; 