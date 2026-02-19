import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getQuizResult } from "../controllers/quizResultController.js";

const router = express.Router();

// Student can view own quiz result
router.get(
  "/:attemptId",
  protect,
  authorizeRoles("student"),
  getQuizResult
);

export default router;