'use client'
import { useState, useEffect } from 'react'
import { fetchMedia } from '@/lib/api'
import Lightbox from '@/components/ui/Lightbox'
import Spinner from '@/components/ui/Spinner'

export default function GaleriaPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState(-1)

  useEffect(() => {
    fetchMedia('gallery')
      .then(data => setImages(data))
      .catch(() => {
        setImages([
          { id: 1, image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
          { id: 2, image_url: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=600&q=80' },
          { id: 3, image_url: 'https://images.unsplash.com/photo-1522653216850-4f1415a174fb?w=600&q=80' },
          { id: 4, image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80' },
          { id: 5, image_url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80' },
          { id: 6, image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' }
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const imgUrls = images.map(i => i.image_url)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <span className="section-eyebrow block mb-3">INSPIRATION</span>
        <h1 className="section-heading">Our <em>Gallery</em></h1>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="break-inside-avoid overflow-hidden cursor-pointer group"
              onClick={() => setLightboxIdx(idx)}
            >
              <img
                src={img.image_url}
                alt={img.file_name || `Gallery ${idx + 1}`}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {lightboxIdx >= 0 && (
        <Lightbox
          images={imgUrls}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(-1)}
        />
      )}
    </div>
  )
}
