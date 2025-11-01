// /app/api/auth/signup/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseServerClient, getSupabaseConfigStatus } from '@/lib/supabaseClient'

export async function POST(request) {
  try {
    // Check Supabase configuration first
    const configStatus = getSupabaseConfigStatus()
    if (!configStatus.configured) {
      return NextResponse.json(
        { 
          error: 'Supabase not configured',
          details: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables',
          configStatus 
        },
        { status: 500 }
      )
    }

    const { email, password, fullName } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createSupabaseServerClient(cookieStore)

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // If user is created and confirmed, create profile
    if (authData.user && !authError) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail the signup if profile creation fails
      }
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: authData.user,
      session: authData.session,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
