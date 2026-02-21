import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getQuizResult, listStudentQuizAttempts } from "../controllers/quizResultController.js";

const router = express.Router();

// Student can view own quiz result
router.get(
  "/:attemptId",
  protect,
  authorizeRoles("student"),
  getQuizResult
);

// List all finalized attempts for current student
router.get(
  "/list",
  protect,
  authorizeRoles("student"),
  listStudentQuizAttempts
);

export default router;