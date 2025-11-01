"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Activity, Brain, Shield, Clock } from "lucide-react"
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
    <section className="container relative max-w-screen-2xl mx-auto px-4 py-20 md:py-32 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Content */}
        <motion.div
          className="space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Activity className="w-4 h-4" />
            <span>AI-Powered Healthcare Platform</span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              key={index}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                {translations[index].text.split(' ').slice(0, 2).join(' ')}
              </span>
              {' '}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
                {translations[index].text.split(' ').slice(2).join(' ')}
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Empowering medical professionals with cutting-edge 3D visualization and intelligent healthcare solutions for better patient outcomes.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/health-check">
              <Button size="lg" className="group text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/3d-lab">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl border-2 hover:bg-primary/5 transition-all duration-300">
                Explore 3D Lab
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {[
              { label: "AI Accuracy", value: "95%", icon: Brain },
              { label: "Response Time", value: "<1s", icon: Clock },
              { label: "Secure", value: "100%", icon: Shield }
            ].map((stat, i) => (
              <div key={stat.label} className="text-center lg:text-left space-y-1">
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column - Visual */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Card */}
          <div className="relative aspect-square max-w-lg mx-auto">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/20 to-accent/20 rounded-3xl blur-3xl animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative h-full bg-gradient-to-br from-primary via-blue-600 to-accent rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              {/* Animated Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 animate-pulse"></div>
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-6 grid-rows-6 h-full">
                  {[...Array(36)].map((_, i) => (
                    <div key={i} className="border border-white/20"></div>
                  ))}
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Center Icon */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
                      <Activity className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>

                  {/* Orbiting Icons */}
                  {[
                    { icon: "🩺", delay: 0, radius: 140 },
                    { icon: "🧬", delay: 1, radius: 140 },
                    { icon: "💊", delay: 2, radius: 140 },
                    { icon: "🏥", delay: 3, radius: 140 }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        marginLeft: `-${item.radius}px`,
                        marginTop: `-${item.radius}px`
                      }}
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                        delay: item.delay * 5
                      }}
                    >
                      <motion.div
                        className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30 shadow-lg"
                        style={{
                          marginLeft: `${item.radius}px`,
                          marginTop: `${item.radius}px`
                        }}
                        animate={{
                          rotate: -360
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                          delay: item.delay * 5
                        }}
                      >
                        <span className="text-3xl">{item.icon}</span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Mini Cards */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-xl"
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <p className="font-semibold">HIPAA Compliant</p>
                  <p className="text-sm text-muted-foreground">Secure & Private</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl p-4 shadow-xl"
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <div>
                  <p className="font-semibold">Multi-Language</p>
                  <p className="text-sm text-muted-foreground">6+ Languages</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

