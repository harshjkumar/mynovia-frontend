'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminCreateDress, adminUploadDressImage, fetchCategories, fetchTags } from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'

export default function NewDressPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState([])

  const [form, setForm] = useState({
    name: '', description: '', category_id: '', price: '',
    inventory_count: 0, delivery_time_days: '',
    is_available: true, featured: false, is_published: false,
    tags: []
  })

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchTags().then(setTags).catch(() => {})
  }, [])

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function toggleTag(tagId) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter(t => t !== tagId) : [...prev.tags, tagId]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const dress = await adminCreateDress({
        ...form,
        category_id: form.category_id || null,
        price: form.price ? parseFloat(form.price) : null,
        delivery_time_days: form.delivery_time_days ? parseInt(form.delivery_time_days) : null
      })

      for (let i = 0; i < images.length; i++) {
        await adminUploadDressImage(dress.id, images[i], i)
      }

      router.push('/admin/vestidos')
    } catch (err) {
      console.error('Dress creation error:', err)
      alert(err.response?.data?.error || err.message || 'Error creating dress')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading text-charcoal mb-8">New Dress</h1>

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
              <option value="">Select...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4}
            className="w-full px-4 py-3 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold resize-y" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Price</label>
            <input type="number" step="0.01" value={form.price} onChange={e => update('price', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Stock</label>
            <input type="number" value={form.inventory_count} onChange={e => update('inventory_count', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Delivery Days</label>
            <input type="number" value={form.delivery_time_days} onChange={e => update('delivery_time_days', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold" />
          </div>
        </div>

        {tags.length > 0 && (
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                  className={`text-xs font-sans tracking-wider px-3 py-1.5 rounded-full border transition-colors ${
                    form.tags.includes(tag.id) ? 'bg-gold text-white border-gold' : 'border-gray-300 text-body-gray hover:border-gold'
                  }`}>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_available} onChange={e => update('is_available', e.target.checked)} className="accent-gold" />
            <span className="text-sm font-sans text-charcoal">Available</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="accent-gold" />
            <span className="text-sm font-sans text-charcoal">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => update('is_published', e.target.checked)} className="accent-gold" />
            <span className="text-sm font-sans text-charcoal">Publish</span>
          </label>
        </div>

        <ImageUploader onUpload={files => setImages(prev => [...prev, ...files])} label="Upload dress images" />

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((file, i) => (
              <div key={i} className="relative w-20 h-24 bg-cream overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-gold-filled disabled:opacity-50">
            {saving ? 'SAVING...' : 'CREATE DRESS'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-gold">CANCEL</button>
        </div>
      </form>
    </div>
  )
}
