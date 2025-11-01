// /app/api/auth/config/route.js
import { NextResponse } from 'next/server'
import { getSupabaseConfigStatus } from '@/lib/supabaseClient'

export async function GET() {
  try {
    const configStatus = getSupabaseConfigStatus()
    
    return NextResponse.json({
      ...configStatus,
      message: configStatus.configured 
        ? 'Supabase is properly configured' 
        : 'Supabase configuration is missing or invalid',
      instructions: configStatus.configured 
        ? null 
        : {
          step1: 'Go to https://supabase.com/dashboard',
          step2: 'Select your project (or create a new one)',
          step3: 'Go to Settings → API',
          step4: 'Copy the Project URL and set it as NEXT_PUBLIC_SUPABASE_URL',
          step5: 'Copy the anon public key and set it as NEXT_PUBLIC_SUPABASE_ANON_KEY',
          step6: 'Create a .env.local file in your project root with these values',
          step7: 'Restart your development server'
        }
    })
  } catch (error) {
    console.error('Config status error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check configuration status',
        configured: false 
      },
      { status: 500 }
    )
  }
}
