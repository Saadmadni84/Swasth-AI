"use client"

import Link from "next/link"
import { Github, Linkedin, Heart, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl shadow-lg">
                  <span className="text-white text-xl">🩺</span>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-cyan-400">
                    SwasthAI
                  </h2>
                  <p className="text-xs text-slate-400">Healthcare AI Platform</p>
                </div>
              </div>
              <p className="text-slate-300 max-w-sm leading-relaxed text-sm">
                Transforming healthcare through innovative AI-powered solutions and 3D medical visualization. Empowering patients and professionals alike.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span>support@swasthai.com</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800-SWASTH-AI</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer">
                  <MapPin className="w-4 h-4" />
                  <span>India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://github.com/UditxMaheshwari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/in/udit-maheshwari-524b9b303/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-white">Solutions</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/health-check"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    SwasthAI Assistant
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/3d-lab"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    3D Medical Lab
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/find-doctor"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    Find Doctor
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/family-vault"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    Family Health Vault
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/about-us"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/our-team"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/news-help"
                    prefetch={false}
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    News & Help
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-slate-300 hover:text-cyan-400 transition-colors text-sm block"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} SwasthAI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Built with</span>
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              <span>for healthcare innovation</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

