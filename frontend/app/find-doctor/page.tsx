"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Navigation, Filter, Phone, Calendar, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

// Mock doctor data for demonstration
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Mitchell",
    specialty: "Cardiologist",
    photo: "https://ui-avatars.com/api/?name=Sarah+Mitchell&background=003049&color=fff&size=200",
    distance: 2.5,
    rating: 4.8,
    reviews: 156,
    experience: "15 years",
    hospital: "Apollo Hospital",
    available: true,
    phone: "+91 98765 43210",
    fee: "₹800",
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "Dentist",
    photo: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=669bbc&color=fff&size=200",
    distance: 1.2,
    rating: 4.9,
    reviews: 203,
    experience: "12 years",
    hospital: "Max Healthcare",
    available: true,
    phone: "+91 98765 43211",
    fee: "₹600",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Pediatrician",
    photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=c1121f&color=fff&size=200",
    distance: 3.8,
    rating: 4.7,
    reviews: 142,
    experience: "10 years",
    hospital: "Fortis Hospital",
    available: false,
    phone: "+91 98765 43212",
    fee: "₹700",
  },
  {
    id: 4,
    name: "Dr. Amit Patel",
    specialty: "Orthopedic",
    photo: "https://ui-avatars.com/api/?name=Amit+Patel&background=780000&color=fff&size=200",
    distance: 4.5,
    rating: 4.6,
    reviews: 98,
    experience: "18 years",
    hospital: "Medanta Hospital",
    available: true,
    phone: "+91 98765 43213",
    fee: "₹1000",
  },
  {
    id: 5,
    name: "Dr. Neha Gupta",
    specialty: "Dermatologist",
    photo: "https://ui-avatars.com/api/?name=Neha+Gupta&background=003049&color=fff&size=200",
    distance: 2.1,
    rating: 4.9,
    reviews: 187,
    experience: "8 years",
    hospital: "Columbia Asia",
    available: true,
    phone: "+91 98765 43214",
    fee: "₹900",
  },
  {
    id: 6,
    name: "Dr. Vikram Singh",
    specialty: "Neurologist",
    photo: "https://ui-avatars.com/api/?name=Vikram+Singh&background=669bbc&color=fff&size=200",
    distance: 5.2,
    rating: 4.8,
    reviews: 134,
    experience: "20 years",
    hospital: "AIIMS Delhi",
    available: false,
    phone: "+91 98765 43215",
    fee: "₹1200",
  },
  {
    id: 7,
    name: "Dr. Anjali Mehta",
    specialty: "Gynecologist",
    photo: "https://ui-avatars.com/api/?name=Anjali+Mehta&background=c1121f&color=fff&size=200",
    distance: 1.8,
    rating: 4.7,
    reviews: 176,
    experience: "14 years",
    hospital: "Lilavati Hospital",
    available: true,
    phone: "+91 98765 43216",
    fee: "₹850",
  },
  {
    id: 8,
    name: "Dr. Arjun Reddy",
    specialty: "General Physician",
    photo: "https://ui-avatars.com/api/?name=Arjun+Reddy&background=780000&color=fff&size=200",
    distance: 0.8,
    rating: 4.9,
    reviews: 245,
    experience: "11 years",
    hospital: "Apollo Clinic",
    available: true,
    phone: "+91 98765 43217",
    fee: "₹500",
  },
];

export default function FindDoctor() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("distance");
  const [isLocating, setIsLocating] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors);

  // Handle location detection
  const handleUseLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setLocationEnabled(true);
    }, 1000);
  };

  // Filter and sort doctors
  useEffect(() => {
    let filtered = mockDoctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort doctors
    if (sortBy === "distance") {
      filtered = filtered.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, sortBy]);

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-300 text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gradient-to-br from-blue-50 via-cyan-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#003049] mb-4">
              Find Nearby Doctors 👨‍⚕️
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover qualified healthcare professionals near you. Book appointments
              with ease and get the care you deserve.
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, specialty, or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-[#669bbc] focus:outline-none transition-colors shadow-sm"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-12 pr-8 py-4 rounded-xl border-2 border-gray-200 focus:border-[#669bbc] focus:outline-none transition-colors shadow-sm bg-white cursor-pointer appearance-none min-w-[200px]"
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>

              {/* Use My Location Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUseLocation}
                disabled={isLocating}
                className="px-6 py-4 bg-gradient-to-r from-[#003049] to-[#669bbc] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLocating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Locating...
                  </>
                ) : (
                  <>
                    <Navigation size={20} />
                    Use My Location
                  </>
                )}
              </motion.button>
            </div>

            {/* Location Status */}
            {locationEnabled && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg"
              >
                <MapPin size={18} />
                <span className="font-medium">Showing doctors near you</span>
              </motion.div>
            )}
          </motion.div>

          {/* Doctors Grid */}
          {filteredDoctors.length === 0 ? (
            // Empty State
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-8xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No doctors found nearby
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or location settings
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Doctor Photo */}
                  <div className="relative">
                    <img
                      src={doctor.photo}
                      alt={doctor.name}
                      className="w-full h-48 object-cover"
                    />
                    {/* Availability Badge */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                        doctor.available
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {doctor.available ? "Available" : "Busy"}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5">
                    {/* Name and Specialty */}
                    <h3 className="text-xl font-bold text-[#003049] mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-[#669bbc] font-medium mb-3">
                      {doctor.specialty}
                    </p>

                    {/* Hospital */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin size={14} className="text-[#c1121f]" />
                      <span>{doctor.hospital}</span>
                    </div>

                    {/* Distance */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Navigation size={14} className="text-[#669bbc]" />
                      <span className="font-semibold">{doctor.distance} km away</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(Math.floor(doctor.rating))}
                      <span className="text-sm font-bold text-gray-700">
                        {doctor.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({doctor.reviews} reviews)
                      </span>
                    </div>

                    {/* Experience & Fee */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-semibold">Experience:</span>
                        <br />
                        {doctor.experience}
                      </div>
                      <div>
                        <span className="font-semibold">Fee:</span>
                        <br />
                        {doctor.fee}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 bg-gradient-to-r from-[#003049] to-[#669bbc] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Calendar size={18} />
                        Book Now
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#fdf0d5] text-[#003049] p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Phone size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {filteredDoctors.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 text-gray-600"
            >
              Showing {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}{" "}
              {locationEnabled && "near you"}
            </motion.div>
          )}

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#003049] rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#003049]"
            >
              <ArrowLeft size={20} />
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

