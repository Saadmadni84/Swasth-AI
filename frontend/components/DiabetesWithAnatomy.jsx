"use client";

import { useState } from 'react';
import Dynamic3DMedicalViewer from './Dynamic3DMedicalViewer';

export default function DiabetesWithAnatomy() {
  const [prediction, setPrediction] = useState(null); // "Diabetic" or "Not Diabetic"
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodpressure: '',
    skinthickness: '',
    insulin: '',
    bmi: '',
    diabetespedigreefunction: '',
    age: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Map lowercase field names to capitalized names expected by the backend
      const fieldMapping = {
        pregnancies: 'Pregnancies',
        glucose: 'Glucose',
        bloodpressure: 'BloodPressure',
        skinthickness: 'SkinThickness',
        insulin: 'Insulin',
        bmi: 'BMI',
        diabetespedigreefunction: 'DiabetesPedigreeFunction',
        age: 'Age'
      };
      
      const numericData = {};
      Object.entries(formData).forEach(([key, value]) => {
        const backendKey = fieldMapping[key] || key;
        numericData[backendKey] = parseFloat(value) || 0;
      });

      const response = await fetch('/api/predict/diabetes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(numericData)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.prediction); // "Diabetic" or "Not Diabetic"
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: 'pregnancies', label: 'Pregnancies', type: 'number', step: '1', min: '0' },
    { name: 'glucose', label: 'Glucose (mg/dL)', type: 'number', step: '1', min: '0' },
    { name: 'bloodpressure', label: 'Blood Pressure (mmHg)', type: 'number', step: '1', min: '0' },
    { name: 'skinthickness', label: 'Skin Thickness (mm)', type: 'number', step: '1', min: '0' },
    { name: 'insulin', label: 'Insulin Level (μU/ml)', type: 'number', step: '1', min: '0' },
    { name: 'bmi', label: 'BMI', type: 'number', step: '0.1', min: '0' },
    { name: 'diabetespedigreefunction', label: 'Diabetes Pedigree Function', type: 'number', step: '0.001', min: '0' },
    { name: 'age', label: 'Age', type: 'number', step: '1', min: '0' }
  ];


  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      {/* Prediction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Diabetes Risk Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={field.name}>
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                step={field.step}
                min={field.min}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Predicting...' : 'Predict Diabetes Risk'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Prediction Result */}
      {prediction && (
        <div className={`mt-6 p-6 rounded-lg ${prediction === 'Diabetic' 
          ? 'bg-red-50 border-l-4 border-red-400' 
          : 'bg-green-50 border-l-4 border-green-400'}`}
        >
          <h3 className="text-xl font-semibold mb-2">
            {prediction === 'Diabetic' ? 'High Risk of Diabetes' : 'Low Risk of Diabetes'}
          </h3>
          <p className="text-gray-700">
            {prediction === 'Diabetic'
              ? 'The model predicts a high risk of diabetes. Please consult a healthcare professional.'
              : 'The model predicts a low risk of diabetes. Maintain a healthy lifestyle.'}
          </p>
        </div>
      )}

      {/* Dynamic 3D Medical Visualization - Always show, changes based on prediction */}
      <div className="mt-8">
        <Dynamic3DMedicalViewer 
          condition="normal" 
          prediction={prediction}
          title={prediction ? "Medical Visualization - " + prediction : "Normal Anatomy"}
          autoSwitchBasedOnPrediction={true}
          className="w-full"
        />
        
        {prediction && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diabetes-specific information */}
            {prediction === 'Diabetic' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                  Diabetes Risk Factors
                </h4>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• High blood glucose levels</li>
                  <li>• Pancreatic dysfunction</li>
                  <li>• Insulin resistance</li>
                  <li>• Metabolic complications</li>
                </ul>
              </div>
            )}
            
            {/* General health information */}
            <div className={`p-4 rounded-lg border ${
              prediction === 'Diabetic' 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <h4 className={`font-semibold mb-2 flex items-center ${
                prediction === 'Diabetic' ? 'text-orange-800' : 'text-green-800'
              }`}>
                <span className={`w-4 h-4 rounded-full mr-2 ${
                  prediction === 'Diabetic' ? 'bg-orange-500' : 'bg-green-500'
                }`}></span>
                {prediction === 'Diabetic' ? 'Recommended Actions' : 'Health Maintenance'}
              </h4>
              <ul className={`text-sm space-y-1 ${
                prediction === 'Diabetic' ? 'text-orange-700' : 'text-green-700'
              }`}>
                {prediction === 'Diabetic' ? (
                  <>
                    <li>• Consult an endocrinologist</li>
                    <li>• Monitor blood glucose regularly</li>
                    <li>• Follow a diabetic-friendly diet</li>
                    <li>• Maintain regular exercise</li>
                  </>
                ) : (
                  <>
                    <li>• Continue healthy lifestyle</li>
                    <li>• Regular health check-ups</li>
                    <li>• Balanced diet and exercise</li>
                    <li>• Monitor for risk factors</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
