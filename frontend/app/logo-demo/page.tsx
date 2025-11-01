'use client';

import SwasthAILogo from '../../components/SwasthAILogo';
import { useState } from 'react';

export default function LogoDemo() {
  const [selectedVariant, setSelectedVariant] = useState<string>('heart');
  
  const logoVariants = [
    { 
      id: 'heart', 
      name: 'Heart + Cross', 
      description: 'Medical heart symbol with cross overlay - perfect for healthcare' 
    },
    { 
      id: 'cross', 
      name: 'Medical Cross', 
      description: 'Classic medical cross symbol - clean and professional' 
    },
    { 
      id: 'stethoscope', 
      name: 'Stethoscope', 
      description: 'Stethoscope icon - represents medical examination' 
    },
    { 
      id: 'shield', 
      name: 'Medical Shield', 
      description: 'Shield with checkmark - represents health protection' 
    },
    { 
      id: 'pulse', 
      name: 'Heart Pulse', 
      description: 'Heart with pulse line - dynamic health monitoring' 
    },
    { 
      id: 'dna', 
      name: 'DNA Helix', 
      description: 'DNA structure - represents genetic health and precision medicine' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-40 -left-32 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4">
            SwasthAI Logo Selection
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the perfect logo for your medical AI application. Click on any logo to see it in action!
          </p>
        </div>

        {/* Current Selection Preview */}
        <div className="mb-16 text-center">
          <div className="inline-block p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Current Selection</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
                <SwasthAILogo 
                  variant={selectedVariant as any} 
                  size="lg" 
                  className="scale-90" 
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  {logoVariants.find(v => v.id === selectedVariant)?.name}
                </h3>
                <p className="text-sm text-slate-300 max-w-xs">
                  {logoVariants.find(v => v.id === selectedVariant)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {logoVariants.map((variant) => (
            <div
              key={variant.id}
              onClick={() => setSelectedVariant(variant.id)}
              className={`group cursor-pointer p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                selectedVariant === variant.id
                  ? 'bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-600/20 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/25'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl'
              }`}
            >
              {/* Logo Container */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <SwasthAILogo 
                    variant={variant.id as any} 
                    size="lg" 
                    className="scale-75" 
                  />
                </div>
              </div>

              {/* Logo Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {variant.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {variant.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {selectedVariant === variant.id && (
                <div className="mt-4 flex justify-center">
                  <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full text-cyan-300 text-sm font-medium flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span>Selected</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Size Variants */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Size Variants</h2>
          <div className="flex flex-wrap justify-center items-end gap-8 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3">
                <SwasthAILogo variant={selectedVariant as any} size="sm" />
              </div>
              <p className="text-sm text-slate-300 font-medium">Small</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3">
                <SwasthAILogo variant={selectedVariant as any} size="md" />
              </div>
              <p className="text-sm text-slate-300 font-medium">Medium</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3">
                <SwasthAILogo variant={selectedVariant as any} size="lg" />
              </div>
              <p className="text-sm text-slate-300 font-medium">Large</p>
            </div>
          </div>
        </div>

        {/* Navigation Instructions */}
        <div className="text-center p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h3>
          <p className="text-slate-300 mb-6">
            Your selected logo variant is: <span className="font-bold text-cyan-300">
              {logoVariants.find(v => v.id === selectedVariant)?.name}
            </span>
          </p>
          <p className="text-sm text-slate-400">
            The logo is already applied to your navbar! Visit any page to see it in action.
            You can change the variant in the Navbar.tsx component by updating the variant prop.
          </p>
        </div>
      </div>
    </div>
  );
}