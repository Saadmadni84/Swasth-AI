// /app/auth/signup/page.jsx
import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <SignupForm />
      </div>
    </div>
  )
}
