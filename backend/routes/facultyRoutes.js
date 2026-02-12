import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import User from "../models/User.js";
import upload from "../middlewares/upload.js";
import { uploadMaterial } from "../controllers/facultyMaterial.js";
import {
  getFacultyStudents,
  removeStudentConnection,
} from "../controllers/facultyMaterial.js";



const router = express.Router();

// Faculty dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("faculty"),
  (req, res) => {
    res.json({
      message: "Faculty dashboard data",
      facultyId: req.user.facultyId,
    });
  }
);

// Extract student by studentId
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("faculty"),
  async (req, res) => {
    const { studentId } = req.params;

    const student = await User.findOne({
      studentId,
      role: "student",
    }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  }
);

router.post(
  "/add-student",
  protect,
  authorizeRoles("faculty"),
  async (req, res) => {
    const { studentId } = req.body;

    const student = await User.findOne({
      studentId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Prevent duplicate
    if (student.faculties.includes(req.user._id)) {
      return res.status(400).json({
        message: "Student already assigned to this faculty",
      });
    }

    // Add faculty to student
    student.faculties.push(req.user._id);
    await student.save();

    // Add student to faculty
    req.user.students.push(student._id);
    await req.user.save();

    res.json({ success: true, message: "Student added successfully" });
  }
);
/*
========================
GET ASSIGNED STUDENTS
========================
*/
router.get(
  "/my-students",
  protect,
  authorizeRoles("faculty"),
  async (req, res) => {
    const faculty = await User.findById(req.user._id)
      .populate("students", "fullName studentId");

    res.json(faculty.students);
  }
);

/*
========================
UPLOAD MATERIAL
========================
*/
router.post(
  "/upload-material",
  protect,
  authorizeRoles("faculty"),
  upload.array("files"),
  uploadMaterial
);

router.get(
  "/students",
  protect,
  authorizeRoles("faculty"),
  getFacultyStudents
);

router.delete(
  "/students/:studentId",
  protect,
  authorizeRoles("faculty"),
  removeStudentConnection
);



export default router;
