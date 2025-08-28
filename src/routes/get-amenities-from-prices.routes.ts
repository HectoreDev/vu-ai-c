import { Router } from "express";
import { getAmenitiesFromPrices, testAmenitiesConnection } from "../controllers/get-amenities-from-prices.controller";

const router = Router();

// Endpoint de prueba simple
router.post('/test-amenities-connection', testAmenitiesConnection);

// Endpoint principal con streaming
router.post('/get-amenities-from-prices', getAmenitiesFromPrices);

export default router;