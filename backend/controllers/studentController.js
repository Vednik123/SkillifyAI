import InterviewSession from "../models/Interview.js";
import FacultyOralAttempt from "../models/FacultyOralAttempt.js";
import ExamAttempt from "../models/ExamAttempt.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    /* ================= EXAM ATTEMPTS ================= */
    const examAttempts = await ExamAttempt.find({
      student: studentId,
      status: { $in: ["SUBMITTED", "AUTO_SUBMITTED"] },
    })
      .sort({ submittedAt: 1 })
      .populate("exam", "title subject");

    const totalQuizzes = examAttempts.length;

    const avgQuizScore =
      totalQuizzes > 0
        ? examAttempts.reduce((sum, a) => sum + (a.score || 0), 0) /
          totalQuizzes
        : 0;

    const quizTrend = examAttempts.map((a, i) => ({
      attempt: i + 1,
      score: a.score || 0,
    }));

    /* ================= INTERVIEWS ================= */
    const interviews = await InterviewSession.find({
      student: studentId,
      status: "completed",
    }).sort({ createdAt: 1 });

    const totalInterviews = interviews.length;

    const avgInterviewScore =
      totalInterviews > 0
        ? interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) /
          totalInterviews
        : 0;

    const interviewTrend = interviews.map((i, index) => ({
      attempt: index + 1,
      score: i.overallScore || 0,
    }));

    /* ================= FACULTY ORALS ================= */
    const facultyOrals = await FacultyOralAttempt.find({
      student: studentId,
      status: "completed",
    }).sort({ createdAt: 1 });

    const totalOrals = facultyOrals.length;

    const avgOralScore =
      totalOrals > 0
        ? facultyOrals.reduce(
            (sum, o) => sum + (o.overallScore || 0),
            0
          ) / totalOrals
        : 0;

    const oralTrend = facultyOrals.map((o, index) => ({
      attempt: index + 1,
      score: o.overallScore || 0,
    }));

    /* ================= SUBJECT PERFORMANCE ================= */
    const subjectMap = {};

    examAttempts.forEach((a) => {
      const subject = a.exam?.subject;
      if (!subject) return;

      if (!subjectMap[subject]) subjectMap[subject] = [];
      subjectMap[subject].push(a.score || 0);
    });

    const subjectPerformance = Object.keys(subjectMap).map((sub) => ({
      subject: sub,
      score:
        subjectMap[sub].reduce((a, b) => a + b, 0) /
        subjectMap[sub].length,
    }));

    /* ================= OVERALL ================= */
    const overallAverage =
      (avgQuizScore + avgInterviewScore + avgOralScore) / 3;

    /* ================= PASS RATE ================= */
    const passedCount = examAttempts.filter(
      (a) => (a.score || 0) >= 40
    ).length;

    const passRate =
      totalQuizzes > 0
        ? Math.round((passedCount / totalQuizzes) * 100)
        : 0;

    /* ================= RECENT ACTIVITY ================= */
    const recentActivity = [
      ...examAttempts.map((a) => ({
        type: "Exam",
        title: a.exam?.title,
        subject: a.exam?.subject,
        score: a.score || 0,
        date: a.submittedAt,
      })),
      ...interviews.map((i) => ({
        type: "Interview",
        title: i.subject,
        subject: i.type,
        score: i.overallScore || 0,
        date: i.createdAt,
      })),
      ...facultyOrals.map((o) => ({
        type: "Oral",
        title: "Faculty Oral",
        subject: "Oral",
        score: o.overallScore || 0,
        date: o.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    /* ================= RESPONSE ================= */
    res.json({
      totalQuizzes,
      totalInterviews,
      totalOrals,
      avgQuizScore: Math.round(avgQuizScore),
      avgInterviewScore: Math.round(avgInterviewScore),
      avgOralScore: Math.round(avgOralScore),
      overallAverage: Math.round(overallAverage),
      passRate,
      streak: totalQuizzes, // simple streak logic
      quizTrend,
      interviewTrend,
      oralTrend,
      subjectPerformance,
      recentActivity,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};
