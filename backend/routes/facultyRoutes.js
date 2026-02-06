import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

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

export default router;
