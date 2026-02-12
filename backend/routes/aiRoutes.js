import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { summarizeMaterial } from "../controllers/aiController.js";

const router = express.Router();

router.post("/summarize/:materialId", protect, summarizeMaterial);

export default router;
