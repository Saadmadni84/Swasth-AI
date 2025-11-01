import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    message: 'SwasthAI API is running on Vercel',
    timestamp: new Date().toISOString(),
    services: {
      gemini: {
        configured: geminiService.isReady(),
        model: 'gemini-2.0-flash-exp'
      },
      aixplain: {
        configured: !!(process.env.TEAM_API_KEY && process.env.AGENT_MODEL_ID)
      }
    },
    endpoints: [
      '/api/ask - Primary AI endpoint with Gemini + aiXplain fallback',
      '/api/gemini - Direct Gemini AI endpoint',
      '/api/doctors', 
      '/api/health-centers',
      '/api/news'
    ]
  });
}
