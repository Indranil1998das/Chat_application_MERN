const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: "config/.env" });
const ai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const aiMessage = async (message) => {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    throw new Error(error.message || "AI generation failed");
  }
};

module.exports = aiMessage;
