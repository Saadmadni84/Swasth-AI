// app/api/supabase-example/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        message: 'Supabase not configured',
        configured: false,
        data: null
      }, { status: 200 })
    }

    // Get cookies for server-side Supabase client
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(cookieStore)

    // Example: Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('Auth error:', userError)
    }

    // Example: Query a table (replace 'profiles' with your table name)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(10)

    return NextResponse.json({
      message: 'Supabase API route working',
      configured: true,
      user: user || null,
      profiles: profiles || [],
      errors: {
        user: userError?.message || null,
        profiles: profilesError?.message || null
      }
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({
      message: 'Internal server error',
      error: error.message,
      configured: isSupabaseConfigured()
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        message: 'Supabase not configured',
        configured: false
      }, { status: 200 })
    }

    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(cookieStore)
    const body = await request.json()

    // Example: Insert data (replace 'profiles' with your table name)
    const { data, error } = await supabase
      .from('profiles')
      .insert([body])
      .select()

    if (error) {
      return NextResponse.json({
        message: 'Database error',
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Data inserted successfully',
      data
    })

  } catch (error) {
    console.error('POST API route error:', error)
    return NextResponse.json({
      message: 'Internal server error',
      error: error.message
    }, { status: 500 })
  }
}
