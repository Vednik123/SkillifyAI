import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export default model;

// for oral
const genAIOral = new GoogleGenerativeAI(process.env.GEMINI_ORAL_API_KEY);

export const getGeminiModel = () => {
  return genAIOral.getGenerativeModel({ model: "gemini-2.5-flash" });
};



