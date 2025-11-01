"use client"

import { useEffect, useState } from 'react'

interface HydrationBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function HydrationBoundary({ children, fallback }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Clean up any browser extension attributes that cause hydration mismatches
    const cleanupExtensionAttributes = () => {
      const body = document.body
      if (body) {
        // Remove Grammarly attributes
        body.removeAttribute('data-new-gr-c-s-check-loaded')
        body.removeAttribute('data-gr-ext-installed')
        body.removeAttribute('data-gr-c-s-loaded')
        
        // Remove other common extension attributes
        body.removeAttribute('data-lastpass-icon-root')
        body.removeAttribute('data-1p-extension')
        body.removeAttribute('cz-shortcut-listen')
      }
    }

    // Run cleanup immediately
    cleanupExtensionAttributes()
    
    // Set hydrated state
    setIsHydrated(true)

    // Run cleanup again after a short delay to catch late-loading extensions
    const timeoutId = setTimeout(cleanupExtensionAttributes, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  // Show fallback during hydration
  if (!isHydrated) {
    return fallback || <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return <>{children}</>
}
