import express from "express";
import { getProfile } from "../controller/user.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";


const router = express.Router();

router.get("/profile", requireAuth, getProfile);

export default router;
