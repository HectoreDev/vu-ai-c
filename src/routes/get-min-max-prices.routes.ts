import { Router } from "express";
import { getMinMaxPrices } from "../controllers/get-min-max-prices.controller";

const router = Router();

router.post('/get-min-max-prices', getMinMaxPrices);

export default router;