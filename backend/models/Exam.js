import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  difficulty: String,

  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  duration: Number,
  totalQuestions: Number,

  questions: [
    {
      questionId: { type: String, required: true },
      question: { type: String, required: true },
      options: { type: [String], required: true },
      correctAnswer: { type: Number, required: true },
      topic: { type: String },
    }
  ],

  status: {
    type: String,
    enum: ["DRAFT", "APPROVED", "SCHEDULED"],
    default: "DRAFT",
  },

  // ⭐⭐ PERMANENT FIX ⭐⭐
  scope: {
    type: String,
    enum: ["ALL", "SELECTED"],
    default: "ALL",     // 🔥 NEVER missing now
  },

  assignedStudents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],        // 🔥 NEVER undefined
  },

  scheduledAt: Date,
}, { timestamps: true });

export default mongoose.model("Exam", examSchema);
