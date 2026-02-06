import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Middleware
app.use(express.json({ limit: "2mb" }));


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Logging only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SkillifyAI backend running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/parent", parentRoutes);

// ✅ Server start
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
