import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Medical Laboratory | SwasthAI',
  description: 'Advanced 3D visualization and AI-powered medical predictions for heart disease, diabetes, and blood vessel analysis.',
}

export default function LabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
