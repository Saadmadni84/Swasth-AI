// /app/layout.jsx
import './globals.css'
import { AuthProvider } from '@/hooks/useAuth'

export const metadata = {
  title: 'Next.js + Supabase App',
  description: 'A production-ready Next.js app with Supabase authentication',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
