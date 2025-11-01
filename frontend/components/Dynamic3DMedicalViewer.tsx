'use client';

import React from 'react';

interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  widgetUrl: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  color: string;
  icon: string;
}

// Pre-configured medical conditions with their corresponding BioDigital widgets
const MEDICAL_CONDITIONS: Record<string, MedicalCondition> = {
  normal: {
    id: 'normal',
    name: 'Normal Anatomy',
    description: 'Healthy human anatomy with normal organ function',
    widgetUrl: 'https://human.biodigital.com/widget/?be=1Rek&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx',
    severity: 'normal',
    color: '#10B981',
    icon: '✅'
  },
  diabetes: {
    id: 'diabetes',
    name: 'Diabetes Effects',
    description: 'Anatomical changes and organ systems affected by diabetes',
    widgetUrl: 'https://human.biodigital.com/widget/?be=2S0t&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx',
    severity: 'moderate',
    color: '#EF4444',
    icon: '⚠️'
  },
  heart_disease: {
    id: 'heart_disease',
    name: 'Heart Disease',
    description: 'Cardiovascular system showing heart disease effects',
    widgetUrl: 'https://human.biodigital.com/widget/?be=1tPc&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx',
    severity: 'severe',
    color: '#DC2626',
    icon: '❤️'
  },
  hypertension: {
    id: 'hypertension',
    name: 'Hypertension',
    description: 'Blood vessel and cardiovascular changes due to high blood pressure',
    widgetUrl: 'https://human.biodigital.com/widget/?be=1L4L&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx',
    severity: 'moderate',
    color: '#F59E0B',
    icon: '💔'
  }
};

interface Dynamic3DMedicalViewerProps {
  condition: string;
  prediction?: string | null;
  title?: string;
  className?: string;
  autoSwitchBasedOnPrediction?: boolean;
}

export default function Dynamic3DMedicalViewer({
  condition,
  prediction,
  title,
  className = '',
  autoSwitchBasedOnPrediction = true
}: Dynamic3DMedicalViewerProps) {
  // Determine which condition to show
  let activeCondition = condition;
  
  if (autoSwitchBasedOnPrediction && prediction) {
    switch (prediction.toLowerCase()) {
      case 'diabetic':
      case 'diabetes':
        activeCondition = 'diabetes';
        break;
      case 'heart disease':
      case 'heart_disease':
        activeCondition = 'heart_disease';
        break;
      case 'hypertension':
      case 'high blood pressure':
        activeCondition = 'hypertension';
        break;
      default:
        activeCondition = 'normal';
    }
  }

  const medicalCondition = MEDICAL_CONDITIONS[activeCondition] || MEDICAL_CONDITIONS.normal;

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe.dynamic-medical-widget');
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) { // Safari
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) { // IE11
        (iframe as any).msRequestFullscreen();
      }
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'mild':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'moderate':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'severe':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{medicalCondition.icon}</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {title || medicalCondition.name}
            </h3>
            <p className="text-sm text-gray-600">{medicalCondition.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Condition Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityStyles(medicalCondition.severity)}`}>
            {medicalCondition.severity.charAt(0).toUpperCase() + medicalCondition.severity.slice(1)}
          </div>
          
          {/* Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            title="View in fullscreen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Fullscreen
          </button>
        </div>
      </div>

      {/* 3D Widget Container */}
      <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '60%' }}>
        <iframe
          className="dynamic-medical-widget absolute top-0 left-0 w-full h-full"
          src={medicalCondition.widgetUrl}
          title={`BioDigital Human Widget - ${medicalCondition.name}`}
          allowFullScreen
          loading="lazy"
          style={{ border: 'none' }}
        />
      </div>

      {/* Information Panel */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Medical Information
        </h4>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            <strong>Condition:</strong> {medicalCondition.name}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Severity Level:</strong> {medicalCondition.severity.charAt(0).toUpperCase() + medicalCondition.severity.slice(1)}
          </p>
          {prediction && (
            <p className="text-sm text-gray-700">
              <strong>Prediction Result:</strong> {prediction}
            </p>
          )}
        </div>

        <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-xs text-blue-800">
            <strong>Disclaimer:</strong> This 3D visualization is for educational purposes only. 
            Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
          </p>
        </div>

        {medicalCondition.severity !== 'normal' && (
          <div className="mt-3 p-3 bg-amber-50 rounded border-l-4 border-amber-400">
            <p className="text-xs text-amber-800">
              <strong>Recommendation:</strong> If you have concerns about this condition, 
              please schedule an appointment with your healthcare provider for proper evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Export the medical conditions for use in other components
export { MEDICAL_CONDITIONS };
export type { MedicalCondition };