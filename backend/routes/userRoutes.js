import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getFaceEmbedding } from "../controllers/userController.js";

const router = express.Router();

router.get("/face-embedding", protect, getFaceEmbedding);

export default router;
