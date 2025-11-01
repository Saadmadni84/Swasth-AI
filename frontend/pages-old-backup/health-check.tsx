'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import DiseaseTabs from '../components/DiseaseTabs';
import { motion, AnimatePresence } from 'framer-motion';

const HealthCheckPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const healthStats = [
    {
      icon: '🩺',
      title: 'AI-Powered',
      description: 'Advanced machine learning models',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Get predictions in seconds',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🎯',
      title: '95% Accuracy',
      description: 'Clinically validated algorithms',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const steps = [
    {
      id: 1,
      title: 'Choose Assessment',
      description: 'Select the health condition you want to assess',
      icon: '📋'
    },
    {
      id: 2,
      title: 'Input Data',
      description: 'Provide your health parameters accurately',
      icon: '📊'
    },
    {
      id: 3,
      title: 'AI Analysis',
      description: 'Our AI analyzes your data instantly',
      icon: '🧠'
    },
    {
      id: 4,
      title: 'View Results',
      description: 'Get your personalized health insights',
      icon: '📈'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl animate-bounce">🩺</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Health Check</h2>
          <p className="text-gray-600 mb-4">Preparing your personalized health assessment...</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <span className="mr-2">🔬</span>
            AI-Powered Health Assessment
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Health
            </span>
            <br />
            Predictions
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant, AI-powered health assessments for diabetes, heart disease, and more.
            Our advanced machine learning models provide clinically accurate predictions.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('health-assessment').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-blue-600/25 hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <span>🚀</span>
              <span>Start Health Check</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 flex items-center space-x-2"
            >
              <span>📖</span>
              <span>How It Works</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {healthStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{stat.title}</h3>
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 4-step process to get your health insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent z-0" />
                )}
                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.id}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Health Assessment */}
        <motion.section
          id="health-assessment"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    🏥 Health Assessment Center
                  </h2>
                  <p className="text-blue-100">
                    Choose your assessment type and get instant AI-powered results
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="hidden sm:block w-16 h-16 bg-white/10 rounded-full flex items-center justify-center"
                >
                  <span className="text-3xl">🧬</span>
                </motion.div>
              </div>
            </div>
            
            <div className="p-8">
              <DiseaseTabs />
            </div>
          </div>
        </motion.section>

        {/* Medical Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl mr-3">⚠️</span>
            <h3 className="text-lg font-semibold text-amber-800">
              Important Medical Disclaimer
            </h3>
          </div>
          <p className="text-amber-700 text-sm max-w-4xl mx-auto">
            These AI predictions are for educational purposes only and should not replace professional medical advice.
            Always consult with qualified healthcare professionals for medical diagnosis and treatment decisions.
            The accuracy of predictions may vary based on individual factors and data quality.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default HealthCheckPage;
