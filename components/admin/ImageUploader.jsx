'use client'
import { useRef, useState } from 'react'

export default function ImageUploader({ onUpload, multiple = true, label = 'Upload Images' }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg']

  function validateFile(file) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB. (Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
    }

    // Check file format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return `File "${file.name}" has invalid format. Only PNG and JPG formats are allowed.`
    }

    return null
  }

  function handleChange(e) {
    const files = Array.from(e.target.files)
    setError('')
    setShowError(false)

    if (files.length > 0) {
      // Validate all files
      for (const file of files) {
        const validationError = validateFile(file)
        if (validationError) {
          setError(validationError)
          setShowError(true)
          e.target.value = ''
          setTimeout(() => setShowError(false), 5000) // Auto-hide after 5 seconds
          return
        }
      }

      // If all files are valid, upload them
      if (onUpload) {
        onUpload(files)
      }
    }
    e.target.value = ''
  }

  return (
    <div>
      {showError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-sans">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold mb-1">File upload error</p>
              <p>{error}</p>
              <p className="text-xs mt-2 opacity-80">Requirements: Maximum 10MB, PNG or JPG format</p>
            </div>
          </div>
        </div>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <div className="text-3xl mb-2">📸</div>
        <p className="text-sm font-sans text-body-gray">{label}</p>
        <p className="text-xs font-sans text-body-gray/60 mt-1">Click or drag and drop</p>
        <p className="text-xs font-sans text-body-gray/50 mt-2">Max 10MB • PNG or JPG only</p>
      </div>
    </div>
  )
}
