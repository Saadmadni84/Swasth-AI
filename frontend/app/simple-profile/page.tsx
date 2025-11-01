'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  Mail, 
  Droplets, 
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import FamilyWallet from '@/components/family-wallet';
import Navbar from '@/components/navbar';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  blood_group: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergency_contact: string;
  medical_conditions: string;
  allergies: string;
  medications: string;
}

export default function SimpleProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    blood_group: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergency_contact: '',
    medical_conditions: '',
    allergies: '',
    medications: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error' | null, text: string}>({type: null, text: ''});

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('simple_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading saved profile:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({type: null, text: ''});

    try {
      // Save to localStorage
      localStorage.setItem('simple_profile', JSON.stringify(profile));
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage({type: 'success', text: 'Profile saved successfully!'});
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage({type: null, text: ''});
      }, 3000);
    } catch (error) {
      setMessage({type: 'error', text: 'Failed to save profile. Please try again.'});
    } finally {
      setIsSaving(false);
    }
  };

  const clearProfile = () => {
    if (confirm('Are you sure you want to clear all profile data?')) {
      setProfile({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        emergency_contact: '',
        medical_conditions: '',
        allergies: '',
        medications: ''
      });
      localStorage.removeItem('simple_profile');
      setMessage({type: 'success', text: 'Profile cleared successfully!'});
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage({type: null, text: ''});
      }, 3000);
    }
  };

  const getProfileCompleteness = () => {
    const requiredFields = ['full_name', 'email', 'phone', 'date_of_birth', 'gender', 'blood_group'];
    const completedFields = requiredFields.filter(field => profile[field as keyof ProfileData].trim() !== '');
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const completeness = getProfileCompleteness();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100">
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Health Profile</h1>
                  <p className="text-sm text-gray-600">Manage your health information</p>
                </div>
              </div>
              
              {/* Progress Badge */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Completion</p>
                <p className="text-lg font-bold text-gray-900">{completeness}%</p>
              </div>
              <div className="relative h-16 w-16">
                <svg className="transform -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${completeness}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#374151" />
                      <stop offset="100%" stopColor="#1f2937" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message Alert */}
        <AnimatePresence>
          {message.type && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="mb-6"
            >
              <div className={`rounded-xl p-4 shadow-lg border-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {message.type === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                  )}
                  <p className={`font-medium ${
                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <User className="h-5 w-5 text-gray-700" />
                    </div>
                    Personal Information
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.full_name}
                          onChange={(e) => handleInputChange('full_name', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="date"
                          value={profile.date_of_birth}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={profile.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none bg-white"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Blood Group <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                        <select
                          value={profile.blood_group}
                          onChange={(e) => handleInputChange('blood_group', e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none bg-white"
                        >
                          <option value="">Select blood group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Address Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <MapPin className="h-5 w-5 text-gray-700" />
                    </div>
                    Address Information
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Address
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        value={profile.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none resize-none"
                        placeholder="123 Main Street, Apartment 4B"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={profile.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        value={profile.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Medical Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Droplets className="h-5 w-5 text-gray-700" />
                    </div>
                    Medical Information
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <textarea
                      value={profile.medical_conditions}
                      onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none resize-none"
                      placeholder="List any existing medical conditions (e.g., diabetes, hypertension)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      value={profile.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none resize-none"
                      placeholder="List any known allergies (food, medication, environmental)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <textarea
                      value={profile.medications}
                      onChange={(e) => handleInputChange('medications', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none resize-none"
                      placeholder="List current medications with dosages"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Emergency Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 sticky top-24"
              >
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-3">
                      <Shield className="h-5 w-5 text-gray-700" />
                    </div>
                    Emergency Contact
                  </h2>
                </div>
                <div className="p-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Emergency Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profile.emergency_contact}
                        onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none"
                        placeholder="+1 (555) 911-0000"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4"
              >
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={clearProfile}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl shadow-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Clear Profile</span>
                </button>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    💾 Your data is stored locally in your browser for privacy
                  </p>
                </div>
              </motion.div>

              {/* Profile Summary Card */}
              {completeness > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl shadow-md border border-gray-200 p-6"
                >
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-gray-700 mr-2" />
                    Quick Summary
                  </h3>
                  <div className="space-y-3">
                    {profile.full_name && (
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="h-4 w-4 text-gray-700 flex-shrink-0" />
                        <span className="text-gray-700 truncate">{profile.full_name}</span>
                      </div>
                    )}
                    {profile.blood_group && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Droplets className="h-4 w-4 text-gray-700 flex-shrink-0" />
                        <span className="text-gray-700">{profile.blood_group}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-700 flex-shrink-0" />
                        <span className="text-gray-700 truncate">{profile.phone}</span>
                      </div>
                    )}
                    {(profile.city || profile.state) && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-700 flex-shrink-0" />
                        <span className="text-gray-700 truncate">
                          {[profile.city, profile.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </form>

        {/* Family Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <FamilyWallet />
        </motion.div>
      </div>
    </div>
    </>
  );
}