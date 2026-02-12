import Material from "../models/Material.js";
import extractTextFromUrl from "../utils/extractText.js";
import model from "../utils/gemini.js";

export const summarizeMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.materialId);

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (
      req.user.role === "student" &&
      !material.students.includes(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const text = await extractTextFromUrl(
  material.filePath,
  material.fileName
);



    const shortText = text.slice(0, 20000);

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Summarize this study material in clean bullet points and highlight key concepts:

${shortText}
`,
            },
          ],
        },
      ],
    });

    const summary = result.response.text();

    res.json({ summary });
 } catch (error) {
  console.error("AI Controller Error:", error);
  res.status(500).json({
    message: error.message || "AI summary failed",
  });
}

};
