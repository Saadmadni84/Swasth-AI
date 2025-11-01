'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiabetesWithAnatomy from './DiabetesWithAnatomy';
import HeartDiseaseWithVisualization from './HeartDiseaseWithVisualization';
import ParkinsonsForm from './ParkinsonsForm';

const DiseaseTabs = () => {
  const [activeTab, setActiveTab] = useState('diabetes');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const tabs = [
    { 
      id: 'diabetes', 
      label: 'Diabetes', 
      icon: '🩺',
      color: 'blue',
      description: 'AI-powered diabetes risk assessment with 3D visualization',
      component: <DiabetesWithAnatomy />
    },
    { 
      id: 'heart', 
      label: 'Heart Disease', 
      icon: '❤️',
      color: 'red',
      description: 'Cardiovascular risk analysis using advanced algorithms',
      component: <HeartDiseaseWithVisualization />
    },
    { 
      id: 'parkinsons', 
      label: 'Parkinson\'s', 
      icon: '🧠',
      color: 'purple',
      description: 'Voice-based Parkinson\'s disease detection system',
      component: <ParkinsonsForm />
    },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsTransitioning(false);
    }, 150);
  };

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        active: 'bg-blue-600 text-white shadow-lg shadow-blue-600/25',
        inactive: 'text-blue-600 hover:bg-blue-50 border-blue-100',
        border: 'border-blue-200'
      },
      red: {
        active: 'bg-red-600 text-white shadow-lg shadow-red-600/25',
        inactive: 'text-red-600 hover:bg-red-50 border-red-100',
        border: 'border-red-200'
      },
      purple: {
        active: 'bg-purple-600 text-white shadow-lg shadow-purple-600/25',
        inactive: 'text-purple-600 hover:bg-purple-50 border-purple-100',
        border: 'border-purple-200'
      }
    };
    return colors[color] || colors.blue;
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const colorClasses = getColorClasses(tab.color, isActive);
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  isActive
                    ? colorClasses.active
                    : `bg-white ${colorClasses.inactive} hover:shadow-lg`
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600"
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{tab.icon}</span>
                    <h3 className="font-bold text-lg">{tab.label}</h3>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                  <p className={`text-sm ${
                    isActive ? 'text-white/90' : 'text-gray-600'
                  }`}>
                    {tab.description}
                  </p>
                </div>
                
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Indicator */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              getColorClasses(activeTabData?.color, true).active
            }`}>
              <span className="text-2xl">{activeTabData?.icon}</span>
            </div>
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-gray-900 mb-1">
              {activeTabData?.label} Assessment
            </h4>
            <p className="text-sm text-gray-600">
              {activeTabData?.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              {activeTabData?.component}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Loading Overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-2xl"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Switching assessment...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <div className="text-lg font-bold text-green-800">Instant</div>
          <div className="text-sm text-green-600">Results in seconds</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🎯</div>
          <div className="text-lg font-bold text-blue-800">95% Accuracy</div>
          <div className="text-sm text-blue-600">Clinically validated</div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-lg font-bold text-purple-800">Secure</div>
          <div className="text-sm text-purple-600">HIPAA compliant</div>
        </div>
      </motion.div>
    </div>
  );
};

export default DiseaseTabs;
