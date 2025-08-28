import { Router } from "express";
import { getName } from "../controllers/get-name.controller";

const router = Router();

router.post('/get-name', getName);

export default router;