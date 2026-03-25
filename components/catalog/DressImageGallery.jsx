'use client'
import { useState } from 'react'

export default function DressImageGallery({ images = [], dressName = '' }) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-cream flex items-center justify-center">
        <p className="text-body-gray font-sans text-sm">No image</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[3/4] overflow-hidden bg-cream">
        <img
          src={images[selectedIndex].image_url}
          alt={dressName}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-[3/4] overflow-hidden bg-cream transition-all duration-200 ${
                idx === selectedIndex
                  ? 'ring-2 ring-gold ring-offset-2 opacity-100'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img.image_url}
                alt={`${dressName} - ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
