'use client'
import { useState, useEffect } from 'react'
import { fetchCategories, adminUpdateCategory } from '@/lib/api'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newImage, setNewImage] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await fetchCategories()
      setCategories(data || [])
    } catch (err) {
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setEditData({
      name: category.name,
      slug: category.slug,
      image_url: category.image_url || ''
    })
    setNewImage(null)
  }

  const handleSave = async (categoryId) => {
    try {
      setSaving(true)
      const fd = new FormData()
      fd.append('name', editData.name)
      fd.append('slug', editData.slug)
      if (newImage) {
        fd.append('image', newImage)
      } else {
        fd.append('image_url', editData.image_url)
      }

      await adminUpdateCategory(categoryId, fd)
      setSavedMessage('Category updated successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
      setEditingId(null)
      loadCategories()
    } catch (err) {
      console.error('Error updating category:', err)
      const msg = err.response?.data?.error || err.message || 'Unknown error'
      alert(`Error updating category: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setNewImage(null)
  }

  if (loading) {
    return <div className="p-8 text-center font-sans">Loading categories...</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-heading text-charcoal mb-8">Manage Categories</h1>
      
      {savedMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 font-sans text-sm border border-green-100 italic">
          {savedMessage}
        </div>
      )}

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white border border-gray-100 p-6 shadow-sm">
            {editingId === category.id ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Category Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Slug</label>
                    <input
                      type="text"
                      value={editData.slug}
                      onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider text-charcoal uppercase mb-2">Category Image</label>
                  {(editData.image_url || newImage) && (
                    <div className="mb-4 w-40 h-40 bg-cream overflow-hidden border border-gray-100">
                      <img 
                        src={newImage ? URL.createObjectURL(newImage) : editData.image_url} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <ImageUploader onUpload={files => setNewImage(files[0])} label="Change Image" />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleSave(category.id)}
                    disabled={saving}
                    className="btn-gold-filled disabled:opacity-50"
                  >
                    {saving ? 'SAVING...' : 'SAVE CHANGES'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-gold"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-cream flex-shrink-0 overflow-hidden border border-gray-100">
                  {category.image_url ? (
                    <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-body-gray italic font-sans px-2 text-center">No image</div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-heading text-charcoal mb-1">{category.name}</h2>
                  <p className="text-xs text-body-gray font-sans tracking-wide">SLUG: {category.slug}</p>
                </div>
                <button
                  onClick={() => handleEdit(category)}
                  className="text-xs font-sans font-semibold tracking-wider text-gold hover:underline uppercase"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
