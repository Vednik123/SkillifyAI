import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiMentorRoutes from "./routes/aiMentorRoutes.js";
import aiTutorRoutes from "./routes/aiTutorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";



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

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api", aiRoutes);


app.use("/api/ai-mentor", aiMentorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);


// ✅ Server start
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
