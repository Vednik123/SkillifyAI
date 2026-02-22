import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import connectDB from "./config/db.js";
import { initializeSLAMonitoring } from "./utils/grievanceSLAMonitoring.js";
import { startGrievanceTimeoutService } from "./utils/grievanceTimeoutService.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiMentorRoutes from "./routes/aiMentorRoutes.js";
import aiTutorRoutes from "./routes/aiTutorRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import oralRoutes from "./routes/oralRoutes.js";
import facultyOralRoutes from "./routes/facultyOralRoutes.js";
import facultyOralStudentRoutes from "./routes/facultyOralStudentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import facultyAnalyticsRoutes from "./routes/facultyAnalyticsRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";

import examAssignmentRoutes from "./routes/examAssignmentRoutes.js";
import proctorRoutes from "./routes/proctorRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import quizAttemptRoutes from "./routes/quizAttemptRoutes.js";
import quizResultRoutes from "./routes/quizResultRoutes.js";
import facultyExamRoutes from "./routes/facultyExamRoutes.js";
import studentExamRoutes from "./routes/studentExamRoutes.js";
import facultyQuizReviewRoutes from "./routes/facultyQuizReviewRoutes.js";
import facultyQuizAnalyticsRoutes from "./routes/facultyQuizAnalyticsRoutes.js";

import classRoutes from "./routes/classRoutes.js";
import facultyMaterialRoutes from "./routes/facultyMaterialRoutes.js";
import semesterRoutes from "./routes/semesterRoutes.js";




dotenv.config();
connectDB();

// Initialize services
initializeSLAMonitoring();

const app = express();
const httpServer = http.createServer(app);

// ✅ Socket.io Setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Make io available globally for controllers
global.io = io;

// Socket.io Connection Handling
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join room based on user role and ID
  socket.on("join_room", (data) => {
    const { userId, role } = data;
    const room = `${role}_${userId}`;
    socket.join(room);
    console.log(`${socket.id} joined room: ${room}`);
  });

  // Real-time notifications for grievance updates
  socket.on("grievance_update", (data) => {
    const { recipientId, role, event, payload } = data;
    const room = `${role}_${recipientId}`;
    io.to(room).emit("grievance_notification", {
      event,
      payload,
      timestamp: new Date(),
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Handle errors
  socket.on("error", (error) => {
    console.log(`Socket error: ${error}`);
  });
});

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
app.use("/api", examAssignmentRoutes);

app.use("/api/courses", courseRoutes);
app.use("/api/ai-mentor", aiMentorRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai-tutor", aiTutorRoutes);

app.use("/api/proctor", proctorRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/quiz/attempt", quizAttemptRoutes)
app.use("/api/quiz/result", quizResultRoutes);
app.use("/api/faculty/exams", facultyExamRoutes);
app.use("/api/student/exams", studentExamRoutes);
app.use("/api/faculty", facultyQuizReviewRoutes);
app.use("/api/faculty/analytics", facultyQuizAnalyticsRoutes);
app.use("/api/faculty/classes", classRoutes);
app.use("/api/faculty/materials", facultyMaterialRoutes);
app.use("/api/admin/semesters", semesterRoutes);


app.use("/api/interviews", interviewRoutes);
app.use("/api/oral", oralRoutes);
app.use("/api/faculty/oral", facultyOralRoutes);
app.use("/api/student/faculty-oral", facultyOralStudentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/faculty/analytics", facultyAnalyticsRoutes);
app.use("/api/grievance", grievanceRoutes);
app.use("/api/verify", verificationRoutes);


// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', reason, 'promise:', promise);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

// ✅ Server start
const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io enabled for real-time communication`);
  console.log(`⚠️ Error handling enabled - server will not crash on errors`);
});
