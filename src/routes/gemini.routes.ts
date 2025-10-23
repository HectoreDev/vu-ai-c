import { Router, Request, Response } from "express";
import { chatWithGemini } from "../controllers/gemini.controller";
import { searchAlgolia } from "../functions/searchAlgolia";
import { queryDocument } from "../search/search";
import { getCommunitiesLocation } from "../search/getCommunitiesLocation";
import { sessionStore } from "../store/zustandStore";

const router = Router();

router.post("/gemini/chat", chatWithGemini);

router.post("/testAlgo", async (req: Request, res: Response): Promise<void> => {
  console.log("test algo route");

  const results = await queryDocument({
    query: '',
    numericFilters: [],
    facetType: 'objectType:community',
    filters: ['city:Sacramento']
  });

  // console.log('Results', results);

  res.json({ success: true, results });

});

router.post("/testAlgoLocation", async (req: Request, res: Response): Promise<void> => {
  console.log("test algo location route");
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      throw new Error('Latitude and longitude are required');
    }

    sessionStore.getState().setLatitude(latitude);
    sessionStore.getState().setLongitude(longitude);

    const results = await getCommunitiesLocation();

    if (!results.success) {
      throw new Error(results.error);
    }

    res.json({ success: true, results: results.data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.json({ success: false, error: errorMessage });
  }
});

export default router; 