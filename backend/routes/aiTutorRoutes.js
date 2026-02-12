import express from "express";
import { startTutorSession } from "../controllers/aiTutorController.js";

const router = express.Router();

router.post("/start", startTutorSession);

export default router;
