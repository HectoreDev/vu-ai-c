import { Router } from "express";
import { initFlow } from "../controllers/init.controller";

const router = Router();

router.post('/init', initFlow);

export default router;