"use client"

import Link from "next/link"
import { Github, Linkedin, Heart, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-slate-700 bg-[#0f172a] text-white overflow-hidden shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
                  <span className="text-white text-2xl">🩺</span>
                </div>
                <div>
                  <h2 className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SwasthAI
                  </h2>
                  <p className="text-xs text-muted-foreground">Healthcare AI Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Transforming healthcare through innovative AI-powered solutions and 3D medical visualization. Empowering patients and professionals alike.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>support@swasthai.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800-SWASTH-AI</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
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
                  className="p-3 bg-background border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/in/udit-maheshwari-524b9b303/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-background border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Solutions</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/health-check"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    SwasthAI Assistant
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/3d-lab"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    3D Medical Lab
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/find-doctor"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Find Doctor
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/family-vault"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Family Health Vault
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/about-us"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/our-team"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/news-help"
                    prefetch={false}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    News & Help
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SwasthAI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" />
              <span>for healthcare innovation</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

