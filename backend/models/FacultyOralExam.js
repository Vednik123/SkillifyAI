import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  expectedAnswer: { type: String, required: true },
});

const facultyOralExamSchema = new mongoose.Schema(
  {
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    questions: [questionSchema],
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "assigned"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("FacultyOralExam", facultyOralExamSchema);
