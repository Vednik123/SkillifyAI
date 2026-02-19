import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getStudentMaterials,
  downloadStudentMaterial,
} from "../controllers/studentMaterial.js";
import ExamAttempt from "../models/ExamAttempt.js";
import Exam from "../models/Exam.js";


const router = express.Router();

// Student dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const studentId = req.user._id;

      /* 1️⃣ ALL SUBMITTED ATTEMPTS */
      const attempts = await ExamAttempt.find({
        student: studentId,
        status: { $in: ["SUBMITTED", "AUTO_SUBMITTED"] },
      })
        .sort({ submittedAt: -1 })
        .populate("exam", "title subject");

      const totalExams = attempts.length;

      /* 2️⃣ AVG SCORE */
      const avgScore =
        totalExams > 0
          ? Math.round(
              attempts.reduce((sum, a) => sum + (a.score || 0), 0) /
                totalExams
            )
          : 0;

      /* 3️⃣ PASS RATE (>=40 = pass) */
      const passedCount = attempts.filter(a => (a.score || 0) >= 40).length;
      const passRate =
        totalExams > 0
          ? Math.round((passedCount / totalExams) * 100)
          : 0;

      /* 4️⃣ RECENT EXAMS (for list + trend) */
      const recentExams = attempts.slice(0, 5).map(a => ({
        title: a.exam?.title,
        subject: a.exam?.subject,
        score: a.score || 0,
        submittedAt: a.submittedAt,
      }));

      /* 5️⃣ SUBJECT PERFORMANCE (PIE CHART) */
      const subjectMap = {};

      attempts.forEach(a => {
        const subject = a.exam?.subject;
        if (!subject) return;

        if (!subjectMap[subject]) {
          subjectMap[subject] = { total: 0, count: 0 };
        }

        subjectMap[subject].total += a.score || 0;
        subjectMap[subject].count += 1;
      });

      const subjectPerformance = Object.entries(subjectMap).map(
        ([subject, val]) => ({
          subject,
          score: Math.round(val.total / val.count),
        })
      );

      /* 6️⃣ STREAK (simple, based on days attempted) */
      const uniqueDays = new Set(
        attempts.map(a =>
          new Date(a.submittedAt).toDateString()
        )
      );
      const streak = uniqueDays.size;

      res.json({
        totalExams,
        avgScore,
        passRate,
        recentExams,
        subjectPerformance,
        streak,
        studyHours: 0,      // future feature
        certificates: 0,    // future feature
      });
    } catch (error) {
      console.error("Student dashboard error:", error);
      res.status(500).json({ message: "Dashboard fetch failed" });
    }
  }
);

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



export default router;