import express from "express"
import { protect } from "../middlewares/authMiddleware.js"

import {
  startAttempt,
  addWarning,
  submitAttempt,
  startScheduledExamAttempt,
} from "../controllers/quizAttemptController.js"

const router = express.Router()

router.post("/start", protect, startAttempt)
router.patch("/warning", protect, addWarning)
router.patch("/submit", protect, submitAttempt)
router.post(
  "/scheduled/:examId/start",
  protect,
  startScheduledExamAttempt
);

export default router