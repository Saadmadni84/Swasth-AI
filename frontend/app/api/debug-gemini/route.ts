// /app/api/debug-gemini/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const geminiKey = process.env.GEMINI_API_KEY;
    const publicGeminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        GEMINI_API_KEY: geminiKey ? `Set (${geminiKey.substring(0, 10)}...)` : 'Not set',
        NEXT_PUBLIC_GEMINI_API_KEY: publicGeminiKey ? `Set (${publicGeminiKey.substring(0, 10)}...)` : 'Not set',
      },
      status: {
        hasApiKey: !!(geminiKey || publicGeminiKey),
        keyFormat: (geminiKey || publicGeminiKey)?.startsWith('AIzaSy') || false,
      },
      recommendations: [] as string[]
    };

    // Add recommendations based on findings
    if (!geminiKey && !publicGeminiKey) {
      diagnostics.recommendations.push('❌ No Gemini API key found. Please set GEMINI_API_KEY and NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
    } else if (!(geminiKey || publicGeminiKey)?.startsWith('AIzaSy')) {
      diagnostics.recommendations.push('⚠️ API key format looks incorrect. Gemini API keys should start with "AIzaSy".');
    } else {
      diagnostics.recommendations.push('✅ API key configuration looks good!');
    }

    if (!geminiKey) {
      diagnostics.recommendations.push('⚠️ GEMINI_API_KEY not set (needed for server-side calls).');
    }

    if (!publicGeminiKey) {
      diagnostics.recommendations.push('⚠️ NEXT_PUBLIC_GEMINI_API_KEY not set (needed for client-side calls).');
    }

    return NextResponse.json(diagnostics);
  } catch (error) {
    return NextResponse.json({
      error: 'Diagnostic failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
