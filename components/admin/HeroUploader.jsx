'use client'
import { useState, useEffect } from 'react'
import { adminUpdatePageHero, adminUploadPageHeroImage, getPageHero } from '@/lib/api'
import LoadingOverlay from './LoadingOverlay'

export default function HeroUploader({ pageType, onUploadSuccess }) {
  const [currentHero, setCurrentHero] = useState(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isReplacing, setIsReplacing] = useState(false)

  useEffect(() => {
    loadCurrentHero()
  }, [pageType])

  async function loadCurrentHero() {
    try {
      const data = await getPageHero(pageType)
      if (data?.image_url) {
        setCurrentHero(data)
      }
    } catch (err) {
      console.error('Failed to load current hero:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(selectedFile.type)) {
      setError('Only PNG and JPG images are allowed')
      return
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    setFile(selectedFile)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result)
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setSaving(true)
    try {
      const imageUrl = await adminUploadPageHeroImage(pageType, file)
      await adminUpdatePageHero(pageType, { image_url: imageUrl })
      setFile(null)
      setPreview(null)
      setIsReplacing(false)
      await loadCurrentHero()
      onUploadSuccess?.()
    } catch (err) {
      setError('Failed to upload hero image')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setPreview(null)
    setIsReplacing(false)
    setError('')
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <p className="text-body-gray">Loading hero section...</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
      <LoadingOverlay isLoading={saving} message="Uploading hero image..." />
      
      <h2 className="text-lg font-heading text-charcoal mb-4">Hero Section Image</h2>
      <p className="text-xs text-body-gray mb-6 font-sans">Single hero image for this page (max 10MB, PNG or JPG)</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-sans">
          {error}
        </div>
      )}

      {/* Current Hero Display */}
      {currentHero && !isReplacing ? (
        <div className="mb-6">
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Current Hero Image</label>
          <div className="relative w-full aspect-video bg-gray-100 overflow-hidden rounded border-2 border-gold/30">
            <img 
              src={currentHero.image_url} 
              alt="Current hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {currentHero.title && (
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-xs font-sans text-charcoal font-semibold mb-1">{currentHero.title}</p>
              {currentHero.description && (
                <p className="text-xs text-body-gray">{currentHero.description}</p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsReplacing(true)}
            className="mt-4 w-full px-4 py-2.5 bg-gold text-white text-xs rounded font-sans font-semibold hover:bg-opacity-90 transition"
          >
            Replace Image
          </button>
        </div>
      ) : null}

      {/* Upload Preview */}
      {preview && isReplacing ? (
        <div className="mb-6">
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">New Image Preview</label>
          <div className="relative w-full aspect-video bg-gray-100 overflow-hidden rounded border border-gold">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-gold text-white text-xs rounded font-sans font-semibold hover:bg-opacity-90 disabled:opacity-50 transition"
            >
              Confirm & Upload
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-charcoal text-xs rounded font-sans font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {/* File Upload Input */}
      {isReplacing && !preview ? (
        <div>
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Select Image to Replace</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition">
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
              id="hero-upload"
            />
            <label htmlFor="hero-upload" className="cursor-pointer block">
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm font-sans text-charcoal font-medium">Click to select image</p>
              <p className="text-xs text-body-gray mt-1">PNG or JPG only</p>
            </label>
          </div>
        </div>
      ) : null}

      {/* Empty State */}
      {!currentHero && !isReplacing && !preview ? (
        <div>
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Upload Hero Image</label>
          <button
            type="button"
            onClick={() => setIsReplacing(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gold hover:bg-gold/5 transition"
          >
            <div className="text-3xl mb-2">📸</div>
            <p className="text-sm font-sans text-charcoal font-medium">Click to upload first hero image</p>
            <p className="text-xs text-body-gray mt-1">PNG or JPG (max 10MB, recommended 1920x800px)</p>
          </button>
        </div>
      ) : null}
    </div>
  )
}
