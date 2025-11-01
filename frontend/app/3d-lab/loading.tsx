export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-blue-400 opacity-20"></div>
        </div>
        <h2 className="mt-6 text-xl font-bold text-blue-900">Loading 3D Medical Lab</h2>
        <p className="mt-2 text-sm text-blue-600">Preparing your interactive medical visualizations...</p>
      </div>
    </div>
  )
}
