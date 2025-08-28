import { Router } from "express";
import { getLocation } from "../controllers/get-location.controller";

const router = Router();

router.post('/get-location', getLocation);

export default router;