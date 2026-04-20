'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  adminGetDresses, adminUpdateDress, adminUploadDressImage, adminDeleteDressImage,
  fetchCategories, fetchTags,
  adminGetStyles, adminGetSizes, adminGetColors,
  getDressVariants, adminSaveDressVariants
} from '@/lib/api'
import ImageUploader from '@/components/admin/ImageUploader'
import LoadingOverlay from '@/components/admin/LoadingOverlay'

export default function EditDressPage() {
  const router = useRouter()
  const { id } = useParams()
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [saving, setSaving] = useState(false)
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([])

  // Master lists
  const [allStyles, setAllStyles] = useState([])
  const [allSizes, setAllSizes] = useState([])
  const [allColors, setAllColors] = useState([])

  // Selected options for combination generator
  const [selectedStyles, setSelectedStyles] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedColors, setSelectedColors] = useState([])

  // Current variants
  const [variants, setVariants] = useState([])

  const [form, setForm] = useState({
    name: '', description: '', category_id: '', price: '',
    inventory_count: 0, delivery_time_days: '',
    is_available: true, featured: false, is_published: false,
    display_order: null,
    tags: []
  })

  useEffect(() => {
    fetchCategories('dress').then(setCategories).catch(() => {})
    fetchTags().then(setTags).catch(() => {})
    Promise.all([adminGetStyles(), adminGetSizes(), adminGetColors()])
      .then(([st, si, co]) => {
        setAllStyles(st || [])
        setAllSizes(si || [])
        setAllColors(co || [])
      }).catch(() => {})
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
        display_order: dress.display_order || null,
        tags: (dress.dress_tags || []).map(dt => dt.tag_id)
      })
      setExistingImages((dress.dress_images || []).sort((a, b) => a.display_order - b.display_order))

      // Load existing variants
      const loadedVariants = await getDressVariants(id)
      setVariants(loadedVariants.map(v => ({
        style_id: v.style_id,
        size_id: v.size_id,
        color_id: v.color_id,
        price: v.price?.toString() || '0',
        stock: v.stock || 0,
        sku: v.sku || ''
      })))
      
      // Auto-populate selections based on existing variants
      const sStyles = new Set(loadedVariants.map(v => v.style_id).filter(Boolean))
      const sSizes = new Set(loadedVariants.map(v => v.size_id).filter(Boolean))
      const sColors = new Set(loadedVariants.map(v => v.color_id).filter(Boolean))
      setSelectedStyles(Array.from(sStyles))
      setSelectedSizes(Array.from(sSizes))
      setSelectedColors(Array.from(sColors))

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

  // Multi-select toggles
  function toggleSelection(setFn, id) {
    setFn(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // Select All toggles for each category
  function toggleAllStyles() {
    if (selectedStyles.length === allStyles.length) {
      setSelectedStyles([])
    } else {
      setSelectedStyles(allStyles.map(s => s.id))
    }
  }

  function toggleAllSizes() {
    if (selectedSizes.length === allSizes.length) {
      setSelectedSizes([])
    } else {
      setSelectedSizes(allSizes.map(s => s.id))
    }
  }

  function toggleAllColors() {
    if (selectedColors.length === allColors.length) {
      setSelectedColors([])
    } else {
      setSelectedColors(allColors.map(c => c.id))
    }
  }

  // Generate variants
  function generateCombinations() {
    const defaultPrice = form.price || '0'
    const newVariants = []

    // If nothing selected, maybe just clear?
    if (selectedStyles.length === 0 && selectedSizes.length === 0 && selectedColors.length === 0) {
      if(confirm('No attributes selected. Clear all variants?')) setVariants([])
      return
    }

    const styList = selectedStyles.length > 0 ? selectedStyles : [null]
    const szList = selectedSizes.length > 0 ? selectedSizes : [null]
    const colList = selectedColors.length > 0 ? selectedColors : [null]

    styList.forEach(st => {
      szList.forEach(sz => {
        colList.forEach(co => {
          // See if it already exists to preserve price/stock
          const existing = variants.find(v => v.style_id === st && v.size_id === sz && v.color_id === co)
          if (existing) {
            newVariants.push(existing)
          } else {
            newVariants.push({
              style_id: st, size_id: sz, color_id: co,
              price: defaultPrice, stock: 0, sku: ''
            })
          }
        })
      })
    })

    setVariants(newVariants)
  }

  function updateVariant(index, field, value) {
    const updated = [...variants]
    updated[index][field] = value
    setVariants(updated)
  }

  function removeVariant(index) {
    setVariants(prev => prev.filter((_, i) => i !== index))
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
        inventory_count: variants.length > 0 ? variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0) : form.inventory_count,
        price: form.price ? parseFloat(form.price) : null,
        delivery_time_days: form.delivery_time_days ? parseInt(form.delivery_time_days) : null
      })

      // Try saving variants
      try {
        await adminSaveDressVariants(id, variants.map(v => ({
          ...v,
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0
        })))
      } catch (err) {
        console.error("Failed saving variants", err)
        alert('Dress saved but there was an error saving variants.')
      }

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
    <div className="max-w-4xl pb-20">
      <LoadingOverlay isLoading={saving} message="Saving changes & Uploading images..." />
      <h1 className="text-2xl font-heading text-charcoal mb-8">Edit Dress</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-6 border-b pb-2">Basic Details</h2>
          <div className="space-y-6">
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
                <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Base Price</label>
                <input type="number" step="0.01" min="0" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={form.price} onChange={e => update('price', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Total Stock (Fallback)</label>
                <input type="number" min="0" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} readOnly={variants.length > 0} value={variants.length > 0 ? variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0) : form.inventory_count} onChange={e => update('inventory_count', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Delivery Days</label>
                <input type="number" min="0" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={form.delivery_time_days} onChange={e => update('delivery_time_days', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold [&::-webkit-inner-spin-button]:appearance-none" />
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

            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs font-sans font-semibold text-charcoal uppercase tracking-wider mb-4">Visibility & Status</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gold transition-colors">
                  <input type="checkbox" checked={form.is_available} onChange={e => update('is_available', e.target.checked)} className="accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-sans font-medium text-charcoal block">Available</span>
                    <span className="text-[11px] font-sans text-body-gray">Shows "In Stock" badge on the dress. Uncheck for "On Request".</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gold transition-colors">
                  <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-sans font-medium text-charcoal block">Featured</span>
                    <span className="text-[11px] font-sans text-body-gray">Shows dress on the homepage Featured section carousel.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gold transition-colors">
                  <input type="checkbox" checked={form.is_published} onChange={e => update('is_published', e.target.checked)} className="accent-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-sans font-medium text-charcoal block">Publish</span>
                    <span className="text-[11px] font-sans text-body-gray">Makes the dress visible on the public website. Unpublished = Draft (hidden).</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
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
          </div>
        </div>

        {/* VARIANTS SECTION */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-4 border-b pb-2">Variants (Style / Size / Color)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Styles */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-sans font-semibold tracking-wider text-charcoal uppercase">Select Styles</p>
                <button type="button" onClick={toggleAllStyles} className="px-3 py-1 bg-gold text-white text-xs rounded font-sans font-semibold hover:bg-opacity-90 transition">
                  {selectedStyles.length === allStyles.length && allStyles.length > 0 ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="border border-gray-200 rounded p-3 h-40 overflow-y-auto space-y-2">
                {allStyles.length === 0 ? <p className="text-xs text-body-gray italic">No styles available</p> : allStyles.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedStyles.includes(s.id)} onChange={() => toggleSelection(setSelectedStyles, s.id)} className="accent-gold" />
                    <span className="text-sm font-sans">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-sans font-semibold tracking-wider text-charcoal uppercase">Select Sizes</p>
                <button type="button" onClick={toggleAllSizes} className="px-3 py-1 bg-gold text-white text-xs rounded font-sans font-semibold hover:bg-opacity-90 transition">
                  {selectedSizes.length === allSizes.length && allSizes.length > 0 ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="border border-gray-200 rounded p-3 h-40 overflow-y-auto space-y-2">
                {allSizes.length === 0 ? <p className="text-xs text-body-gray italic">No sizes available</p> : allSizes.map(s => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedSizes.includes(s.id)} onChange={() => toggleSelection(setSelectedSizes, s.id)} className="accent-gold" />
                    <span className="text-sm font-sans">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Colors */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-xs font-sans font-semibold tracking-wider text-charcoal uppercase">Select Colors</p>
                <button type="button" onClick={toggleAllColors} className="px-3 py-1 bg-gold text-white text-xs rounded font-sans font-semibold hover:bg-opacity-90 transition">
                  {selectedColors.length === allColors.length && allColors.length > 0 ? 'Clear All' : 'Select All'}
                </button>
              </div>
              <div className="border border-gray-200 rounded p-3 h-40 overflow-y-auto space-y-2">
                {allColors.length === 0 ? <p className="text-xs text-body-gray italic">No colors available</p> : allColors.map(c => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedColors.includes(c.id)} onChange={() => toggleSelection(setSelectedColors, c.id)} className="accent-gold" />
                    <span className="text-sm font-sans flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: c.hex_code }}></div>
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="button" onClick={generateCombinations} className="btn-gold-filled mb-6 text-xs w-full py-2.5">
            GENERATE COMBINATIONS
          </button>

          {variants.length > 0 && (
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 font-sans font-medium text-charcoal">Style</th>
                    <th className="px-4 py-2 font-sans font-medium text-charcoal">Size</th>
                    <th className="px-4 py-2 font-sans font-medium text-charcoal">Color</th>
                    <th className="px-4 py-2 font-sans font-medium text-charcoal">Price</th>
                    <th className="px-4 py-2 font-sans font-medium text-charcoal">Stock</th>
                    <th className="px-4 py-2 font-sans font-medium text-charcoal text-center">X</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {variants.map((v, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{allStyles.find(x => x.id === v.style_id)?.name || '-'}</td>
                      <td className="px-4 py-2">{allSizes.find(x => x.id === v.size_id)?.name || '-'}</td>
                      <td className="px-4 py-2">{allColors.find(x => x.id === v.color_id)?.name || '-'}</td>
                      <td className="px-4 py-2">
                        <input type="number" step="0.01" min="0" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded focus:border-gold outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min="0" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} value={v.stock} onChange={e => updateVariant(i, 'stock', parseInt(e.target.value)||0)}
                          className="w-20 px-2 py-1 border border-gray-200 rounded focus:border-gold outline-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button type="button" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-heading text-charcoal mb-4 border-b pb-2">Images</h2>
          {existingImages.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Existing Images</label>
              <div className="flex flex-wrap gap-3">
                {existingImages.map(img => (
                  <div key={img.id} className="relative w-24 h-32 bg-cream overflow-hidden group rounded">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ImageUploader onUpload={files => setNewImages(prev => [...prev, ...files])} label="Upload new images" />

          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {newImages.map((file, i) => (
                <div key={i} className="relative w-24 h-32 bg-cream overflow-hidden rounded">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setNewImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#FAF9F6] border-t py-4">
          <button type="submit" disabled={saving} className="btn-gold-filled disabled:opacity-50 px-8">
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-gold px-8">CANCEL</button>
        </div>
      </form>
    </div>
  )
}
