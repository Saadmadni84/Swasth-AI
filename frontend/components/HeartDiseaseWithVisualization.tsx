'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import the 3D component to avoid SSR issues
const BloodVesselSimulation = dynamic(
  () => import('./three/BloodVesselSimulation'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading 3D Simulation...</p>
        </div>
      </div>
    )
  }
);

interface FormData {
  age: string;
  sex: string;
  cp: string;
  trestbps: string;
  chol: string;
  fbs: string;
  restecg: string;
  thalach: string;
  exang: string;
  oldpeak: string;
  slope: string;
  ca: string;
  thal: string;
}

interface PredictionResult {
  prediction: string;
}

export default function HeartDiseaseWithVisualization() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: ''
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNormalView, setShowNormalView] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Convert form data to numeric values
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      // Try different possible endpoints
      const endpoints = [
        'http://127.0.0.1:5000/predict/heart',
        'http://localhost:5000/predict/heart',
        '/api/predict/heart'  // Next.js API route
      ];

      let response: Response | null = null;
      let lastError: string = '';

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(numericData)
          });

          if (response.ok) {
            break; // Success, break out of loop
          } else {
            lastError = `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (fetchError) {
          lastError = fetchError instanceof Error ? fetchError.message : 'Network error';
          console.log(`Failed with ${endpoint}:`, lastError);
          continue; // Try next endpoint
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError || 'Failed to connect to prediction service');
      }

      const data: PredictionResult = await response.json();
      setResult(data);
      
      // Reset visualization to hypertension view when heart disease is detected
      if (data.prediction === 'Heart Disease') {
        setShowNormalView(false);
      }

    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  // Form field definitions
  const formFields = [
    { name: 'age', label: 'Age', type: 'number', min: '1', max: '120', step: '1' },
    { 
      name: 'sex', 
      label: 'Sex', 
      type: 'select', 
      options: [
        { value: '0', label: 'Female' }, 
        { value: '1', label: 'Male' }
      ] 
    },
    { 
      name: 'cp', 
      label: 'Chest Pain Type', 
      type: 'select', 
      options: [
        { value: '0', label: 'Typical Angina' },
        { value: '1', label: 'Atypical Angina' },
        { value: '2', label: 'Non-anginal Pain' },
        { value: '3', label: 'Asymptomatic' }
      ] 
    },
    { name: 'trestbps', label: 'Resting Blood Pressure (mm Hg)', type: 'number', min: '80', max: '250', step: '1' },
    { name: 'chol', label: 'Cholesterol (mg/dl)', type: 'number', min: '100', max: '600', step: '1' },
    { 
      name: 'fbs', 
      label: 'Fasting Blood Sugar > 120 mg/dl', 
      type: 'select', 
      options: [
        { value: '0', label: 'No' }, 
        { value: '1', label: 'Yes' }
      ] 
    },
    { 
      name: 'restecg', 
      label: 'Resting ECG Results', 
      type: 'select', 
      options: [
        { value: '0', label: 'Normal' },
        { value: '1', label: 'ST-T Wave Abnormality' },
        { value: '2', label: 'Left Ventricular Hypertrophy' }
      ] 
    },
    { name: 'thalach', label: 'Maximum Heart Rate Achieved', type: 'number', min: '60', max: '220', step: '1' },
    { 
      name: 'exang', 
      label: 'Exercise Induced Angina', 
      type: 'select', 
      options: [
        { value: '0', label: 'No' }, 
        { value: '1', label: 'Yes' }
      ] 
    },
    { name: 'oldpeak', label: 'ST Depression Induced by Exercise', type: 'number', min: '0', max: '10', step: '0.1' },
    { 
      name: 'slope', 
      label: 'Slope of Peak Exercise ST Segment', 
      type: 'select', 
      options: [
        { value: '0', label: 'Upsloping' }, 
        { value: '1', label: 'Flat' }, 
        { value: '2', label: 'Downsloping' }
      ] 
    },
    { name: 'ca', label: 'Number of Major Vessels (0-3)', type: 'number', min: '0', max: '3', step: '1' },
    { 
      name: 'thal', 
      label: 'Thalassemia', 
      type: 'select', 
      options: [
        { value: '1', label: 'Normal' }, 
        { value: '2', label: 'Fixed Defect' }, 
        { value: '3', label: 'Reversible Defect' }
      ] 
    }
  ];

  const renderInput = (field: any) => {
    if (field.type === 'select') {
      return (
        <select
          name={field.name}
          value={formData[field.name as keyof FormData]}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          required
        >
          <option value="">Select {field.label}</option>
          {field.options.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name as keyof FormData]}
        onChange={handleChange}
        min={field.min}
        max={field.max}
        step={field.step}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        required
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Heart Disease Risk Assessment</h1>
                <p className="text-blue-100 mt-1">AI-powered prediction with 3D cardiovascular visualization</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Prediction Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map((field) => (
                  <motion.div 
                    key={field.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: formFields.indexOf(field) * 0.05 }}
                  >
                    <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {renderInput(field)}
                  </motion.div>
                ))}
              </div>

              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Risk...
                    </span>
                  ) : (
                    '🫀 Predict Heart Disease Risk'
                  )}
                </motion.button>
              </div>
            </form>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Prediction Error</h3>
                      <p className="mt-2 text-sm text-red-700">{error}</p>
                      <div className="mt-3 text-xs text-red-600">
                        <p><strong>Troubleshooting:</strong></p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Make sure the ML backend is running on port 5000</li>
                          <li>Check that all form fields are filled correctly</li>
                          <li>Verify your network connection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prediction Result */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-8 p-6 rounded-xl ${
                    result.prediction === 'Heart Disease' 
                      ? 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500' 
                      : 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {result.prediction === 'Heart Disease' ? (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`text-xl font-bold ${
                        result.prediction === 'Heart Disease' ? 'text-red-800' : 'text-green-800'
                      }`}>
                        {result.prediction === 'Heart Disease' 
                          ? '⚠️ High Risk of Heart Disease Detected' 
                          : '✅ Low Risk of Heart Disease'}
                      </h3>
                      <p className={`mt-2 ${
                        result.prediction === 'Heart Disease' ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {result.prediction === 'Heart Disease'
                          ? 'Based on the provided information, our AI model indicates an elevated risk of heart disease. Please consult with a healthcare professional immediately for further evaluation and appropriate medical intervention.'
                          : 'Based on the provided information, our AI model indicates a low risk of heart disease. Continue maintaining a healthy lifestyle for optimal cardiovascular health.'}
                      </p>
                      
                      {result.prediction === 'Heart Disease' && (
                        <div className="mt-4 p-4 bg-white/60 rounded-lg">
                          <h4 className="font-semibold text-red-800 mb-2">⚕️ Recommended Next Steps:</h4>
                          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                            <li>Schedule an appointment with a cardiologist</li>
                            <li>Consider cardiac stress testing or ECG</li>
                            <li>Monitor blood pressure and cholesterol levels</li>
                            <li>Adopt heart-healthy lifestyle changes immediately</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Blood Vessel Simulation */}
            <AnimatePresence>
              {result && result.prediction === 'Heart Disease' && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: 0.3 }}
                  className="mt-10"
                >
                  <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          🩺 Interactive Cardiovascular Simulation
                        </h3>
                        <p className="text-gray-300 text-sm">
                          Visualizing blood flow under {!showNormalView ? 'hypertensive (diseased)' : 'normal'} conditions
                        </p>
                      </div>
                      <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
                        <button
                          onClick={() => setShowNormalView(!showNormalView)}
                          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                            !showNormalView
                              ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                          }`}
                        >
                          {!showNormalView ? '🔴 Hypertensive View' : '🔵 Normal View'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="rounded-xl overflow-hidden">
                      <BloodVesselSimulation
                        isHypertension={!showNormalView}
                        width={800}
                        height={500}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                        <h4 className="font-bold text-white mb-3 flex items-center">
                          <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                          Hypertensive Conditions
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• <strong>Narrowed vessels:</strong> Reduced blood flow capacity</li>
                          <li>• <strong>Increased pressure:</strong> Heart works harder to pump</li>
                          <li>• <strong>Turbulent flow:</strong> Irregular blood cell movement</li>
                          <li>• <strong>Higher resistance:</strong> Increased cardiovascular stress</li>
                        </ul>
                      </div>
                      
                      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                        <h4 className="font-bold text-white mb-3 flex items-center">
                          <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                          Normal Conditions
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-2">
                          <li>• <strong>Flexible vessels:</strong> Optimal blood flow</li>
                          <li>• <strong>Normal pressure:</strong> Efficient heart function</li>
                          <li>• <strong>Smooth flow:</strong> Regular blood cell movement</li>
                          <li>• <strong>Low resistance:</strong> Minimal cardiovascular strain</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/30">
                      <p className="text-blue-200 text-sm">
                        <strong>🎓 Educational Note:</strong> This 3D simulation demonstrates how cardiovascular conditions affect blood flow. 
                        The red, constricted visualization shows the impact of hypertension and heart disease on your circulatory system. 
                        Use the controls to explore the simulation and understand the differences between healthy and diseased states.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            ⚠️ <strong>Medical Disclaimer:</strong> This tool is for educational purposes only and should not replace professional medical advice. 
            Always consult with qualified healthcare professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}