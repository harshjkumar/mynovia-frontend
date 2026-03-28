export default function LoadingOverlay({ isLoading, message = 'Uploading...' }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white px-8 py-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gold rounded-full animate-spin mb-4"></div>
        <p className="font-sans text-charcoal font-medium">{message}</p>
      </div>
    </div>
  )
}
