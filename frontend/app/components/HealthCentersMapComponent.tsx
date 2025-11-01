"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Fix for Leaflet marker icons in Next.js
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

export default function HealthCentersMapComponent() {
  const [userLocation, setUserLocation] = useState<[number, number]>([20, 77])
  const [healthCenters, setHealthCenters] = useState<{ lat: number; lng: number; name: string }[]>([])

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation([latitude, longitude])

        // Fetch nearby health centers (replace with actual API or data source)
        setHealthCenters([
          { lat: latitude + 0.01, lng: longitude + 0.01, name: "Health Center 1" },
          { lat: latitude - 0.02, lng: longitude - 0.01, name: "Health Center 2" },
        ])
      },
      (error) => console.error(error),
      { enableHighAccuracy: true },
    )
  }, [])

  return (
    <MapContainer center={userLocation} zoom={14} className="w-full h-full rounded-lg shadow-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* User's location */}
      <Marker position={userLocation}>
        <Popup>You are here!</Popup>
      </Marker>

      {/* Health centers */}
      {healthCenters.map((center, index) => (
        <Marker key={index} position={[center.lat, center.lng]}>
          <Popup>{center.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

