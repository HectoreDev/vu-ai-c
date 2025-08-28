import { Router } from "express";
import { getCommunities, getCommunityInfo } from "../controllers/community.controller";

const router = Router();

router.post('/get-communities', getCommunities);
router.post('/get-community-info', getCommunityInfo);

export default router;