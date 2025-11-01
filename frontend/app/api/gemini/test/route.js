// /app/api/gemini/test/route.js
import { NextResponse } from 'next/server';

// This is a test endpoint to verify Gemini API connection
export async function GET() {
  try {
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'GEMINI_API_KEY environment variable is not set',
          details: 'Please set the GEMINI_API_KEY in your .env.local file'
        },
        { status: 500 }
      );
    }

    // Simple test prompt
    const testPrompt = 'Say "Hello from Gemini"';
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to connect to Gemini API');
    }

    const data = await response.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Gemini API',
      response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No text response'
    });

  } catch (error) {
    console.error('Gemini API test error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to Gemini API',
        details: error.message,
        help: 'Please check your GEMINI_API_KEY and internet connection'
      },
      { status: 500 }
    );
  }
}
