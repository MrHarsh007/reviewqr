import { GoogleGenerativeAI } from '@google/generative-ai';
import { ReviewGenerationRequest } from '@/lib/types/user';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const geminiService = {
  async generateReview(request: ReviewGenerationRequest): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `Generate a professional, positive review for ${request.employeeName} who works at ${request.companyName}. Focus on the ${request.category} aspect. The review should be authentic, specific, and between 25-100 words. Write in first person as if you are a satisfied customer. Important: Do not include any brackets, placeholders (like [date], [details]), or instructions for the user to fill in; the review should be ready to publish as-is.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error generating review with Gemini:', error);
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured');
      }
      throw error;
    }
  },
};
