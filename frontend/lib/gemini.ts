import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Safety settings for medical content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generation configuration for health-related responses
const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 2048,
};

// Health-focused system prompt
const HEALTH_SYSTEM_PROMPT = `You are SwasthAI, a helpful and knowledgeable health assistant. Your role is to:

1. Provide accurate, evidence-based health information
2. Offer general wellness advice and preventive care tips
3. Help users understand medical concepts in simple terms
4. Suggest when to seek professional medical care
5. Promote healthy lifestyle choices

IMPORTANT GUIDELINES:
- Always emphasize that you are not a replacement for professional medical advice
- Encourage users to consult healthcare providers for serious concerns
- Provide information in a clear, empathetic, and non-alarming manner
- Focus on general health education rather than specific diagnoses
- Include disclaimers when appropriate

Respond in a helpful, caring tone while maintaining medical accuracy.`;

export class GeminiService {
  private model: any;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!genAI && !!apiKey;
    
    if (this.isConfigured && genAI) {
      this.model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        safetySettings,
        generationConfig,
        systemInstruction: HEALTH_SYSTEM_PROMPT,
      });
    }
  }

  /**
   * Check if Gemini is properly configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Generate a health-related response
   */
  async generateHealthResponse(question: string, context?: string): Promise<string> {
    if (!this.isConfigured || !this.model) {
      throw new Error('Gemini API is not configured. Please check your API key.');
    }

    try {
      const prompt = context 
        ? `Context: ${context}\n\nQuestion: ${question}`
        : question;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('No response generated from Gemini');
      }

      return text;
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      throw new Error('Failed to generate response from Gemini AI');
    }
  }

  /**
   * Generate a summary of health information
   */
  async generateSummary(content: string, maxLength: number = 200): Promise<string> {
    if (!this.isConfigured || !this.model) {
      throw new Error('Gemini API is not configured. Please check your API key.');
    }

    try {
      const prompt = `Please provide a concise summary of the following health information in ${maxLength} characters or less. Focus on the key points and actionable advice:\n\n${content}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || 'Unable to generate summary';
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new Error('Failed to generate summary');
    }
  }

  /**
   * Analyze symptoms and provide general guidance
   */
  async analyzeSymptoms(symptoms: string[], additionalInfo?: string): Promise<string> {
    if (!this.isConfigured || !this.model) {
      throw new Error('Gemini API is not configured. Please check your API key.');
    }

    try {
      const symptomsText = symptoms.join(', ');
      const prompt = `A person is experiencing the following symptoms: ${symptomsText}${additionalInfo ? `\n\nAdditional information: ${additionalInfo}` : ''}

Please provide:
1. General information about these symptoms
2. Possible common causes (emphasize these are possibilities, not diagnoses)
3. Self-care recommendations where appropriate
4. Clear guidance on when to seek medical attention
5. Important disclaimer about professional medical consultation

Remember to be helpful but not diagnostic, and always encourage professional medical consultation for concerning symptoms.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || 'Unable to analyze symptoms. Please consult a healthcare provider.';
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw new Error('Failed to analyze symptoms');
    }
  }

  /**
   * Generate health tips based on user profile
   */
  async generateHealthTips(userProfile: {
    age?: number;
    gender?: string;
    conditions?: string[];
    lifestyle?: string;
  }): Promise<string> {
    if (!this.isConfigured || !this.model) {
      throw new Error('Gemini API is not configured. Please check your API key.');
    }

    try {
      const profileText = Object.entries(userProfile)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');

      const prompt = `Based on the following user profile, provide personalized health tips and recommendations:

${profileText}

Please provide:
1. Lifestyle recommendations
2. Preventive care suggestions
3. Wellness tips specific to their profile
4. General health maintenance advice

Keep the advice practical, evidence-based, and encouraging.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || 'Unable to generate personalized tips. Focus on a balanced diet, regular exercise, and adequate sleep.';
    } catch (error) {
      console.error('Error generating health tips:', error);
      throw new Error('Failed to generate health tips');
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export configuration status
export const isGeminiConfigured = geminiService.isReady();
