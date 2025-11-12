/**
 * SwasthAI Hero Section Component
 * 
 * A modern, minimal hero section for healthcare AI platform.
 * Features:
 * - Responsive 2-column layout (stacks on mobile)
 * - Light/Dark theme support via CSS variables
 * - Accessible markup with WCAG AA compliance
 * - Subtle animations on load
 * - Professional typography and spacing
 * 
 * Usage:
 * import HeroSection from '@/components/HeroSection';
 * <HeroSection theme="light" /> // or theme="dark"
 * 
 * Theme can be controlled via data-theme attribute on parent or CSS class
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './HeroSection.css';

interface HeroSectionProps {
  theme?: 'light' | 'dark';
}

const HeroSection: React.FC<HeroSectionProps> = ({ theme = 'light' }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className={`hero-section ${mounted ? 'hero-mounted' : ''}`} data-theme={theme}>
      <div className="hero-container">
        {/* Left Column - Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <svg className="badge-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10.5 6L16 7L12 11L13 16L8 13.5L3 16L4 11L0 7L5.5 6L8 1Z" fill="currentColor"/>
            </svg>
            <span>AI-Powered Healthcare Platform</span>
          </div>

          <h1 className="hero-heading">
            Transform Healthcare with AI Technology
          </h1>

          <p className="hero-subtext">
            Empowering medical professionals with intelligent 3D visualizations and tailored healthcare solutions for better patient outcomes.
          </p>

          <div className="hero-cta-group">
            <button 
              className="hero-btn hero-btn-primary"
              onClick={() => router.push('/dashboard')}
              aria-label="Get started with SwasthAI"
            >
              Get Started
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 3L14 10L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button 
              className="hero-btn hero-btn-secondary"
              onClick={() => router.push('/3d-lab')}
              aria-label="Explore 3D Medical Lab"
            >
              Explore 3D Lab
            </button>
          </div>

          {/* Stats Row */}
          <div className="hero-stats">
            <div className="stat-item">
              <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="stat-content">
                <span className="stat-value">95%</span>
                <span className="stat-label">AI Accuracy</span>
              </div>
            </div>

            <div className="stat-item">
              <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="stat-content">
                <span className="stat-value">&lt; 1s</span>
                <span className="stat-label">Response Time</span>
              </div>
            </div>

            <div className="stat-item">
              <svg className="stat-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="stat-content">
                <span className="stat-value">100%</span>
                <span className="stat-label">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Visual */}
        <div className="hero-visual">
          <div className="visual-container">
            {/* Medical AI Icon Grid */}
            <div className="icon-grid">
              {/* Stethoscope */}
              <div className="icon-card" style={{ animationDelay: '0.1s' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="currentColor" fillOpacity="0.05"/>
                  <path d="M15 8C15 8 13 10 13 13V18C13 20.2091 14.7909 22 17 22C19.2091 22 21 20.2091 21 18V13C21 10 19 8 19 8M17 22V26M17 26C17 28.7614 19.2386 31 22 31H23C25.7614 31 28 28.7614 28 26V25M17 26H12M28 19C28 20.6569 26.6569 22 25 22C23.3431 22 22 20.6569 22 19C22 17.3431 23.3431 16 25 16C26.6569 16 28 17.3431 28 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Heart Rate */}
              <div className="icon-card" style={{ animationDelay: '0.2s' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="currentColor" fillOpacity="0.05"/>
                  <path d="M11 20H15L18 13L22 27L25 20H29M20 29C20 29 9 23 9 15C9 12.2386 11.2386 10 14 10C16.7614 10 18.5 11.5 20 13.5C21.5 11.5 23.2386 10 26 10C28.7614 10 31 12.2386 31 15C31 23 20 29 20 29Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Brain AI */}
              <div className="icon-card" style={{ animationDelay: '0.3s' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="currentColor" fillOpacity="0.05"/>
                  <path d="M14 16C14 13.7909 15.7909 12 18 12C18.5 12 19 12.1 19.5 12.3M26 16C26 13.7909 24.2091 12 22 12C21.5 12 21 12.1 20.5 12.3M20 12V28M14 20H12C10.8954 20 10 20.8954 10 22V24C10 25.1046 10.8954 26 12 26H14M26 20H28C29.1046 20 30 20.8954 30 22V24C30 25.1046 29.1046 26 28 26H26M14 28C14 30.2091 15.7909 32 18 32H22C24.2091 32 26 30.2091 26 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* DNA/Data */}
              <div className="icon-card" style={{ animationDelay: '0.4s' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="currentColor" fillOpacity="0.05"/>
                  <path d="M14 10C14 10 11 12 11 16C11 20 14 22 14 22M14 10C14 10 17 12 17 16C17 20 14 22 14 22M14 10V22M26 18C26 18 23 20 23 24C23 28 26 30 26 30M26 18C26 18 29 20 29 24C29 28 26 30 26 30M26 18V30M20 14L20 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Medical Chart */}
              <div className="icon-card" style={{ animationDelay: '0.5s' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="currentColor" fillOpacity="0.05"/>
                  <path d="M10 25L14 21L18 25L22 17L26 21L30 15M30 15V21M30 15H24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Shield/Security */}
              <div className="icon-card" style={{ animationDelay: '0.6s' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" opacity="0.1" fill="currentColor" fillOpacity="0.05"/>
                  <path d="M20 10L12 14V20C12 25.5 15.5 29.5 20 31C24.5 29.5 28 25.5 28 20V14L20 10ZM16 20L18.5 22.5L24 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Connection Lines - Subtle */}
            <svg className="connection-lines" viewBox="0 0 400 400" fill="none">
              <path d="M100 100 Q 200 150 300 100" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite"/>
              </path>
              <path d="M100 200 Q 200 250 300 200" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1.2s" repeatCount="indefinite"/>
              </path>
              <path d="M100 300 Q 200 250 300 300" stroke="currentColor" strokeWidth="1" opacity="0.15" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1.4s" repeatCount="indefinite"/>
              </path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
