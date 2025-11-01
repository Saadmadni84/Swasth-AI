"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the map component with no SSR
const MapComponentWithNoSSR = dynamic(() => import("./HealthCentersMapComponent"), { ssr: false })

export default function HealthCentersMap() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full rounded-lg shadow-lg flex items-center justify-center bg-gray-800">
        <p>Loading map...</p>
      </div>
    )
  }

  return <MapComponentWithNoSSR />
}

