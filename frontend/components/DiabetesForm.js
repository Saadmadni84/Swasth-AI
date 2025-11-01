'use client';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

const DiabetesForm = () => {
  const [formData, setFormData] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

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
      setResult(data.prediction);
      
      // Trigger animation for diabetic results
      if (data.prediction === 'Diabetic') {
        setShowAnimation(true);
      }
    } catch (err) {
      setError(err.message || 'Error making prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'Pregnancies', label: 'Pregnancies' },
    { name: 'Glucose', label: 'Glucose (mg/dL)' },
    { name: 'BloodPressure', label: 'Blood Pressure (mmHg)' },
    { name: 'SkinThickness', label: 'Skin Thickness (mm)' },
    { name: 'Insulin', label: 'Insulin Level (μU/ml)' },
    { name: 'BMI', label: 'BMI' },
    { name: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function' },
    { name: 'Age', label: 'Age' }
  ];

  // 3D Diabetes Visualization Component
  const DiabetesVisualization = () => {
    const [time, setTime] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(prev => prev + 0.05);
      }, 50);
      return () => clearInterval(interval);
    }, []);

    return (
      <group>
        {/* Pancreas representation */}
        <Box
          position={[0, 0, 0]}
          args={[2, 0.8, 0.4]}
          onClick={() => alert('Pancreas: Organ affected by diabetes')}
        >
          <meshStandardMaterial color="#8B4513" opacity={0.8} transparent />
        </Box>
        
        {/* Insulin molecules - reduced when diabetic */}
        {[...Array(5)].map((_, i) => (
          <Sphere
            key={i}
            position={[
              Math.sin(time + i) * 3,
              Math.cos(time + i * 0.5) * 2,
              Math.sin(time * 0.5 + i) * 1.5
            ]}
            args={[0.1]}
          >
            <meshStandardMaterial color="#FF6B6B" emissive="#FF0000" emissiveIntensity={0.3} />
          </Sphere>
        ))}
        
        {/* Blood glucose particles - elevated in diabetes */}
        {[...Array(20)].map((_, i) => (
          <Sphere
            key={`glucose-${i}`}
            position={[
              Math.sin(time * 2 + i * 0.3) * 4,
              Math.cos(time * 1.5 + i * 0.4) * 3,
              Math.sin(time * 1.8 + i * 0.2) * 2
            ]}
            args={[0.05]}
          >
            <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.4} />
          </Sphere>
        ))}
        
        {/* Warning text */}
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#FF0000"
          anchorX="center"
          anchorY="middle"
        >
          High Blood Glucose Detected
        </Text>
        
        <Text
          position={[0, -3, 0]}
          fontSize={0.3}
          color="#FF6B6B"
          anchorX="center"
          anchorY="middle"
        >
          Consult Healthcare Professional
        </Text>
      </group>
    );
  };

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe.bio-widget');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-sm font-medium text-gray-700">{f.label}</label>
              <input
                type="number"
                id={f.name}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          ))}
        </div>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          {isLoading ? 'Predicting...' : 'Predict Diabetes Risk'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      
      {/* Result Display */}
      {result && (
        <div className={`mt-6 p-6 rounded-lg ${
          result === 'Diabetic' 
            ? 'bg-red-50 border-l-4 border-red-400' 
            : 'bg-green-50 border-l-4 border-green-400'
        }`}>
          <h3 className={`text-xl font-semibold mb-2 ${
            result === 'Diabetic' ? 'text-red-800' : 'text-green-800'
          }`}>
            {result === 'Diabetic' ? '⚠️ High Risk of Diabetes' : '✅ Low Risk of Diabetes'}
          </h3>
          <p className={result === 'Diabetic' ? 'text-red-700' : 'text-green-700'}>
            {result === 'Diabetic'
              ? 'The model predicts a high risk of diabetes. Please consult a healthcare professional immediately.'
              : 'The model predicts a low risk of diabetes. Maintain a healthy lifestyle.'}
          </p>
        </div>
      )}

      {/* 3D Visualization for Diabetic Results */}
      {showAnimation && result === 'Diabetic' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-red-800 mb-4">🔬 Diabetes Visualization</h3>
          <div className="bg-black rounded-lg" style={{ height: '400px' }}>
            <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <DiabetesVisualization />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            💡 Interactive 3D model showing elevated blood glucose (gold particles) and reduced insulin production (red spheres)
          </div>
        </div>
      )}

      {/* BioDigital Widget for Diabetic Results */}
      {result === 'Diabetic' && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-red-800">🫀 Human Body - Diabetes Impact</h3>
            <button
              onClick={handleFullscreen}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              View Fullscreen
            </button>
          </div>
          
          <div className="relative w-full" style={{ paddingBottom: '75%' }}>
            <iframe
              className="bio-widget absolute top-0 left-0 w-full h-full rounded-lg shadow-lg border border-red-200"
              src="https://human.biodigital.com/widget/?be=2S0t&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx"
              title="BioDigital Human Widget - Diabetes Information"
              allowFullScreen
              loading="lazy"
            />
          </div>
          
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-800 mb-2">🩺 Understanding Your Results</h4>
            <p className="text-sm text-red-700">
              The 3D models above show how diabetes affects your body. The interactive visualization demonstrates elevated blood glucose levels and pancreatic function. 
              <strong>Please consult with a healthcare professional immediately for proper diagnosis and treatment.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiabetesForm;
