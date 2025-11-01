"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Link from "next/link"

export default function FindDoctor() {
  const [condition, setCondition] = useState("")
  const [location, setLocation] = useState("")
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleFindDoctors = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:5000/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition, location }),
      })

      const data = await res.json()
      setApiResponse(data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
      setApiResponse({ error: "Failed to fetch doctors. Please try again." })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black dark:bg-black text-white text-white">
      <Navbar />

      {/* Search Section - Fixed at Top */}
      <div className="bg-black dark:bg-black text-white py-6 sm:py-8 px-3 sm:px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Find Nearby Doctors</h1>

          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch">
            <div className="flex-1">
              <input
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black dark:bg-black text-white placeholder-gray-400 border border-gray-700 text-sm sm:text-base"
                placeholder="Enter your health condition..."
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <input
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black dark:bg-black text-white placeholder-gray-400 border border-gray-700 text-sm sm:text-base"
                placeholder="Enter your location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <Button
              className="flex items-center justify-center gap-2 hover:bg-[#b9b9b9] text-sm sm:text-base py-2 sm:py-3"
              onClick={handleFindDoctors}
              disabled={loading}
            >
              <Search size={16} className="sm:size-20" />
              {loading ? "Searching..." : "Find Doctors"}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section - Expanded Area Below */}
      <div className="flex-grow dark:bg-black text-white px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {apiResponse && apiResponse.doctors ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-white pb-2 border-b border-gray-700">Doctors Found</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {apiResponse.doctors
                  .split("\n\n--------------------------------------------------\n")
                  .map((doctor, index) => {
                    const doctorInfo = {}
                    doctor.split("\n").forEach((line) => {
                      if (line.includes(": ")) {
                        const [key, value] = line.split(": ")
                        doctorInfo[key] = value
                      }
                    })

                    return (
                      <div
                        key={index}
                        className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 flex flex-col border border-gray-700"
                      >
                        <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-2">{doctorInfo["Name"]}</h3>

                        <div className="mb-3 sm:mb-4">
                          <span className="inline-block bg-blue-900 text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            {doctorInfo["Specialization"]}
                          </span>
                        </div>

                        <div className="space-y-2 sm:space-y-3 text-gray-300 flex-grow text-sm sm:text-base">
                          <p className="flex items-start">
                            <span className="font-medium min-w-16 sm:min-w-24 inline-block">Experience:</span>
                            <span>{doctorInfo["Experience"]}</span>
                          </p>

                          <p className="flex items-start">
                            <span className="font-medium min-w-16 sm:min-w-24 inline-block">Fee:</span>
                            <span>{doctorInfo["Consultation Fee"]}</span>
                          </p>

                          <p className="flex items-start">
                            <span className="font-medium min-w-16 sm:min-w-24 inline-block">Location:</span>
                            <span className="text-xs sm:text-sm">{doctorInfo["Location"]}</span>
                          </p>
                        </div>

                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                          <Link
                            href={doctorInfo["About Doctor"]}
                            target="_blank"
                            className="text-blue-400 hover:text-blue-300 font-medium text-xs sm:text-sm inline-flex items-center"
                          >
                            View Profile
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          ) : (
            <div className="dark:bg-black text-white shadow-md p-8 text-center border border-gray-700 rounded-lg">
              <div className="flex flex-col items-center justify-center py-12">
                <Search size={48} className="text-gray-500 mb-4" />
                <p className="text-gray-400 text-lg">
                  Enter your health condition and location to find doctors near you
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="dark:bg-black text-white pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 hover:bg-[#b9b9b9]"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

