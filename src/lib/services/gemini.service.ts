import { VertexAI } from '@google-cloud/vertexai';
import { ReviewGenerationRequest } from '@/lib/types/user';

const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || '',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
  }
});

export const geminiService = {
  async generateReview(request: ReviewGenerationRequest): Promise<string> {
    try {
      const model = vertex_ai.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

      const prompt = `Generate a professional, positive review for ${request.employeeName} who works at ${request.companyName}. Focus on the ${request.category} aspect. The review should be authentic, specific, and between 25-100 words. Write in first person as if you are a satisfied customer. Important: Do not include any brackets, placeholders (like [date], [details]), or instructions for the user to fill in; the review should be ready to publish as-is.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;

      const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return text;
    } catch (error) {
      console.error('Error generating review with Vertex AI:', error);
      if (!process.env.GOOGLE_CLOUD_PROJECT) {
        throw new Error('Google Cloud Project ID is not configured (GOOGLE_CLOUD_PROJECT)');
      }
      throw error;
    }
  },
};
