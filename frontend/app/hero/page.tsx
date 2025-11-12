import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#f5f0ff] to-[#fdfbf7]">
      {/* Visit-style Subtle Background - Force light mode colors */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-transparent to-purple-50/20" />
        <div className="absolute right-0 top-0 h-[900px] w-[900px] bg-purple-400/15 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 h-[800px] w-[800px] bg-purple-300/15 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <Footer />
      </div>
    </div>
  )
}

