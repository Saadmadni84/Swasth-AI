import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { question, type = 'general', context, userProfile } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'No question provided' },
        { status: 400 }
      );
    }

    // Check if Gemini is configured
    if (!geminiService.isReady()) {
      return NextResponse.json(
        { error: 'Gemini AI is not configured. Please check the API key.' },
        { status: 500 }
      );
    }

    let response: string;
    
    try {
      switch (type) {
        case 'symptoms':
          const symptoms = Array.isArray(question) ? question : [question];
          response = await geminiService.analyzeSymptoms(symptoms, context);
          break;
          
        case 'health-tips':
          response = await geminiService.generateHealthTips(userProfile || {});
          break;
          
        case 'summary':
          response = await geminiService.generateSummary(question, context?.maxLength || 200);
          break;
          
        default:
          response = await geminiService.generateHealthResponse(question, context);
      }

      // Generate a summary if the response is long
      let summary = response;
      if (response.length > 300) {
        try {
          summary = await geminiService.generateSummary(response, 200);
        } catch (summaryError) {
          console.warn('Failed to generate summary:', summaryError);
          // Use first 200 characters as fallback
          summary = response.substring(0, 200) + '...';
        }
      }

      return NextResponse.json({
        response,
        summary,
        type,
        timestamp: new Date().toISOString(),
        source: 'gemini-2.0-flash'
      });

    } catch (aiError) {
      console.error('Gemini AI Error:', aiError);
      return NextResponse.json(
        { 
          error: 'Failed to generate AI response',
          details: aiError instanceof Error ? aiError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in /api/gemini:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check for Gemini service
export async function GET() {
  return NextResponse.json({
    service: 'Gemini AI',
    model: 'gemini-2.0-flash-exp',
    configured: geminiService.isReady(),
    endpoints: {
      general: 'POST with { question, type: "general" }',
      symptoms: 'POST with { question: [symptoms], type: "symptoms", context }',
      healthTips: 'POST with { type: "health-tips", userProfile }',
      summary: 'POST with { question: content, type: "summary", context: { maxLength } }'
    },
    timestamp: new Date().toISOString()
  });
}
