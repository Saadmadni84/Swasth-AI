'use client';

import { useState } from 'react';

export default function GeminiConnectionTest() {
  const [testStatus, setTestStatus] = useState('not_tested'); // 'not_tested', 'testing', 'success', 'error'
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);

  const testGeminiConnection = async () => {
    setTestStatus('testing');
    setError(null);
    
    try {
      const response = await fetch('/api/gemini/test');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.details || 'Failed to connect to Gemini API');
      }
      
      setTestStatus('success');
      setTestResult(result);
    } catch (err) {
      console.error('Test failed:', err);
      setTestStatus('error');
      setError(err.message || 'An unknown error occurred');
    }
  };

  const getStatusText = () => {
    switch (testStatus) {
      case 'not_tested':
        return 'Not Tested';
      case 'testing':
        return 'Testing...';
      case 'success':
        return 'Connected ✓';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (testStatus) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'testing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Gemini API Connection Test</h2>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">API Status:</span>
          <span className={`font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {testStatus === 'not_tested' && 'Click test to check Gemini API connection'}
          {testStatus === 'testing' && 'Testing connection to Gemini API...'}
          {testStatus === 'success' && 'Successfully connected to Gemini API!'}
          {testStatus === 'error' && 'Failed to connect to Gemini API'}
        </p>
        
        <button
          onClick={testGeminiConnection}
          disabled={testStatus === 'testing'}
          className={`px-4 py-2 rounded-md text-white ${
            testStatus === 'testing' 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {testStatus === 'testing' ? 'Testing...' : 'Test Gemini API Connection'}
        </button>
      </div>
      
      {testStatus === 'success' && testResult && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-800 mb-1">Test Successful</h4>
          <p className="text-sm text-green-700">
            Gemini API Response: "{testResult.response}"
          </p>
        </div>
      )}
      
      {testStatus === 'error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="font-medium text-red-800 mb-1">Test Failed</h4>
          <p className="text-sm text-red-700">{error}</p>
          <div className="mt-2 text-xs text-red-600">
            <p>Make sure you have:</p>
            <ol className="list-disc list-inside mt-1 space-y-1">
              <li>Set the GEMINI_API_KEY in your .env.local file</li>
              <li>Restarted your development server after adding the key</li>
              <li>Have a stable internet connection</li>
            </ol>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Note: This test checks:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Gemini API endpoint availability</li>
          <li>• API key configuration</li>
          <li>• Basic AI response generation</li>
        </ul>
      </div>
    </div>
  );
}
