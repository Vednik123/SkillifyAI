import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getStudentMaterials,
  downloadStudentMaterial,
} from "../controllers/studentMaterial.js";
import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";
import { getStudentDashboard } from '../controllers/studentController.js'
import User from "../models/User.js";

const router = express.Router();

import Semester from "../models/Semester.js";


// Face verification (STUDENT ONLY)
router.put(
  "/face-verify",
  protect,
  authorizeRoles("student"),
  async (req, res) => {
    req.user.faceVerified = true;
    await req.user.save();

    res.json({ success: true, message: "Face verified successfully" });
  }
);

router.post(
  "/face-register",
  protect,
  authorizeRoles("student"),
  async (req, res) => {
    const { embedding } = req.body;

    if (!embedding || !Array.isArray(embedding)) {
      return res.status(400).json({ message: "Invalid face embedding" });
    }

    req.user.faceData = {
      embedding,
      model: "face-api.js",
      registeredAt: new Date(),
    };

    req.user.faceVerified = true;
    await req.user.save();

    res.json({ success: true });
  }
);

/*
========================
GET MATERIALS
========================
*/
router.get(
  "/materials",
  protect,
  authorizeRoles("student"),
  getStudentMaterials
);

/*
========================
DOWNLOAD MATERIAL
========================
*/
router.get(
  "/materials/download/:id",
  protect,
  authorizeRoles("student"),
  downloadStudentMaterial
);



// dashboard stats for exams
router.get(
  '/dashboard',
  protect,
  authorizeRoles("student"),
  getStudentDashboard
)


// List semesters for student selection
router.get(
  '/semesters',
  protect,
  authorizeRoles('student'),
  async (req, res) => {
    try {
      const list = await Semester.find().sort({ createdAt: -1 }).lean();
      return res.json(list);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to fetch semesters' });
    }
  }
);

// Get student's marksheet for a semester (only if declared)
router.get(
  '/marksheets/:semesterId',
  protect,
  authorizeRoles('student'),
  async (req, res) => {
    try {
      const { semesterId } = req.params;
      const sem = await Semester.findById(semesterId);
      if (!sem) return res.status(404).json({ message: 'Semester not found' });
      if (!sem.hasResultsDeclared) return res.status(403).json({ message: 'Results not declared yet' });

      const ExamAttempt = await import('../models/ExamAttempt.js').then(m=>m.default);
      const QuizAttempt = await import('../models/QuizAttempt.js').then(m=>m.default);
      const exams = await Exam.find({ semester: semesterId }).select('_id title');
      const examIds = exams.map(e=>e._id);

      const studentId = req.user._id;

      const examAttempts = await ExamAttempt.find({ exam: { $in: examIds }, student: studentId })
        .populate('exam', 'title')
        .lean();

      const quizAttempts = await QuizAttempt.find({ quizType: 'SCHEDULED', quizId: { $in: examIds.map(id=>String(id)) }, student: studentId, isFinalized: true })
        .lean();

      return res.json({ examAttempts, quizAttempts });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to fetch marksheet' });
    }
  }
);

// Get assigned faculty for grievance submission
router.get(
  '/assigned-faculty',
  protect,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      // Get all faculty members for the grievance dropdown
      const faculty = await User.find({ role: "faculty" }).select(
        "_id fullName email department specialization"
      );

      if (!faculty || faculty.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No faculty members available",
          faculty: []
        });
      }

      res.json({
        success: true,
        faculty: faculty.map(f => ({
          _id: f._id,
          fullName: f.fullName,
          email: f.email,
          department: f.department || 'Not specified',
          specialization: f.specialization || 'Not specified'
        }))
      });
    } catch (error) {
      console.error("Error fetching assigned faculty:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching faculty members",
        error: error.message
      });
    }
  }
)


export default router;