import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadExamFile } from "../middlewares/uploadMiddleware.js";

import {
  createExamFromDoc,
  getExamForReview,
  updateExamQuestion,
  deleteExamQuestion,
  approveExam,
  scheduleExam,
} from "../controllers/facultyExamController.js";

import { assignStudentsToExam } from "../controllers/examAssignmentController.js";

const router = express.Router();

/* =================================================
   FACULTY EXAM MANAGEMENT ROUTES
================================================= */

// 1️⃣ Upload document → AI generate questions (DRAFT)
router.post(
  "/create",
  protect,                     // JWT auth
  uploadExamFile.single("file"),// MEMORY upload
  createExamFromDoc
);

// 2️⃣ Get exam (for review screen)
router.get(
  "/:examId",
  protect,
  getExamForReview
);

// 3️⃣ Edit a question
router.patch(
  "/:examId/question/:questionId",
  protect,
  updateExamQuestion
);

// 4️⃣ Delete a question
router.delete(
  "/:examId/question/:questionId",
  protect,
  deleteExamQuestion
);

// 5️⃣ Approve exam
router.patch(
  "/:examId/approve",
  protect,
  approveExam
);

// 6️⃣ Schedule exam
router.patch(
  "/:examId/schedule",
  protect,
  scheduleExam
);

// 7️⃣ Assign students
router.patch(
  "/:examId/assign",
  protect,
  assignStudentsToExam
);

export default router;