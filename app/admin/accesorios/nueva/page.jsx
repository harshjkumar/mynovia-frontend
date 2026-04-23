'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreateAccessory, adminUploadAccessoryImage, fetchCategories } from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'
import LoadingOverlay from '@/components/admin/LoadingOverlay'

export default function NewAccessoryPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])
  const [form, setForm] = useState({
    name: '', description: '', category_id: '', price: '',
    is_available: true, is_published: false,
    display_order: null
  })

  useEffect(() => {
    fetchCategories('accessory').then(data => setCategories(data || []))
  }, [])

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const acc = await adminCreateAccessory({
        ...form,
        category_id: form.category_id || null,
        price: form.price ? parseFloat(form.price) : null
      })

      for (let i = 0; i < images.length; i++) {
        await adminUploadAccessoryImage(acc.id, images[i], i)
      }

      router.push('/admin/accesorios')
    } catch (err) {
      alert('Error creating accessory')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <LoadingOverlay isLoading={saving} message="Saving Accessory & Uploading images..." />
      <h1 className="text-2xl font-heading text-charcoal mb-8">New Accessory</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Name *</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Category</label>
            <select value={form.category_id} onChange={e => update('category_id', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold">
              <option value="">No Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
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

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs font-sans font-semibold text-charcoal uppercase tracking-wider mb-4">Visibility & Status</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gold transition-colors">
              <input type="checkbox" checked={form.is_published} onChange={e => update('is_published', e.target.checked)} className="accent-gold mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-sans font-medium text-charcoal block">Publish</span>
                <span className="text-[11px] font-sans text-body-gray">Makes the accessory visible on the public website. Unpublished = Draft (hidden).</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">
            Display Order
            <span className="ml-2 font-normal normal-case text-body-gray">(Lower number = appears first in lists)</span>
          </label>
          <input
            type="number"
            min="1"
            value={form.display_order || ''}
            placeholder="Leave blank for default order"
            onChange={e => update('display_order', e.target.value ? parseInt(e.target.value) : null)}
            className="w-48 px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <ImageUploader onUpload={files => setImages(prev => [...prev, ...files])} label="Upload images" />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((file, i) => (
              <div key={i} className="relative w-20 h-20 bg-cream overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-gold-filled disabled:opacity-50">
            {saving ? 'SAVING...' : 'CREATE ACCESSORY'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-gold">CANCEL</button>
        </div>
      </form>
    </div>
  )
}
