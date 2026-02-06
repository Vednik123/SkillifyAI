import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("parent"),
  (req, res) => {
    res.json({
      message: "Parent dashboard data",
      parentId: req.user.parentId,
    });
  }
);

export default router;
