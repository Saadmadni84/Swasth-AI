'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dynamic3DMedicalViewer from './Dynamic3DMedicalViewer';

const HeartDiseaseForm = () => {
  const [formData, setFormData] = useState({
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

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await fetch('/api/predict/heart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setResult(data.prediction); // "Heart Disease" or "No Heart Disease"
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'sex', label: 'Sex', type: 'select', options: [{ value: 0, label: 'Female' }, { value: 1, label: 'Male' }] },
    { name: 'cp', label: 'Chest Pain Type', type: 'select', options: [
      { value: 0, label: 'Typical Angina' },
      { value: 1, label: 'Atypical Angina' },
      { value: 2, label: 'Non-anginal Pain' },
      { value: 3, label: 'Asymptomatic' }
    ]},
    { name: 'trestbps', label: 'Resting Blood Pressure (mm Hg)', type: 'number' },
    { name: 'chol', label: 'Cholesterol (mg/dl)', type: 'number' },
    { name: 'fbs', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }]},
    { name: 'restecg', label: 'Resting ECG Results', type: 'select', options: [{ value: 0, label: 'Normal' }, { value: 1, label: 'ST-T Wave Abnormality' }, { value: 2, label: 'Left Ventricular Hypertrophy' }]},
    { name: 'thalach', label: 'Maximum Heart Rate Achieved', type: 'number' },
    { name: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ value: 0, label: 'No' }, { value: 1, label: 'Yes' }]},
    { name: 'oldpeak', label: 'ST Depression Induced by Exercise', type: 'number', step: '0.1' },
    { name: 'slope', label: 'Slope of Peak Exercise ST Segment', type: 'select', options: [{ value: 0, label: 'Upsloping' }, { value: 1, label: 'Flat' }, { value: 2, label: 'Downsloping' }]},
    { name: 'ca', label: 'Number of Major Vessels (0-3)', type: 'number', min: 0, max: 3 },
    { name: 'thal', label: 'Thalassemia', type: 'select', options: [{ value: 1, label: 'Normal' }, { value: 2, label: 'Fixed Defect' }, { value: 3, label: 'Reversible Defect' }]}
  ];

  const renderInput = (field) => {
    const baseClasses = "w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500";
    
    if (field.type === 'select') {
      return (
        <select
          id={field.name}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          required
          className={`${baseClasses} ${formData[field.name] ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
        >
          <option value="">Select {field.label}</option>
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        id={field.name}
        name={field.name}
        value={formData[field.name]}
        onChange={handleChange}
        step={field.step || '1'}
        min={field.min || '0'}
        max={field.max}
        required
        placeholder={`Enter ${field.label.toLowerCase()}`}
        className={`${baseClasses} ${formData[field.name] ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
      />
    );
  };

  const progressPercentage = Math.round((Object.values(formData).filter(val => val !== '').length / formFields.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">❤️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Heart Disease Risk Assessment</h2>
            <p className="text-gray-600">AI-powered cardiovascular health analysis</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Form completion: {progressPercentage}% ({Object.values(formData).filter(val => val !== '').length}/{formFields.length} fields)
        </p>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="space-y-2"
            >
              <label 
                htmlFor={field.name} 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                {field.label}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                {renderInput(field)}
                {formData[field.name] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-100">
          <motion.button
            type="submit"
            disabled={isLoading || progressPercentage < 100}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : progressPercentage < 100
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-red-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing your heart health...</span>
              </>
            ) : progressPercentage < 100 ? (
              <>
                <span>📋</span>
                <span>Complete all fields to get prediction</span>
              </>
            ) : (
              <>
                <span>🧬</span>
                <span>Analyze Heart Disease Risk</span>
              </>
            )}
          </motion.button>
          
          {progressPercentage < 100 && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Please fill in all required fields to get an accurate prediction
            </p>
          )}
        </div>
      </motion.form>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center space-x-3"
          >
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-medium">Prediction Error</h4>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <div className={`p-6 rounded-2xl border-2 ${
              result === 'Heart Disease' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result === 'Heart Disease' ? 'bg-red-600' : 'bg-green-600'
                }`}>
                  <span className="text-2xl">
                    {result === 'Heart Disease' ? '⚠️' : '✅'}
                  </span>
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${
                    result === 'Heart Disease' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {result === 'Heart Disease' ? 'High Risk Detected' : 'Low Risk'}
                  </h3>
                  <p className={`text-sm ${
                    result === 'Heart Disease' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {result === 'Heart Disease'
                      ? 'Elevated cardiovascular risk detected'
                      : 'Heart health appears normal'
                    }
                  </p>
                </div>
              </div>
              
              <p className={`text-sm mb-4 ${
                result === 'Heart Disease' ? 'text-red-700' : 'text-green-700'
              }`}>
                {result === 'Heart Disease'
                  ? 'The AI model predicts a high risk of heart disease based on your parameters. Please consult a cardiologist for professional evaluation and treatment options.'
                  : 'The AI model predicts a low risk of heart disease based on your parameters. Continue maintaining a healthy lifestyle with regular exercise and balanced nutrition.'}
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {result === 'Heart Disease' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <span>👨‍⚕️</span>
                      <span>Find Cardiologist</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <span>📄</span>
                      <span>Download Report</span>
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <span>📈</span>
                      <span>Track Health</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white text-green-600 border border-green-200 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center space-x-2"
                    >
                      <span>🔄</span>
                      <span>Test Again</span>
                    </motion.button>
                  </>
                )}
              </div>
            </div>
            
            {/* 3D Visualization */}
            <div className="mt-8">
              <Dynamic3DMedicalViewer 
                condition="normal"
                prediction={result}
                title={`Cardiovascular System - ${result}`}
                autoSwitchBasedOnPrediction={true}
                className="w-full"
              />
              
              {result === 'Heart Disease' && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                      <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                      Risk Factors
                    </h4>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>• Elevated cholesterol levels</li>
                      <li>• High blood pressure</li>
                      <li>• Chest pain symptoms</li>
                      <li>• Abnormal heart rhythms</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center">
                      <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span>
                      Recommended Actions
                    </h4>
                    <ul className="text-orange-700 text-sm space-y-1">
                      <li>• Consult a cardiologist immediately</li>
                      <li>• Consider cardiac screening tests</li>
                      <li>• Adopt heart-healthy diet</li>
                      <li>• Regular cardiovascular exercise</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeartDiseaseForm;
