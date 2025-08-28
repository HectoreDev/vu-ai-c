import { Router } from "express";
import { getLots } from "../controllers/lots.controller";

const router = Router();

router.post('/get-lots', getLots);

export default router;