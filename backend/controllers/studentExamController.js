import Exam from "../models/Exam.js";
import ExamAttempt from "../models/ExamAttempt.js";

console.log("studentExamController loaded");

/* ======================================================
   GET SCHEDULED EXAMS FOR STUDENT
====================================================== */
export const getScheduledExamsForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;

    const exams = await Exam.find({
      status: "SCHEDULED",
      $or: [
        { scope: "ALL" },
        {
          scope: "SELECTED",
          assignedStudents: { $in: [studentId] },
        },
      ],
    }).populate("faculty", "fullName email");

    return res.status(200).json(exams);
  } catch (error) {
    console.error("❌ Fetch scheduled exams error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch scheduled exams" });
  }
};

/* ======================================================
   START / RESUME SCHEDULED EXAM
====================================================== */
export const startScheduledExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    /* -------- TIME WINDOW CHECK -------- */
    const GRACE_MINUTES = 2;

    const now = new Date();
    const start = new Date(exam.scheduledAt);
    const end = new Date(start.getTime() + exam.duration * 60000);
    const graceStart = new Date(
      start.getTime() - GRACE_MINUTES * 60000
    );

    if (now < graceStart) {
      return res
        .status(403)
        .json({ message: "Exam has not started yet" });
    }

    if (now > end) {
      return res
        .status(403)
        .json({ message: "Exam has already ended" });
    }

    /* -------- CHECK EXISTING ATTEMPT -------- */
    const existingAttempt = await ExamAttempt.findOne({
      exam: exam._id,
      student: req.user._id,
    });

    // ❌ Already submitted → block
    if (
      existingAttempt &&
      ["SUBMITTED", "AUTO_SUBMITTED"].includes(
        existingAttempt.status
      )
    ) {
      return res
        .status(403)
        .json({ message: "Exam already attempted" });
    }

    // ✅ Resume ongoing attempt
    if (
      existingAttempt &&
      existingAttempt.status === "STARTED"
    ) {
      return res.json({
        attemptId: existingAttempt._id,
        duration: exam.duration,
        questions: exam.questions.map((q) => ({
          questionId: q.questionId,
          question: q.question,
          options: q.options,
        })),
      });
    }

    /* -------- CREATE NEW ATTEMPT -------- */
    const attempt = await ExamAttempt.create({
      exam: exam._id,
      student: req.user._id,
      totalQuestions: exam.questions.length,
      startedAt: new Date(),
      status: "STARTED",
    });

    return res.json({
      attemptId: attempt._id,
      duration: exam.duration,
      questions: exam.questions.map((q) => ({
        questionId: q.questionId,
        question: q.question,
        options: q.options,
      })),
    });
  } catch (error) {
    console.error("❌ Start exam error:", error)
    return res
      .status(500)
      .json({ message: "Failed to start exam" })
  }
};


/* ======================================================
   SUBMIT SCHEDULED EXAM
====================================================== */
export const submitScheduledExam = async (req, res) => {
  try {
    const { answers, proctoring } = req.body;

    const attempt = await ExamAttempt.findById(
      req.params.attemptId
    ).populate("exam");

    if (!attempt || attempt.status !== "STARTED") {
      return res.status(400).json({ message: "Invalid attempt" });
    }

    let score = 0;

    attempt.exam.questions.forEach((q) => {
      const ans = answers.find(
        (a) => a.questionId === q.questionId
      );
      if (ans && ans.selectedOption === q.correctAnswer) {
        score++;
      }
    });

    attempt.answers = answers;
    attempt.score = score;
    attempt.submittedAt = new Date();
    attempt.status = proctoring?.autoSubmitted
      ? "AUTO_SUBMITTED"
      : "SUBMITTED";
    attempt.proctoring = {
  faceWarnings: proctoring?.faceWarnings || 0,
  escWarnings: proctoring?.escWarnings || 0,
  autoSubmitted: proctoring?.autoSubmitted || false,
  reasons: proctoring?.reasons || [],
}

    await attempt.save();

    return res.json({
      score,
      total: attempt.totalQuestions,
    });
  } catch (error) {
    console.error("❌ Submit exam error:", error);
    return res
      .status(500)
      .json({ message: "Failed to submit exam" });
  }
};

/* ======================================================
   GET SCHEDULED EXAM RESULT
====================================================== */
export const getScheduledExamResult = async (req, res) => {
  try {
    const attempt = await ExamAttempt.findById(
      req.params.attemptId
    ).populate("exam");

    if (!attempt) {
      return res.sendStatus(404);
    }

    const analysis = attempt.exam.questions.map((q) => {
      const ans = attempt.answers.find(
        (a) => a.questionId === q.questionId
      );

      return {
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        studentAnswer: ans?.selectedOption ?? null,
        isCorrect:
          ans?.selectedOption === q.correctAnswer,
      };
    });

    return res.json({
      score: attempt.score,
      total: attempt.totalQuestions,
      proctoring: attempt.proctoring,
      analysis,
    });
  } catch (error) {
    console.error("❌ Get result error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch result" });
  }
};
