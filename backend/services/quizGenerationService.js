import { geminiQuizClient } from "../utils/geminiClient.js";

const MAX_GEMINI_RETRIES = 2;

/* ------------------ helpers ------------------ */

const toNumber = (value, fallback) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeQuestion = (question, index) => {
  const optionsRaw = Array.isArray(question?.options) ? question.options : [];
  const options = optionsRaw.map((o) => String(o ?? "")).slice(0, 4);

  while (options.length < 4) options.push("");

  const correct = toNumber(question?.correct, 0);
  const safeCorrect = correct >= 0 && correct < 4 ? correct : 0;

  return {
    id: String(question?.id || `q_${index + 1}`),
    question: String(question?.question || ""),
    options,
    correct: safeCorrect,
  };
};

const normalizeQuestionSet = (questions) =>
  (Array.isArray(questions) ? questions : []).map(normalizeQuestion);

/* ------------------ Gemini parsing ------------------ */

const parseGeminiQuestions = (rawText) => {
  const cleaned = String(rawText || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  if (!cleaned) return null;

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed?.questions)) return null;
  return normalizeQuestionSet(parsed.questions);
};

/* ------------------ fallback (generic only) ------------------ */

const genericFallback = (count) => {
  const safeCount = Math.max(1, toNumber(count, 10));
  const base = [
    {
      question: "Which option is correct?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
    },
  ];

  return Array.from({ length: safeCount }, (_, i) =>
    normalizeQuestion(
      {
        ...base[i % base.length],
        id: `q_${i + 1}`,
      },
      i
    )
  );
};

/* ------------------ main service ------------------ */

export const generateQuizQuestions = async ({
  subject,
  questions,
  difficulty,
}) => {
  const safeCount = Math.max(1, toNumber(questions, 10));
  const safeDifficulty = String(difficulty || "mixed").toLowerCase();
  const safeSubject = String(subject || "general").trim();

  const prompt = `
Generate ${safeCount} multiple-choice questions strictly based on:
"${safeSubject}"

Difficulty: ${safeDifficulty}

Rules:
- Questions must ONLY belong to the given subject/topic
- 4 options exactly
- One correct answer
- No explanations
- No extra text
- Output ONLY valid JSON in the format below

{
  "questions": [
    {
      "id": "q1",
      "question": "",
      "options": ["", "", "", ""],
      "correct": 0
    }
  ]
}
`;

  for (let attempt = 1; attempt <= MAX_GEMINI_RETRIES; attempt++) {
    try {
      const res = await geminiQuizClient.post(
        `/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_QUIZ_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }
      );

      const rawText =
        res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const parsed = parseGeminiQuestions(rawText);

      if (parsed && parsed.length > 0) {
        return parsed.slice(0, safeCount);
      }
    } catch (err) {
      console.error(`Gemini attempt ${attempt} failed:`, err.response?.status, err.message);
      if (err.response?.status === 403) {
        console.error("Gemini API key issue or quota exceeded");
        break; // Don't retry on 403
      }
    }
  }

  // absolute last safety net
  console.warn("Using generic fallback questions");
  return genericFallback(safeCount);
};

export default generateQuizQuestions;