// components/SupabaseExample.jsx
'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabaseClient'

export default function SupabaseExample() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check configuration and initialize client
    const initializeSupabase = async () => {
      try {
        setConfigured(isSupabaseConfigured())
        
        if (!isSupabaseConfigured()) {
          setLoading(false)
          return
        }

        const supabase = createSupabaseBrowserClient()

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
        } else {
          setUser(session?.user || null)
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user || null)
            
            if (event === 'SIGNED_IN') {
              console.log('User signed in:', session?.user?.email)
            } else if (event === 'SIGNED_OUT') {
              console.log('User signed out')
              setData([])
            }
          }
        )

        // Cleanup subscription
        return () => {
          subscription.unsubscribe()
        }

      } catch (error) {
        console.error('Supabase initialization error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    initializeSupabase()
  }, [])

  const handleSignIn = async (email, password) => {
    if (!configured) return

    try {
      setLoading(true)
      const supabase = createSupabaseBrowserClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        setError(null)
        console.log('Sign in successful:', data.user?.email)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    if (!configured) return

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
      } else {
        setUser(null)
        setData([])
        setError(null)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchData = async () => {
    if (!configured || !user) return

    try {
      setLoading(true)
      const supabase = createSupabaseBrowserClient()
      
      // Example: Fetch data from a table
      const { data: fetchedData, error } = await supabase
        .from('profiles') // Replace with your table name
        .select('*')
        .limit(10)

      if (error) {
        setError(error.message)
      } else {
        setData(fetchedData || [])
        setError(null)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!configured) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Supabase Not Configured
        </h3>
        <p className="text-yellow-700">
          Supabase environment variables are not set. The app will work in demo mode.
        </p>
        <div className="mt-4 text-sm text-yellow-600">
          <p>Required environment variables:</p>
          <ul className="list-disc list-inside mt-2">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Supabase Integration Example
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Auth Status */}
        <div className="p-3 bg-gray-50 rounded">
          <h4 className="font-medium text-gray-900 mb-2">Authentication Status</h4>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : user ? (
            <div>
              <p className="text-green-600">✅ Signed in as: {user.email}</p>
              <button
                onClick={handleSignOut}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">❌ Not signed in</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleSignIn('test@example.com', 'password')}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Demo Sign In
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Fetching */}
        {user && (
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="font-medium text-gray-900 mb-2">Data Operations</h4>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Data'}
            </button>
            
            {data.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Fetched {data.length} records:</p>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Configuration Info */}
        <div className="p-3 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-900 mb-2">Configuration</h4>
          <p className="text-sm text-blue-700">
            ✅ Supabase is properly configured and connected
          </p>
        </div>
      </div>
    </div>
  )
}
