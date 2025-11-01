"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";
import Footer from "@/components/footer";

const translations = [
  { lang: "English", text: "Your Health, Our Priority" },
  { lang: "हिन्दी", text: "आपका स्वास्थ्य, हमारी प्राथमिकता" },
  { lang: "ગુજરાતી", text: "તમારું સ્વાસ્થ્ય, અમારી પ્રાથમિકતા" },
  { lang: "বাংলা", text: "আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার" },
  { lang: "मराठी", text: "तुमचे आरोग्य, आमची प्राधान्यता" },
  { lang: "தமிழ்", text: "உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை" },
];

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="grey"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BackgroundPaths() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden medical-bg dark:medical-bg-dark">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        {/* Medical background elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.8 }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/90 to-accent"
            >
              {translations[index].text}
            </motion.span>
          </h1>

          <div
            className="inline-block group relative bg-gradient-to-b from-primary/10 to-accent/10 p-px rounded-2xl backdrop-blur-lg overflow-hidden medical-glow hover:shadow-xl transition-shadow duration-300"
          >
            <Link href="/hero">
              <Button
                variant="ghost"
                className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md bg-card/95 hover:bg-card/100 text-primary transition-all duration-300 group-hover:-translate-y-0.5 border border-primary/20 hover:shadow-md medical-card dark:medical-card-dark"
              >
                <span className="opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Start Your Health Journey
                </span>
                <span
                  className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300"
                >
                  →
                </span>
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}