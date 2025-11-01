import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import type { Metadata } from "next"
import MouseMoveEffect from "@/components/mouse-move-effect"
import "leaflet/dist/leaflet.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Suspense } from "react"
import HydrationBoundary from "@/components/hydration-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwasthAI - Cutting-Edge 3D Healthcare Explanation",
  description: "SwasthAI delivers innovative, high-performance 3D healthcare video solutions for businesses of the future.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <HydrationBoundary fallback={<div>Loading...</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
              <MouseMoveEffect />
              {children}
            </AuthProvider>
          </Suspense>
        </HydrationBoundary>
      </body>
    </html>
  )
}