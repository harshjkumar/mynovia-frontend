'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  adminGetAccessories, 
  adminUpdateAccessory, 
  adminUploadAccessoryImage, 
  fetchCategories 
} from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'

export default function EditAccessoryPage() {
  const router = useRouter()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const [form, setForm] = useState({
    name: '', description: '', price: '',
    is_available: true, is_published: false
  })

  useEffect(() => {
    // Categories removed as per request
    loadAccessory()
  }, [id])

  async function loadAccessory() {
    try {
      const all = await adminGetAccessories()
      const acc = all.find(a => a.id === id)
      if (!acc) return router.push('/admin/accesorios')

      setForm({
        name: acc.name || '',
        description: acc.description || '',
        price: acc.price?.toString() || '',
        is_available: acc.is_available ?? true,
        is_published: acc.is_published ?? false
      })
      setExistingImages((acc.accessory_images || []).sort((a, b) => a.display_order - b.display_order))
    } catch (err) {}
  }

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminUpdateAccessory(id, {
        ...form,
        price: form.price ? parseFloat(form.price) : null
      })

      for (let i = 0; i < newImages.length; i++) {
        await adminUploadAccessoryImage(id, newImages[i], existingImages.length + i)
      }

      router.push('/admin/accesorios')
    } catch (err) {
      alert('Error updating accessory')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading text-charcoal mb-8">Edit Accessory</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Name *</label>
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
            className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
        </div>

        <div>
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3}
            className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Price</label>
            <input type="number" step="0.01" value={form.price} onChange={e => update('price', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_available} onChange={e => update('is_available', e.target.checked)} className="accent-gold" />
            <span className="text-sm font-sans text-charcoal">Available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => update('is_published', e.target.checked)} className="accent-gold" />
            <span className="text-sm font-sans text-charcoal">Publish</span>
          </label>
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Existing Images</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map(img => (
                <div key={img.id} className="relative w-20 h-20 bg-cream overflow-hidden">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <ImageUploader onUpload={files => setNewImages(prev => [...prev, ...files])} label="Upload new images" />

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-gold-filled disabled:opacity-50">
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-gold">CANCEL</button>
        </div>
      </form>
    </div>
  )
}
