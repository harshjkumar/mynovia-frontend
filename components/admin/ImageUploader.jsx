'use client'
import { useRef } from 'react'

export default function ImageUploader({ onUpload, multiple = true, label = 'Upload Images' }) {
  const inputRef = useRef(null)

  function handleChange(e) {
    const files = Array.from(e.target.files)
    if (files.length > 0 && onUpload) {
      onUpload(files)
    }
    e.target.value = ''
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed border-gray-300 hover:border-gold rounded-lg p-8 text-center cursor-pointer transition-colors"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="text-3xl mb-2">📸</div>
      <p className="text-sm font-sans text-body-gray">{label}</p>
      <p className="text-xs font-sans text-body-gray/60 mt-1">Click or drag and drop</p>
    </div>
  )
}
