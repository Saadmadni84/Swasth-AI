import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/gemini';

// Health check endpoint
export async function GET() {
  const mlBackendUrl = process.env.ML_API_URL || 'http://127.0.0.1:5001';
  
  // Check ML backend status
  let mlBackendStatus = 'unknown';
  try {
    const response = await fetch(`${mlBackendUrl}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    mlBackendStatus = response.ok ? 'online' : 'error';
  } catch (error) {
    mlBackendStatus = 'offline';
  }

  return NextResponse.json({
    status: 'healthy',
    message: 'SwasthAI API is running',
    timestamp: new Date().toISOString(),
    services: {
      gemini: {
        configured: geminiService.isReady(),
        model: 'gemini-2.0-flash-exp'
      },
      aixplain: {
        configured: !!(process.env.TEAM_API_KEY && process.env.AGENT_MODEL_ID)
      },
      mlBackend: {
        status: mlBackendStatus,
        url: mlBackendUrl,
        endpoints: [
          '/predict/diabetes - Diabetes risk prediction',
          '/predict/heart - Heart disease prediction',
          '/predict/parkinsons - Parkinsons prediction'
        ]
      }
    },
    endpoints: [
      '/api/ask - Primary AI endpoint with Gemini + aiXplain fallback',
      '/api/gemini - Direct Gemini AI endpoint',
      '/api/doctors - Doctor discovery',
      '/api/health-centers - Health centers locator',
      '/api/news - Health news',
      '/api/predict/diabetes - ML diabetes prediction',
      '/api/predict/heart - ML heart disease prediction',
      '/api/infer - Unified ML inference endpoint'
    ]
  });
}
