'use client'
import { useState, useEffect } from 'react'
import { fetchMedia, adminUploadMedia, adminDeleteMedia } from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'
import LoadingOverlay from '@/components/admin/LoadingOverlay'

export default function AdminMediaPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const folder = 'gallery'

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setMedia(await fetchMedia(folder)) } catch { setMedia([]) }
    setLoading(false)
  }

  async function handleUpload(files) {
    setUploading(true)
    for (const file of files) {
      try { await adminUploadMedia(file, folder) } catch {}
    }
    setUploading(false)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this file?')) return
    try { await adminDeleteMedia(id); setMedia(prev => prev.filter(m => m.id !== id)) } catch {}
  }

  return (
    <div>
      <LoadingOverlay isLoading={uploading} message="Uploading Media..." />
      <h1 className="text-2xl font-heading text-charcoal mb-8">Gallery</h1>

      <div className="mb-8">
        <ImageUploader onUpload={handleUpload} label={uploading ? 'Uploading...' : 'Upload files to gallery'} />
      </div>

      {loading ? (
        <p className="text-center text-body-gray py-8">Loading...</p>
      ) : media.length === 0 ? (
        <p className="text-center text-body-gray py-8">No files in gallery</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map(item => (
            <div key={item.id} className="group relative aspect-square bg-cream overflow-hidden rounded">
              <img src={item.image_url} alt={item.file_name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <button onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs px-3 py-1.5 rounded font-sans">
                  Delete
                </button>
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-sans px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {item.file_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
