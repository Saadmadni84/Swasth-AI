'use client';

interface SwasthAILogoProps {
  variant?: 'cross' | 'heart' | 'stethoscope' | 'dna' | 'shield' | 'pulse' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customImageSrc?: string;
}

export default function SwasthAILogo({ 
  variant = 'heart', 
  size = 'md',
  className = '',
  customImageSrc 
}: SwasthAILogoProps) {
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSize = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // Custom image logo
  if (variant === 'custom' && customImageSrc) {
    return (
      <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden ${className}`}>
        <img 
          src={customImageSrc} 
          alt="SwasthAI Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      {variant === 'cross' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-4/5 h-1 bg-white rounded-full" />
          <div className="absolute w-1 h-4/5 bg-white rounded-full" />
        </div>
      )}

      {variant === 'heart' && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Heart with Cross */}
          <svg className={`${iconSize[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          {/* Medical cross overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-0.5 bg-cyan-200 rounded-full" />
            <div className="absolute w-0.5 h-3 bg-cyan-200 rounded-full" />
          </div>
        </div>
      )}

      {variant === 'stethoscope' && (
        <svg className={`${iconSize[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </svg>
      )}

      {variant === 'dna' && (
        <svg className={`${iconSize[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.5 2C7.01 2 5 4.01 5 6.5S7.01 11 9.5 11s4.5-2.01 4.5-4.5S11.99 2 9.5 2zm0 7C8.12 9 7 7.88 7 6.5S8.12 4 9.5 4s2.5 1.12 2.5 2.5S10.88 9 9.5 9zm5 4c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          <path d="M9.5 13c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm5-5c-.83 0-1.5.67-1.5 1.5S13.67 11 14.5 11s1.5-.67 1.5-1.5S15.33 8 14.5 8z"/>
        </svg>
      )}

      {variant === 'shield' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className={`${iconSize[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 16l-5-5 1.41-1.41L11 15.17l7.59-7.59L20 9l-9 9z"/>
          </svg>
        </div>
      )}

      {variant === 'pulse' && (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg className={`${iconSize[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
            <path d="M3 13h2l2-4 4 8 2-4h8v-2h-9l-1 2-4-8-2 4H3z"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// Export specific logo variants for easy use
export const MedicalCrossLogo = (props: Omit<SwasthAILogoProps, 'variant'>) => 
  <SwasthAILogo {...props} variant="cross" />;

export const HeartLogo = (props: Omit<SwasthAILogoProps, 'variant'>) => 
  <SwasthAILogo {...props} variant="heart" />;

export const StethoscopeLogo = (props: Omit<SwasthAILogoProps, 'variant'>) => 
  <SwasthAILogo {...props} variant="stethoscope" />;

export const DNALogo = (props: Omit<SwasthAILogoProps, 'variant'>) => 
  <SwasthAILogo {...props} variant="dna" />;

export const ShieldLogo = (props: Omit<SwasthAILogoProps, 'variant'>) => 
  <SwasthAILogo {...props} variant="shield" />;

export const PulseLogo = (props: Omit<SwasthAILogoProps, 'variant'>) => 
  <SwasthAILogo {...props} variant="pulse" />;