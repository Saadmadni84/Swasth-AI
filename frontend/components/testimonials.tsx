"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Chief Surgeon, Metro General Hospital",
    content: "SwasthAI has revolutionized how we explain complex procedures to patients. The 3D visualizations have improved patient understanding by 300%.",
    avatar: "SM",
    rating: 5,
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Dr. Michael Chen",
    role: "Head of Radiology, City Medical Center",
    content: "The AI-powered diagnostic tools have significantly improved our accuracy rates. This platform is a game-changer for modern healthcare.",
    avatar: "MC",
    rating: 5,
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Dr. Priya Sharma",
    role: "Director of Healthcare Innovation",
    content: "Finally, a healthcare platform that prioritizes both innovation and user experience. Our entire team adopted it within days.",
    avatar: "PS",
    rating: 5,
    color: "from-green-500 to-emerald-500"
  }
]

export default function Testimonials() {
  return (
    <section className="container px-4 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mx-auto max-w-3xl text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>Testimonials</span>
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            What Healthcare{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
              Professionals Say
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Trusted by leading medical institutions worldwide
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="relative h-full rounded-2xl border-2 border-border/50 bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed mb-8 relative z-10 italic">
                  "{testimonial.content}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Social Proof */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground mb-6">Trusted by healthcare professionals at:</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              "Metro General Hospital",
              "City Medical Center",
              "Healthcare Innovation Institute",
              "Rural Health Foundation"
            ].map((org, index) => (
              <div key={org} className="text-foreground/60 font-semibold text-sm md:text-base hover:text-foreground transition-colors">
                {org}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

