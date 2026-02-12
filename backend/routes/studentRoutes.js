import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getStudentMaterials,
  downloadStudentMaterial,
} from "../controllers/studentMaterial.js";


const router = express.Router();

// Student dashboard
router.get(
  "/dashboard",
  protect,
  authorizeRoles("student"),
  (req, res) => {
    res.json({
      message: "Student dashboard data",
      studentId: req.user.studentId,
      faceVerified: req.user.faceVerified,
    });
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



