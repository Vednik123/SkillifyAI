import QuizAttempt from "../models/QuizAttempt.js";

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
