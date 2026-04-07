'use client'

export default function BackButton() {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <button 
      onClick={handleBack} 
      className="inline-flex items-center gap-2 text-sm text-body-gray hover:text-gold transition-colors font-sans mb-8"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Back to dresses
    </button>
  )
}
