import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const { prompt = 'Hello Gemini!' } = await request.json();
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro'});
    
    // Generate content
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }]
    });
    
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ success: true, response: text });
    
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate AI response',
        details: error.message,
        ...(error.response?.data ? { apiError: error.response.data } : {})
      },
      { status: 500 }
    );
  }
}
