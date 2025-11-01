"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const GOOGLE_MAPS_API_KEY = ""

declare global {
  interface Window {
    initMap: () => void
  }
}

export default function GMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [places, setPlaces] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<string>("all")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setLocation({ lat, lng })
          fetchNearbyPlaces(lat, lng, selectedFacility)
        },
        () => setError("Location access denied"),
        { enableHighAccuracy: true },
      )
    } else {
      setError("Geolocation is not supported")
    }
  }, [selectedFacility])

  const fetchNearbyPlaces = async (lat: number, lng: number, facilityType: string) => {
    try {
      const response = await fetch(`/api/health-centers?lat=${lat}&lng=${lng}&type=${facilityType}`)
      const data = await response.json()

      const sortedPlaces = data.results
        .map((place: any) => ({
          ...place,
          distance: getDistance(lat, lng, place.lat, place.lng),
          mapsLink: `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`,
        }))
        .sort((a, b) => a.distance - b.distance)

      setPlaces(sortedPlaces)
    } catch (error) {
      setError("")
    }
  }

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center p-6 bg-gray-1000 text-white min-h-screen">
      <Navbar className="fixed top-0 left-0 w-full bg-black shadow-md z-50" />

      <h1 className="text-3xl font-bold mb-6 pt-20 text-white text-center">Accessible Healthcare Locations</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label htmlFor="facility-type" className="mr-2 text-white">
          Select Facility Type:
        </label>
        <select
          id="facility-type"
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          className="p-2 border border-gray-700 rounded-lg bg-black text-white"
        >
          <option value="all">All Medical Facilities</option>
          <option value="public">Public Health Center/Govt Hospitals</option>
          <option value="private">Private Health Centers</option>
          <option value="clinic">Doctor's Clinic</option>
          <option value="medical">Medical Facilities</option>
        </select>
      </div>

      {/* Update the map and places list for better responsiveness */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl mt-4 gap-4 sm:gap-6">
        {/* Map Section (Left) */}
        {isMounted && location && (
          <div className="w-full md:w-[55%] h-[350px] sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              className="rounded-lg border border-gray-700 bg-black"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/search?key=${GOOGLE_MAPS_API_KEY}&q=hospital+OR+clinic+OR+doctor+OR+medical+center${selectedFacility !== "all" ? `+${selectedFacility}` : ""}&center=${location.lat},${location.lng}&zoom=14`}
            ></iframe>
          </div>
        )}

        {/* Places List (Right) */}
        <div className="w-full md:w-[45%] h-[350px] sm:h-[450px] md:h-[550px] overflow-y-auto custom-scrollbar">
          <ul className="space-y-3 sm:space-y-4 p-2 sm:p-4">
            {places.map((place, index) => (
              <li
                key={index}
                className="border border-gray-700 p-3 sm:p-5 rounded-lg bg-black shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col">
                  <strong className="text-base sm:text-lg md:text-xl font-semibold text-blue-400">{place.name}</strong>
                  <p className="text-sm sm:text-base md:text-lg italic text-gray-300">{place.vicinity}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{place.distance.toFixed(2)} km away</p>

                  {/* View on Google Maps Link */}
                  <a
                    href={place.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-2 text-xs sm:text-sm"
                  >
                    View on Google Maps
                  </a>

                  {/* Visit Website Link (if available) */}
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline mt-1 text-xs sm:text-sm"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer className="w-full bg-black text-gray-400 mt-10" />

      <style jsx>{`
        /* Custom scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f1f1f;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  )
}

