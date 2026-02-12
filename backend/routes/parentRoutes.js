import express from "express";
import User from "../models/User.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getChildMaterials,
  downloadChildMaterial,
  getFacultyOfChildren,
} from "../controllers/parentMaterial.js";
const router = express.Router();

/*
====================================
PARENT DASHBOARD
====================================
*/
router.get(
  "/dashboard",
  protect,
  authorizeRoles("parent"),
  async (req, res) => {
    try {
      const parent = await User.findById(req.user._id)
        .populate("children", "fullName studentId educationLevel");

      res.json(parent.children);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


/*
====================================
EXTRACT STUDENT BY ID (FOR PARENT)
====================================
*/
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("parent"),
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const student = await User.findOne({
        studentId,
        role: "student",
      }).select("-password");

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/*
====================================
ADD CHILD (PARENT → STUDENT)
====================================
*/
router.post(
  "/add-student",
  protect,
  authorizeRoles("parent"),
  async (req, res) => {
    try {
      const { studentId } = req.body;

      const student = await User.findOne({
        studentId,
        role: "student",
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Prevent duplicate assignment
      const alreadyAdded = student.parents.some(
  (id) => id.toString() === req.user._id.toString()
);

if (alreadyAdded) {
  return res.status(400).json({
    message: "Child already added",
  });
}


      // Add parent to student
      student.parents.push(req.user._id);
      await student.save();

      // Add student to parent
      req.user.children.push(student._id);
      await req.user.save();

      res.json({
        success: true,
        message: "Child added successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/*
========================
GET CHILD MATERIALS
========================
*/
router.get(
  "/child-materials/:childId",
  protect,
  authorizeRoles("parent"),
  getChildMaterials
);

/*
========================
DOWNLOAD CHILD MATERIAL
========================
*/
router.get(
  "/child-materials/download/:childId/:materialId",
  protect,
  authorizeRoles("parent"),
  downloadChildMaterial
);

router.get(
  "/faculty",
  protect,
  authorizeRoles("parent"),
  getFacultyOfChildren
);



export default router;
