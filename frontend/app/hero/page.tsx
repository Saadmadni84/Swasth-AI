import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen medical-bg dark:medical-bg-dark">
      {/* Medical Background Elements */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
        <div className="absolute right-0 top-0 h-[600px] w-[600px] bg-blue-500/15 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-green-500/15 blur-[100px] rounded-full" />
        <div className="absolute top-1/3 right-1/3 h-[400px] w-[400px] bg-primary/10 blur-[80px] rounded-full" />
        {/* Medical cross pattern */}
        <div className="absolute top-10 left-10 w-8 h-8 bg-primary/20 rotate-45"></div>
        <div className="absolute top-20 right-32 w-6 h-6 bg-accent/30 rotate-45"></div>
        <div className="absolute bottom-32 right-20 w-10 h-10 bg-green-500/20 rotate-45"></div>
        <div className="absolute bottom-20 left-40 w-4 h-4 bg-blue-500/30 rotate-45"></div>
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

