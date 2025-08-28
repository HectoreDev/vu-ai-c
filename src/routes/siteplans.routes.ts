import { Router } from "express";
import { getSiteplans } from "../controllers/siteplans.controller";

const router = Router();

router.post('/get-siteplans', getSiteplans);

export default router;