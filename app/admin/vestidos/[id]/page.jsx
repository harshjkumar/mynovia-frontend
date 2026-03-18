'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { adminGetDresses, adminUpdateDress, adminUploadDressImage, adminDeleteDressImage, fetchCategories, fetchTags } from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'

export default function EditDressPage() {
  const router = useRouter()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  const [form, setForm] = useState({
    name: '', description: '', category_id: '', price: '',
    inventory_count: 0, delivery_time_days: '',
    is_available: true, featured: false, is_published: false,
    tags: []
  })

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
    fetchTags().then(setTags).catch(() => {})
    loadDress()
  }, [id])

  async function loadDress() {
    try {
      const all = await adminGetDresses()
      const dress = all.find(d => d.id === id)
      if (!dress) return router.push('/admin/vestidos')

      setForm({
        name: dress.name || '',
        description: dress.description || '',
        category_id: dress.category_id || '',
        price: dress.price?.toString() || '',
        inventory_count: dress.inventory_count || 0,
        delivery_time_days: dress.delivery_time_days?.toString() || '',
        is_available: dress.is_available ?? true,
        featured: dress.featured ?? false,
        is_published: dress.is_published ?? false,
        tags: (dress.dress_tags || []).map(dt => dt.tag_id)
      })
      setExistingImages((dress.dress_images || []).sort((a, b) => a.display_order - b.display_order))
    } catch (err) {}
  }

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function toggleTag(tagId) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter(t => t !== tagId) : [...prev.tags, tagId]
    }))
  }

  async function removeExistingImage(imageId) {
    try {
      await adminDeleteDressImage(imageId)
      setExistingImages(prev => prev.filter(img => img.id !== imageId))
    } catch (err) {}
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await adminUpdateDress(id, {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        delivery_time_days: form.delivery_time_days ? parseInt(form.delivery_time_days) : null
      })

      for (let i = 0; i < newImages.length; i++) {
        await adminUploadDressImage(id, newImages[i], existingImages.length + i)
      }

      router.push('/admin/vestidos')
    } catch (err) {
      alert('Error updating dress')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading text-charcoal mb-8">Edit Dress</h1>

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

        {existingImages.length > 0 && (
          <div>
            <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Existing Images</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map(img => (
                <div key={img.id} className="relative w-20 h-24 bg-cream overflow-hidden group">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ImageUploader onUpload={files => setNewImages(prev => [...prev, ...files])} label="Upload new images" />

        {newImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {newImages.map((file, i) => (
              <div key={i} className="relative w-20 h-24 bg-cream overflow-hidden">
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        )}

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
