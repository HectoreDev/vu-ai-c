import { Router } from "express";
import { startSession } from "../controllers/session.controller";

const router = Router();

router.post('/session-start', startSession);

export default router;