// components/SupabaseConfigChecker.jsx
'use client'

import { useState, useEffect } from 'react'
import { getSupabaseConfigStatus } from '@/lib/supabaseClient'

export default function SupabaseConfigChecker() {
  const [configStatus, setConfigStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const status = getSupabaseConfigStatus()
        setConfigStatus(status)
        
        // Also check via API endpoint
        const response = await fetch('/api/auth/config')
        const apiStatus = await response.json()
        
        setConfigStatus(prev => ({
          ...prev,
          apiCheck: apiStatus
        }))
      } catch (error) {
        console.error('Failed to check Supabase config:', error)
        setConfigStatus({
          configured: false,
          error: error.message
        })
      } finally {
        setLoading(false)
      }
    }

    checkConfig()
  }, [])

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700">Checking Supabase configuration...</p>
      </div>
    )
  }

  if (!configStatus) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Failed to check Supabase configuration</p>
      </div>
    )
  }

  if (configStatus.configured) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          ✅ Supabase Configuration OK
        </h3>
        <div className="text-sm text-green-700">
          <p>• URL: {configStatus.urlValid ? '✅ Valid' : '❌ Invalid'}</p>
          <p>• Key: {configStatus.keyValid ? '✅ Valid' : '❌ Invalid'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        ❌ Supabase Not Configured
      </h3>
      
      <div className="text-sm text-red-700 mb-4">
        <p>• URL: {configStatus.url === 'missing' ? '❌ Missing' : configStatus.url === 'placeholder' ? '⚠️ Placeholder' : '✅ Set'}</p>
        <p>• Key: {configStatus.key === 'missing' ? '❌ Missing' : configStatus.key === 'placeholder' ? '⚠️ Placeholder' : '✅ Set'}</p>
      </div>

      <div className="bg-white p-3 rounded border">
        <h4 className="font-semibold text-red-800 mb-2">Quick Fix:</h4>
        <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">supabase.com/dashboard</a></li>
          <li>Select your project (or create a new one)</li>
          <li>Go to Settings → API</li>
          <li>Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root</li>
          <li>Add these lines:</li>
        </ol>
        
        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
          NEXT_PUBLIC_SUPABASE_URL=your_project_url_here<br/>
          NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
        </div>
        
        <p className="text-xs text-red-600 mt-2">
          Then restart your development server with <code className="bg-gray-200 px-1 rounded">npm run dev</code>
        </p>
      </div>
    </div>
  )
}
