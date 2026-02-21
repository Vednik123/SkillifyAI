import QuizAttempt from "../models/QuizAttempt.js";
import Exam from "../models/Exam.js";

export const getQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId)
  .populate("student", "fullName")
  .lean();

if (!attempt || !attempt.isFinalized) {
  return res.status(404).json({ message: "Result not found" });
}
    if (!Array.isArray(attempt.correctAnswers) || !attempt.correctAnswers.length)
      return res.status(400).json({ message: "Invalid attempt data" });

    const answerMap = new Map(
      (attempt.answers || []).map((a) => [String(a.questionId), a])
    );

    const questions = attempt.correctAnswers.map((c) => {
      const selected = answerMap.get(String(c.questionId));
      const selectedIndex =
        selected?.selectedIndex === null ||
        selected?.selectedIndex === undefined
          ? null
          : Number(selected.selectedIndex);

      const correctIndex = Number(c.correctAnswer);
      const options = Array.isArray(c.options) ? c.options : [];

      return {
        questionId: c.questionId,
        question: c.question,
        options,
        selectedIndex,
        selectedOption:
          selectedIndex !== null ? options[selectedIndex] : null,
        correctIndex,
        correctOption: options[correctIndex] || "",
        isCorrect: selectedIndex === correctIndex,
      };
    });

    const correct = questions.filter((q) => q.isCorrect).length;
    const total = questions.length;
    const score = total ? Math.round((correct / total) * 100) : 0;

    res.json({
      attemptId,
      student: { fullName: attempt.student?.fullName || "" },
      score,
      totalQuestions: total,
      status: attempt.status,
      warnings: attempt.warnings,
      submittedAt: attempt.submittedAt,
      questions,
      analytics: { accuracy: score },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listStudentQuizAttempts = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attempts = await QuizAttempt.find({
      student: studentId,
      isFinalized: true,
    })
      .sort({ submittedAt: -1, createdAt: -1 })
      .lean();

    // collect scheduled quiz ids to resolve titles
    const scheduledIds = Array.from(
      new Set(
        attempts
          .filter((a) => a.quizType === "SCHEDULED" && a.quizId)
          .map((a) => a.quizId.toString())
      )
    );

    let examMap = {};
    if (scheduledIds.length) {
      const exams = await Exam.find({ _id: { $in: scheduledIds } }).select(
        "_id title"
      );
      examMap = exams.reduce((acc, ex) => {
        acc[ex._id.toString()] = ex.title;
        return acc;
      }, {});
    }

    const list = attempts.map((a) => ({
      attemptId: a._id,
      quizType: a.quizType,
      quizId: a.quizId || null,
      quizTitle:
        a.quizType === "SCHEDULED" && a.quizId
          ? examMap[a.quizId.toString()] || null
          : a.quizType === "CUSTOM"
          ? "Custom AI Quiz"
          : null,
      score: a.score || 0,
      totalQuestions: a.totalQuestions || 0,
      submittedAt: a.submittedAt || a.updatedAt || a.createdAt,
      status: a.status || "",
    }));

    return res.json(list);
  } catch (err) {
    console.error("Failed to list quiz attempts:", err);
    return res.status(500).json({ message: "Failed to list attempts" });
  }
};
