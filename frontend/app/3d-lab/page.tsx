'use client'

import React, { useMemo, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { infer, InferenceType } from '@/lib/ml'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
      <p className="text-gray-600 text-sm">Loading component...</p>
    </div>
  </div>
)

// Dynamically import components with lazy loading - only load when needed
const HeartDiseaseWithVisualization = dynamic(
  () => import('@/components/HeartDiseaseWithVisualization'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

const BloodVesselSimulation = dynamic(
  () => import('@/components/three/BloodVesselSimulation'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

const DiabetesWithAnatomy = dynamic(
  () => import('@/components/DiabetesWithAnatomy'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

const ThreeScene = dynamic(
  () => import('@/components/three/ThreeScene'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

type ViewMode = 'ml-inference' | 'heart-disease' | 'blood-vessel' | 'diabetes'

export default function LabPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('heart-disease')
  const [type, setType] = useState<InferenceType>('heart')
  const [payload, setPayload] = useState<string>(JSON.stringify({
    // Example payload for heart model
    age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233,
    fbs: 1, restecg: 0, thalach: 150, exang: 0,
    oldpeak: 2.3, slope: 0, ca: 0, thal: 1
  }, null, 2))
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [isHypertension, setIsHypertension] = useState(true)

  const modelUrl = useMemo(() => '/models/your-model.glb', [])

  const onInfer = React.useCallback(async () => {
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const data = JSON.parse(payload)
      const res = await infer(type, data)
      setResult(res)
    } catch (e: any) {
      setError(e?.message || 'Inference error')
    } finally {
      setLoading(false)
    }
  }, [payload, type])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">🧬 3D Medical Laboratory</h1>
                <p className="text-blue-100 mt-1">Advanced 3D visualization and AI-powered medical predictions</p>
              </div>
              
              {/* View Mode Selector */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('heart-disease')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'heart-disease'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🫀 Heart Disease
                </button>
                <button
                  onClick={() => setViewMode('blood-vessel')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'blood-vessel'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🩸 Blood Vessel
                </button>
                <button
                  onClick={() => setViewMode('diabetes')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'diabetes'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🩺 Diabetes
                </button>
                <button
                  onClick={() => setViewMode('ml-inference')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'ml-inference'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  🤖 ML Testing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        <Suspense fallback={<LoadingSpinner />}>
          {viewMode === 'heart-disease' && (
            <div className="animate-in fade-in duration-300">
              <HeartDiseaseWithVisualization />
            </div>
          )}
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          {viewMode === 'blood-vessel' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    🩺 Blood Vessel Simulation
                  </h2>
                  <p className="text-gray-600">
                    Interactive 3D visualization of blood flow under different conditions
                  </p>
                </div>
                <div className="mt-4 lg:mt-0 flex gap-3">
                  <button
                    onClick={() => setIsHypertension(!isHypertension)}
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      isHypertension
                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    {isHypertension ? '🔴 Hypertensive View' : '🔵 Normal View'}
                  </button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden">
                <BloodVesselSimulation
                  isHypertension={isHypertension}
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                  <h3 className="font-bold text-red-800 mb-3 flex items-center">
                    <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                    Hypertensive Conditions
                  </h3>
                  <ul className="text-red-700 text-sm space-y-2">
                    <li>• <strong>Narrowed vessels:</strong> Reduced blood flow capacity</li>
                    <li>• <strong>Increased pressure:</strong> Heart works harder to pump</li>
                    <li>• <strong>Turbulent flow:</strong> Irregular blood cell movement</li>
                    <li>• <strong>Higher resistance:</strong> Increased cardiovascular stress</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                    <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                    Normal Conditions
                  </h3>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• <strong>Flexible vessels:</strong> Optimal blood flow</li>
                    <li>• <strong>Normal pressure:</strong> Efficient heart function</li>
                    <li>• <strong>Smooth flow:</strong> Regular blood cell movement</li>
                    <li>• <strong>Low resistance:</strong> Minimal cardiovascular strain</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          )}
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          {viewMode === 'diabetes' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  🩺 Diabetes Risk Assessment & Visualization
                </h2>
                <p className="text-gray-600">
                  Comprehensive diabetes prediction with 3D anatomical visualization
                </p>
              </div>
              
              <DiabetesWithAnatomy />
            </div>
          </div>
          )}
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          {viewMode === 'ml-inference' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">🤖 ML Model Testing</h2>
              
              <ThreeScene modelUrl={modelUrl} />

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model Type</label>
                    <select
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={type}
                      onChange={(e) => setType(e.target.value as InferenceType)}
                    >
                      <option value="heart">Heart Disease</option>
                      <option value="diabetes">Diabetes</option>
                      <option value="parkinsons">Parkinson's</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Input Data (JSON)</label>
                    <textarea
                      className="w-full h-64 rounded-lg border border-gray-300 p-4 font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={payload}
                      onChange={(e) => setPayload(e.target.value)}
                      placeholder="Enter JSON data for prediction..."
                    />
                  </div>

                  <button
                    onClick={onInfer}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running Inference...
                      </span>
                    ) : (
                      '🧠 Run ML Prediction'
                    )}
                  </button>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Inference Error</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Prediction Result</label>
                    <div className="w-full h-64 overflow-auto rounded-lg border border-gray-300 p-4 bg-gray-50">
                      {result ? (
                        <pre className="text-sm text-gray-800">{JSON.stringify(result, null, 2)}</pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-2 text-sm">No prediction result yet</p>
                            <p className="text-xs text-gray-400">Run an inference to see results</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Setup Tips</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Make sure ML backend is running on port 5000</li>
                      <li>• Check that the required Python packages are installed</li>
                      <li>• Place 3D models in public/models/ directory</li>
                      <li>• Use valid JSON format for input data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}