"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Brain, Shield, Clock, Stethoscope, HeartPulse, Dna, ChartBar } from "lucide-react"
import Link from "next/link"

const translations = [
  { lang: "English", text: "Transform Healthcare with AI Technology" },
  { lang: "हिन्दी", text: "एआई तकनीक से स्वास्थ्य सेवा को बदलें" },
  { lang: "ગુજરાતી", text: "AI ટેક્નોલોજી સાથે આરોગ્યસંભાળ પરિવર્તિત કરો" },
  { lang: "বাংলা", text: "AI প্রযুক্তি দিয়ে স্বাস্থ্যসেবা রূপান্তর করুন" },
  { lang: "मराठी", text: "AI तंत्रज्ञानासह आरोग्यसेवा बदला" },
  { lang: "தமிழ்", text: "AI தொழில்நுட்பத்துடன் சுகாதாரத்தை மாற்றுங்கள்" },
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fdfbf7] via-[#f5f0ff] to-[#fdfbf7]">
      {/* Visit-style Soft Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-purple-400/25 via-purple-300/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-purple-300/20 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[1100px] h-[1100px] bg-gradient-to-br from-purple-200/15 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10 max-w-screen-xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge - Visit style */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200/30 text-sm font-semibold text-purple-700 shadow-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Activity className="w-4 h-4" />
              <span>AI-Powered Healthcare Platform</span>
            </motion.div>

            {/* Main Heading - Visit style typography */}
            <div className="space-y-6">
              <motion.h1
                key={index}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-gray-900">
                  {translations[index].text.split(' ').slice(0, 2).join(' ')}
                </span>
                {' '}
                <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                  {translations[index].text.split(' ').slice(2).join(' ')}
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Empowering medical professionals with cutting-edge 3D visualization and intelligent healthcare solutions for better patient outcomes.
              </motion.p>
            </div>

            {/* CTA Buttons - Visit style */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link href="/health-check">
                <Button size="lg" className="group text-base px-8 py-6 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/3d-lab">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-full border-2 border-purple-600 text-purple-700 hover:bg-purple-50 transition-all duration-300 font-semibold">
                  Explore 3D Lab
                </Button>
              </Link>
            </motion.div>

            {/* Stats - Visit style with cards */}
            <motion.div
              className="grid grid-cols-3 gap-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {[
                { label: "AI Accuracy", value: "95%", icon: Brain, color: "purple" },
                { label: "Response Time", value: "<1s", icon: Clock, color: "blue" },
                { label: "Secure", value: "100%", icon: Shield, color: "green" }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label} 
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-gray-200/50 text-center hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                      stat.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                      stat.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                      'from-green-500/20 to-green-600/20'
                    } flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 ${
                        stat.color === 'purple' ? 'text-purple-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                  </div>
                  <p className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                    stat.color === 'purple' ? 'from-purple-600 to-purple-700' :
                    stat.color === 'blue' ? 'from-blue-600 to-blue-700' :
                    'from-green-600 to-green-700'
                  } bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual (Visit-inspired design) */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Main Card - Visit style with subtle glass effect */}
              <div className="relative h-full bg-gradient-to-br from-white/80 via-purple-50/60 to-white/80 rounded-[3rem] shadow-2xl overflow-hidden border border-purple-200/30 backdrop-blur-xl">
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-transparent to-purple-500/5"></div>
                
                {/* Grid Pattern - more subtle */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {[...Array(64)].map((_, i) => (
                      <div key={i} className="border border-purple-900"></div>
                    ))}
                  </div>
                </div>

                {/* Medical Icons Grid - Visit style */}
                <div className="relative h-full flex items-center justify-center p-8">
                  <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                    {[
                      { icon: Stethoscope, label: "Diagnosis", color: "purple", delay: 0 },
                      { icon: HeartPulse, label: "Monitor", color: "red", delay: 0.1 },
                      { icon: Brain, label: "AI Analysis", color: "blue", delay: 0.2 },
                      { icon: Dna, label: "Genetics", color: "green", delay: 0.3 },
                      { icon: ChartBar, label: "Analytics", color: "orange", delay: 0.4 },
                      { icon: Shield, label: "Security", color: "cyan", delay: 0.5 }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        className={`${i === 5 ? 'col-span-3 mx-auto' : ''} group`}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.8 + item.delay, duration: 0.5 }}
                        whileHover={{ scale: 1.1, y: -8 }}
                      >
                        <div className="relative">
                          {/* Icon container with Visit-style gradients */}
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
                            item.color === 'purple' ? 'from-purple-100 to-purple-200' :
                            item.color === 'red' ? 'from-red-100 to-red-200' :
                            item.color === 'blue' ? 'from-blue-100 to-blue-200' :
                            item.color === 'green' ? 'from-green-100 to-green-200' :
                            item.color === 'orange' ? 'from-orange-100 to-orange-200' :
                            'from-cyan-100 to-cyan-200'
                          } flex items-center justify-center border border-white/50 shadow-lg group-hover:shadow-2xl transition-all duration-300`}>
                            <item.icon className={`w-10 h-10 ${
                              item.color === 'purple' ? 'text-purple-600' :
                              item.color === 'red' ? 'text-red-600' :
                              item.color === 'blue' ? 'text-blue-600' :
                              item.color === 'green' ? 'text-green-600' :
                              item.color === 'orange' ? 'text-orange-600' :
                              'text-cyan-600'
                            }`} />
                          </div>
                          {/* Label */}
                          <p className="text-xs font-semibold text-gray-700 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {item.label}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards - Visit style */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-200/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">HIPAA Compliant</p>
                    <p className="text-xs text-gray-600">Secure & Private</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-gray-200/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">Multi-Language</p>
                    <p className="text-xs text-gray-600">6+ Languages</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

