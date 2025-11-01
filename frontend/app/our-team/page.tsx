"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Github, Linkedin, Mail, User, UserCircle } from "lucide-react"

interface TeamMemberType {
  name: string
  role: string
  bio: string
  links: {
    github: string
    linkedin: string
    email: string
  }
}

interface TeamMemberProps {
  member: TeamMemberType
  index: number
}

const teamMembers: TeamMemberType[] = [
  {
    name: "Udit Maheshwari",
    role: "Frontend Designer & Backend Developer",
    bio: "Udit is a skilled MERN Stack developer with expertise in creating responsive web applications and robust backend systems.",
    links: {
      github: "#",
      linkedin: "#",
      email: "udit@swasthai.com",
    },
  },
  {
    name: "Shahzad Khan",
    role: "Database & Cloud Specialist",
    bio: "Shahzad is a database and cloud specialist with a strong background in cloud computing and scalable AI solutions.",
    links: {
      github: "#",
      linkedin: "#",
      email: "shahzad@swasthai.com",
    },
  },
  {
    name: "Ishan Khan",
    role: "Three.JS Expert",
    bio: "Ishan is an expert in Three.js development, specializing in creating immersive 3D models and interactive visualizations.",
    links: {
      github: "#",
      linkedin: "#",
      email: "ishan@swasthai.com",
    },
  },
  {
    name: "Suraj Kumar Ojha",
    role: "Three.JS Specialist",
    bio: "Suraj is an expert in Three.js models, enhancing 3D model structures and creating engaging interactive experiences.",
    links: {
      github: "#",
      linkedin: "#",
      email: "suraj@swasthai.com",
    },
  },
  {
    name: "Ritu Singh",
    role: "ML Specialist",
    bio: "Ritu Singh is a creative ML designer who focuses on crafting intuitive and engaging models with high proficiency. She ensures that AI-powered applications have extreme precision.",
    links: {
      github: "#",
      linkedin: "#",
      email: "ritu@swasthai.com",
    },
  },
  {
    name: "Muskan Bhadani",
    role: "ML Specialist",
    bio: "Muskan Bhadani is a creative ML designer who builds accurate, user-focused models to make AI applications practical and impactful.",
    links: {
      github: "#",
      linkedin: "#",
      email: "muskan@swasthai.com",
    },
  },
]

const TeamMember = ({ member, index }: TeamMemberProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-gray-900 dark:bg-black border border-gray-700 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-48 sm:h-56 md:h-64 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        {index < 3 ? (
          <User className="w-24 h-24 sm:w-32 sm:h-32 text-blue-400" />
        ) : (
          <UserCircle className="w-24 h-24 sm:w-32 sm:h-32 text-purple-400" />
        )}
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-white">{member.name}</h3>
        <p className="text-sm sm:text-base text-blue-400 mb-3 font-medium">{member.role}</p>
        <p className="text-sm sm:text-base text-gray-300 mb-4 leading-relaxed">{member.bio}</p>
        <div className="flex space-x-4">
          <a
            href={member.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            aria-label={`${member.name}'s GitHub`}
          >
            <Github className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a
            href={member.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            aria-label={`${member.name}'s LinkedIn`}
          >
            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a 
            href={`mailto:${member.links.email}`} 
            className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            aria-label={`Email ${member.name}`}
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function OurTeam() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Meet the talented individuals behind SwasthAI who are passionate about revolutionizing healthcare through technology.
          </p>
        </motion.div>

        {/* Team Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {isLoaded &&
            teamMembers.map((member, index) => (
              <TeamMember key={member.name} member={member} index={index} />
            ))}
        </section>

        {/* Vision Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-8 sm:p-12 border border-gray-700"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Our Vision
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
            At SwasthAI, we aim to make everyone aware of diseases by explaining them through interactive 3D models and providing real-time alerts.
            Our goal is to simplify complex medical information, making it easy to understand for everyone, and empower individuals to take timely action for their health.
          </p>
          <div className="mt-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="inline-flex items-center space-x-2 bg-blue-600/20 px-6 py-3 rounded-full border border-blue-500/30"
            >
              <span className="text-blue-400 font-semibold">Powered by Gemini AI</span>
            </motion.div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}
