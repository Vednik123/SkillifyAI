import Exam from "../models/Exam.js";
import ExamAssignment from "../models/ExamAssignment.js";
import User from "../models/User.js";

export const assignStudentsToExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { assignType, studentIds } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    if (exam.status !== "SCHEDULED") {
      return res.status(400).json({ message: "Exam must be scheduled first" });
    }

    let students = [];

    if (assignType === "ALL") {
      students = await User.find({ role: "student" }).select("_id");
      students = students.map(s => s._id);
    } else {
      students = studentIds;
    }

    const assignment = await ExamAssignment.create({
      exam: examId,
      students,
      assignedBy: req.user.id,
    });

    res.json({
      message: "Exam assigned successfully",
      assignmentId: assignment._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
};
