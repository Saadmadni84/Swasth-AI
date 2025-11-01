"use client";

import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function HeartDiseaseWithSimulation() {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHypertension, setShowHypertension] = useState(true);

  // Three.js refs
  const mountRef = useRef(null);
  const vesselRef = useRef(null);
  const bloodCellsRef = useRef([]);
  const animationRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await fetch("http://127.0.0.1:5000/predict/heart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numericData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to get prediction");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Error making prediction");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    controlsRef.current = controls;

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  // Update simulation when showHypertension changes
  useEffect(() => {
    if (!sceneRef.current || !vesselRef.current) return;

    // Update vessel appearance based on hypertension state
    const vessel = vesselRef.current;
    const targetRadius = showHypertension ? 4.8 : 8; // 8 is the normal radius
    const targetColor = showHypertension ? 0xff0000 : 0x0000ff;
    
    vessel.material.color.lerp(new THREE.Color(targetColor), 0.1);
    
    // Update blood cell behavior
    bloodCellsRef.current.forEach(cell => {
      const turbulence = showHypertension ? 0.3 : 0.0;
      cell.userData.turbulence = turbulence;
    });
    
  }, [showHypertension]);

  // Create/update blood vessel and cells when result changes
  useEffect(() => {
    if (!sceneRef.current || !result || result.prediction !== 1) return;

    const scene = sceneRef.current;
    
    // Remove existing vessel and cells
    if (vesselRef.current) scene.remove(vesselRef.current);
    bloodCellsRef.current.forEach(cell => scene.remove(cell));
    bloodCellsRef.current = [];

    // Create blood vessel
    const vesselRadius = 8;
    const vesselLength = 40;
    const vesselGeometry = new THREE.CylinderGeometry(
      vesselRadius, 
      vesselRadius, 
      vesselLength, 
      32
    );
    
    const vesselMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0000ff, 
      transparent: true, 
      opacity: 0.3, 
      side: THREE.DoubleSide 
    });
    
    const vessel = new THREE.Mesh(vesselGeometry, vesselMaterial);
    vessel.rotation.z = Math.PI / 2;
    scene.add(vessel);
    vesselRef.current = vessel;

    // Create blood cells
    const bloodCellGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const bloodCellMat = new THREE.MeshStandardMaterial({ 
      color: 0xff0000,
      roughness: 0.3,
      metalness: 0.7
    });

    const bloodCells = [];
    const cellCount = 50;
    
    for (let i = 0; i < cellCount; i++) {
      const cell = new THREE.Mesh(bloodCellGeom, bloodCellMat);
      
      // Position cells randomly within the vessel
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * vesselRadius * 0.8;
      cell.position.x = Math.random() * vesselLength - vesselLength / 2;
      cell.position.y = Math.cos(angle) * radius;
      cell.position.z = Math.sin(angle) * radius;
      
      // Add some random velocity
      cell.userData = {
        velocity: new THREE.Vector3(
          Math.random() * 0.5 + 2.5,  // Forward speed
          (Math.random() - 0.5) * 0.5, // Vertical movement
          (Math.random() - 0.5) * 0.5  // Horizontal movement
        ),
        turbulence: 0.0
      };
      
      scene.add(cell);
      bloodCells.push(cell);
    }
    
    bloodCellsRef.current = bloodCells;

    // Animation loop for blood cells
    const clock = new THREE.Clock();
    
    const animateBloodCells = () => {
      if (!sceneRef.current) return;
      
      const delta = clock.getDelta();
      const vessel = vesselRef.current;
      
      bloodCellsRef.current.forEach(cell => {
        // Update position
        cell.position.x += cell.userData.velocity.x * delta * (showHypertension ? 1.5 : 1.0);
        cell.position.y += cell.userData.velocity.y * delta;
        cell.position.z += cell.userData.velocity.z * delta;
        
        // Add turbulence in hypertension mode
        if (showHypertension) {
          cell.position.y += (Math.random() - 0.5) * cell.userData.turbulence;
          cell.position.z += (Math.random() - 0.5) * cell.userData.turbulence;
        }
        
        // Wrap around if outside vessel length
        if (cell.position.x > vesselLength / 2) {
          cell.position.x = -vesselLength / 2;
        } else if (cell.position.x < -vesselLength / 2) {
          cell.position.x = vesselLength / 2;
        }
        
        // Keep cells inside vessel
        const radius = Math.sqrt(cell.position.y ** 2 + cell.position.z ** 2);
        const maxRadius = vessel.scale.x * (showHypertension ? 4.8 : 8);
        
        if (radius > maxRadius * 0.9) {
          const factor = (maxRadius * 0.9) / radius;
          cell.position.y *= factor;
          cell.position.z *= factor;
          
          // Bounce effect
          if (showHypertension) {
            cell.userData.velocity.y *= -0.5;
            cell.userData.velocity.z *= -0.5;
          }
        }
      });
      
      // Update vessel appearance based on hypertension state
      if (vessel) {
        const targetRadius = showHypertension ? 4.8 : 8;
        vessel.scale.x = THREE.MathUtils.lerp(
          vessel.scale.x, 
          targetRadius / 8, 
          0.05
        );
        vessel.scale.y = vessel.scale.x;
      }
      
      animationRef.current = requestAnimationFrame(animateBloodCells);
    };
    
    animateBloodCells();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
    
  }, [result, showHypertension]);

  // Form field definitions
  const formFields = [
    { name: "age", label: "Age", type: "number", step: "1", min: "0" },
    { name: "sex", label: "Sex", type: "select", options: [
        { value: "0", label: "Female" }, 
        { value: "1", label: "Male" }
      ] 
    },
    { 
      name: "cp", 
      label: "Chest Pain Type", 
      type: "select", 
      options: [
        { value: "0", label: "Typical Angina" },
        { value: "1", label: "Atypical Angina" },
        { value: "2", label: "Non-anginal Pain" },
        { value: "3", label: "Asymptomatic" },
      ]
    },
    { name: "trestbps", label: "Resting BP (mm Hg)", type: "number", step: "1", min: "0" },
    { name: "chol", label: "Cholesterol (mg/dl)", type: "number", step: "1", min: "0" },
    { 
      name: "fbs", 
      label: "Fasting Blood Sugar > 120 mg/dl", 
      type: "select", 
      options: [
        { value: "0", label: "No" }, 
        { value: "1", label: "Yes" }
      ] 
    },
    { 
      name: "restecg", 
      label: "Resting ECG Results", 
      type: "select", 
      options: [
        { value: "0", label: "Normal" },
        { value: "1", label: "ST-T Wave Abnormality" },
        { value: "2", label: "Left Ventricular Hypertrophy" },
      ]
    },
    { name: "thalach", label: "Max Heart Rate Achieved", type: "number", step: "1", min: "0" },
    { 
      name: "exang", 
      label: "Exercise Induced Angina", 
      type: "select", 
      options: [
        { value: "0", label: "No" }, 
        { value: "1", label: "Yes" }
      ] 
    },
    { name: "oldpeak", label: "ST Depression Induced by Exercise", type: "number", step: "0.1", min: "0" },
    { 
      name: "slope", 
      label: "Slope of Peak Exercise ST Segment", 
      type: "select", 
      options: [
        { value: "0", label: "Upsloping" }, 
        { value: "1", label: "Flat" }, 
        { value: "2", label: "Downsloping" }
      ] 
    },
    { name: "ca", label: "Number of Major Vessels (0-3)", type: "number", step: "1", min: "0", max: "3" },
    { 
      name: "thal", 
      label: "Thalassemia", 
      type: "select", 
      options: [
        { value: "1", label: "Normal" }, 
        { value: "2", label: "Fixed Defect" }, 
        { value: "3", label: "Reversible Defect" }
      ] 
    },
  ];

  const renderInput = (field) => {
    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select {field.label}</option>
          {field.options.map((opt) => (
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
        value={formData[field.name]}
        onChange={handleChange}
        step={field.step}
        min={field.min}
        max={field.max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Heart Disease Risk Assessment</h1>
          <p className="text-blue-100">Complete the form to assess your heart disease risk</p>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          {/* Prediction Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields.map((field) => (
                <div key={field.name} className="space-y-1">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {renderInput(field)}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Predicting...
                  </span>
                ) : (
                  'Predict Heart Disease Risk'
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prediction Result */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${result.prediction === 1 ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.prediction === 1 ? (
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">
                    {result.prediction === 1 ? 'High Risk of Heart Disease' : 'Low Risk of Heart Disease'}
                  </h3>
                  <div className="mt-2 text-sm">
                    <p>
                      {result.prediction === 1
                        ? 'Based on the provided information, there is a high risk of heart disease. Please consult with a healthcare professional for further evaluation.'
                        : 'Based on the provided information, there is a low risk of heart disease. Maintain a healthy lifestyle for continued well-being.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3D Simulation */}
          {result && result.prediction === 1 && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Blood Vessel Simulation</h3>
                  <p className="text-sm text-gray-500">
                    Visualizing blood flow under {showHypertension ? 'hypertensive' : 'normal'} conditions
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowHypertension(!showHypertension)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      showHypertension
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {showHypertension ? 'View Normal' : 'View Hypertension'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const canvas = mountRef.current?.querySelector('canvas');
                      if (canvas) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          canvas.requestFullscreen().catch(console.error);
                        }
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      Fullscreen
                    </span>
                  </button>
                </div>
              </div>
              
              <div 
                ref={mountRef}
                className="w-full h-[500px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-inner"
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6 max-w-md">
                    <div className="animate-pulse">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Loading 3D Simulation</h3>
                    <p className="mt-1 text-sm text-gray-500">The interactive 3D visualization is being prepared.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Understanding the Simulation</h4>
                <p className="mt-1 text-sm text-blue-700">
                  This simulation shows how blood flows through vessels under {showHypertension ? 'hypertensive' : 'normal'} conditions. 
                  {showHypertension 
                    ? ' The red, constricted vessel and turbulent blood flow represent the increased pressure and stress on the cardiovascular system.'
                    : ' The blue vessel shows normal blood flow with minimal resistance.'}
                </p>
                <p className="mt-2 text-xs text-blue-600">
                  <strong>Tip:</strong> Click and drag to rotate the view. Scroll to zoom in/out. Use the toggle button to compare conditions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>For educational purposes only. Consult a healthcare professional for medical advice.</p>
      </div>
    </div>
  );
}
