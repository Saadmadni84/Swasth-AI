"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Activity } from "lucide-react"

export default function GeminiTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error' | 'idle'
    message: string
    response?: string
  }>({ status: 'idle', message: 'Click test to check Gemini API connection' })

  const testGeminiAPI = async () => {
    setIsLoading(true)
    setTestResult({ status: 'idle', message: 'Testing Gemini API connection...' })

    try {
      // First, run diagnostics
      const diagnosticResponse = await fetch('/api/debug-gemini')
      const diagnostics = await diagnosticResponse.json()

      if (!diagnostics.status?.hasApiKey) {
        setTestResult({
          status: 'error',
          message: 'No Gemini API key found. Please set up your API key first.',
          response: `Diagnostics:\n${diagnostics.recommendations?.join('\n') || 'No recommendations available'}`
        })
        return
      }

      if (!diagnostics.status?.keyFormat) {
        setTestResult({
          status: 'error',
          message: 'Invalid API key format. Gemini keys should start with "AIzaSy".',
          response: `Current key: ${diagnostics.environment?.GEMINI_API_KEY || 'Not set'}`
        })
        return
      }

      // Test the API health endpoint
      const healthResponse = await fetch('/api/gemini', {
        method: 'GET',
      })

      if (!healthResponse.ok) {
        const healthData = await healthResponse.json()
        throw new Error(`API health check failed: ${healthData.error || 'Unknown error'}`)
      }

      // Test actual AI response
      const testResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: 'What are the symptoms of a common cold?',
          type: 'symptoms',
          context: {
            isHealthQuery: true,
            userContext: 'API test'
          }
        }),
      })

      const data = await testResponse.json()

      if (testResponse.ok && data.response) {
        setTestResult({
          status: 'success',
          message: 'Gemini API is working correctly!',
          response: data.response.substring(0, 200) + '...'
        })
      } else {
        throw new Error(data.error || 'Failed to get AI response')
      }
    } catch (error) {
      setTestResult({
        status: 'error',
        message: `Gemini API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Gemini API Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>API Status:</span>
          <Badge variant={
            testResult.status === 'success' ? 'default' : 
            testResult.status === 'error' ? 'destructive' : 
            'secondary'
          }>
            {testResult.status === 'success' && <CheckCircle className="h-4 w-4 mr-1" />}
            {testResult.status === 'error' && <XCircle className="h-4 w-4 mr-1" />}
            {testResult.status === 'idle' && <Activity className="h-4 w-4 mr-1" />}
            {testResult.status === 'success' ? 'Connected' : 
             testResult.status === 'error' ? 'Failed' : 
             'Not Tested'}
          </Badge>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">{testResult.message}</p>
          {testResult.response && (
            <div className="mt-2 p-2 bg-background rounded border">
              <p className="text-xs text-muted-foreground mb-1">Sample AI Response:</p>
              <p className="text-sm">{testResult.response}</p>
            </div>
          )}
        </div>

        <Button 
          onClick={testGeminiAPI} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Gemini API Connection'
          )}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Note:</strong> This test checks:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Gemini API endpoint availability</li>
            <li>API key configuration</li>
            <li>AI response generation</li>
            <li>Medical chatbot integration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
