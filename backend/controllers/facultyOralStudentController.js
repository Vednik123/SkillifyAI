import FacultyOralExam from "../models/FacultyOralExam.js";
import FacultyOralAttempt from "../models/FacultyOralAttempt.js";
import { getGeminiModel } from "../utils/gemini.js";

export const startFacultyExam = async (req, res) => {
  const exam = await FacultyOralExam.findById(req.params.id);

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  // create attempt if not exists
  let attempt = await FacultyOralAttempt.findOne({
    exam: exam._id,
    student: req.user._id,
  });

  if (attempt && attempt.status === "completed") {
    return res.status(400).json({
      message: "You have already completed this exam.",
    });
  }

  if (!attempt) {
    attempt = await FacultyOralAttempt.create({
      exam: exam._id,
      student: req.user._id,
    });
  }

  res.json({
    attemptId: attempt._id,
    duration: exam.duration,
    totalQuestions: exam.totalQuestions,
    questions: exam.questions,
  });
};

export const submitFacultyAnswer = async (req, res) => {
  const { attemptId, questionIndex, userAnswer } = req.body;

  const attempt = await FacultyOralAttempt.findById(attemptId);

  if (!attempt) {
    return res.status(404).json({ message: "Attempt not found" });
  }

  attempt.answers.push({
    questionIndex,
    studentAnswer: userAnswer,
  });

  await attempt.save();

  res.json({ message: "Answer saved" });
};

export const evaluateFacultyExam = async (req, res) => {
  const { attemptId } = req.body;

  const attempt = await FacultyOralAttempt.findById(attemptId)
    .populate("exam");

  if (!attempt) {
    return res.status(404).json({ message: "Attempt not found" });
  }

  const gemini = getGeminiModel();

  let totalScore = 0;
  const totalQuestions = attempt.exam.totalQuestions;

  for (let i = 0; i < totalQuestions; i++) {
    let ans = attempt.answers.find(
      (a) => a.questionIndex === i
    );

    const question = attempt.exam.questions[i];

    // If not answered → assign 0
    if (!ans || !ans.studentAnswer) {
      if (!ans) {
        attempt.answers.push({
          questionIndex: i,
          studentAnswer: "",
          score: 0,
          aiFeedback: "Not Attempted",
        });
      } else {
        ans.score = 0;
        ans.aiFeedback = "Not Attempted";
      }

      continue;
    }

    // 🔥 Evaluate answered questions
    const prompt = `
Question: ${question.question}
Expected Answer: ${question.expectedAnswer}
Student Answer: ${ans.studentAnswer}

Evaluate:
1. Score out of 10
2. Short feedback
Return format:
Score: X
Feedback: ...
`;

    const result = await gemini.generateContent(prompt);
    const text = result.response.text();

    const scoreMatch = text.match(/Score:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

    ans.score = score;
    ans.aiFeedback = text;

    totalScore += score;
  }

  // ✅ Correct calculation out of full paper
  attempt.overallScore = Math.round(
    (totalScore / (totalQuestions * 10)) * 100
  );

  attempt.aiSummary = `Overall Performance: ${
    attempt.overallScore > 75 ? "Excellent" : "Needs Improvement"
  }`;

  attempt.status = "completed";

  await attempt.save();

  res.json({ message: "Evaluation complete" });
};


export const getFacultyResult = async (req, res) => {
  try {
    const attempt = await FacultyOralAttempt.findById(req.params.id).populate(
      "exam",
    );

    if (!attempt) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(attempt);
  } catch (error) {
    console.error("Get Faculty Result Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentFacultyAttempts = async (req, res) => {
  try {
    const attempts = await FacultyOralAttempt.find({
      student: req.user._id,
      status: "completed",
    })
      .populate("exam")
      .sort({ updatedAt: -1 });

    res.json(attempts);
  } catch (error) {
    console.error("Fetch Faculty Attempts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

