// /app/api/auth/session/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient, getSupabaseConfigStatus } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Check Supabase configuration first
    const configStatus = getSupabaseConfigStatus()
    if (!configStatus.configured) {
      return NextResponse.json(
        { 
          error: 'Supabase not configured',
          details: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables',
          configStatus,
          session: null,
          user: null
        },
        { status: 500 }
      )
    }

    const cookieStore = cookies()
    const supabase = createSupabaseServerClient(cookieStore)

    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      session,
      user: session?.user || null,
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
