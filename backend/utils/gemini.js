import { GoogleGenerativeAI } from "@google/generative-ai";

// Main AI for grievances and general use
const genAI = new GoogleGenerativeAI(process.env.GRIEVANCES_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export default model;

// Separate AI instance for oral exams (if needed)
const genAIOral = new GoogleGenerativeAI(process.env.GEMINI_ORAL_API_KEY);

export const getGeminiModel = () => {
  return genAIOral.getGenerativeModel({ model: "gemini-2.5-flash" });
};

export const getGrievanceModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};



