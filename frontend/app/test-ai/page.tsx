'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import DiseaseTabs from '@/components/DiseaseTabs';
import MediBot from '@/components/MediBot';

export default function TestAIPage() {
  const topRef = useRef<HTMLDivElement>(null);

  // Force scroll to top immediately before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also scroll the ref into view
    topRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, []);

  // Scroll to top on page load - with multiple attempts
  useEffect(() => {
    // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Multiple scroll attempts
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      topRef.current?.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    
    scrollToTop();
    
    // Backup scrolls at different intervals
    const timers = [10, 50, 100, 300, 500, 1000, 1600].map(delay =>
      setTimeout(scrollToTop, delay)
    );
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <>
      {/* Invisible anchor at the very top */}
      <div ref={topRef} id="page-top" style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 1 }} />
      
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-4">
        {/* MediBot Section - Full Width */}
        <div className="mb-8">
          <MediBot />
        </div>

        {/* Disease Prediction Section */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🧠 AI Disease Prediction Test</h1>
            <p className="text-gray-600 text-lg">Test our machine learning models for disease risk assessment</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Disease Risk Assessment Forms</h2>
              <p className="text-blue-100 mt-1">Fill out the forms below to test AI-powered predictions</p>
            </div>
            
            <div className="p-8">
              <DiseaseTabs />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              ⚠️ <strong>Medical Disclaimer:</strong> These predictions are for testing purposes only and should not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
