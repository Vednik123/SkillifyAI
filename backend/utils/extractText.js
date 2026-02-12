import axios from "axios";
import mammoth from "mammoth";

const extractTextFromUrl = async (fileUrl, fileName) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  const lowerName = fileName.toLowerCase();

  // PDF
  if (lowerName.endsWith(".pdf")) {
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const data = await pdfParse(response.data);
    return data.text;
  }

  // DOCX
  if (lowerName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({
      buffer: response.data,
    });
    return result.value;
  }

  // PPTX (basic text extraction support)
  if (lowerName.endsWith(".pptx")) {
    return "PPTX summarization not yet implemented.";
  }

  throw new Error("Unsupported file type");
};

export default extractTextFromUrl;
