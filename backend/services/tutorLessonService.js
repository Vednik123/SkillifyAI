import axios from "axios";

export const generateTutorLesson = async (topic, minutes = 5) => {
  const apiKey = process.env.GEMINI_EXTENSION_TUTOR_API_KEY;

  const prompt = `
You are an expert classroom teacher.

Teach the topic "${topic}" clearly for approximately ${minutes} minutes.

Return ONLY JSON in this format:

{
  "steps": [
    {
      "title": "Introduction",
      "content": ["Sentence one", "Sentence two"]
    }
  ]
}
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  const raw =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const cleaned = raw.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(cleaned);

  return parsed.steps || [];
};
