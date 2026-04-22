'use client'
import { useState, useEffect } from 'react'
import { fetchCategories, adminUpdateCategory, adminCreateCategory, adminDeleteCategory, fetchSections, adminUpdateSection } from '@/lib/api'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [orderMap, setOrderMap] = useState({ dress: [], accessory: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dress')
  
  const [editingId, setEditingId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editData, setEditData] = useState({})
  const [newImage, setNewImage] = useState(null)
  
  const [savedMessage, setSavedMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [activeTab])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const [catsData, sectionsData] = await Promise.all([
        fetchCategories(activeTab),
        fetchSections().catch(() => [])
      ])
      
      const orderSection = sectionsData?.find(s => s.section_name === 'categories_order')
      const currentOrder = orderSection?.content?.[activeTab] || []
      
      if (orderSection?.content) {
        setOrderMap({
           dress: orderSection.content.dress || [],
           accessory: orderSection.content.accessory || []
        })
      }

      let data = catsData || []
      
      // Sort based on currentOrder array of slugs
      if (currentOrder.length > 0) {
        data.sort((a, b) => {
          const idxA = currentOrder.indexOf(a.slug)
          const idxB = currentOrder.indexOf(b.slug)
          if (idxA === -1 && idxB === -1) return 0
          if (idxA === -1) return 1
          if (idxB === -1) return -1
          return idxA - idxB
        })
      }
      
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setEditingId(null)
    setEditData({ name: '', slug: '', image_url: '', type: activeTab })
    setNewImage(null)
  }

  const handleEdit = (category) => {
    setIsCreating(false)
    setEditingId(category.id)
    setEditData({
      name: category.name,
      slug: category.slug,
      image_url: category.image_url || '',
      type: category.type || 'dress'
    })
    setNewImage(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    try {
      setSaving(true)
      await adminDeleteCategory(id)
      setSavedMessage('Category deleted successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
      loadCategories()
    } catch (err) {
      alert('Error deleting category: ' + (err.response?.data?.error || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const fd = new FormData()
      fd.append('name', editData.name)
      fd.append('slug', editData.slug)
      fd.append('type', editData.type || 'dress')
      if (newImage) {
        fd.append('image', newImage)
      } else if (editData.image_url) {
        fd.append('image_url', editData.image_url)
      }

      if (isCreating) {
        await adminCreateCategory(fd)
        setSavedMessage('Category created successfully!')
      } else {
        await adminUpdateCategory(editingId, fd)
        setSavedMessage('Category updated successfully!')
      }
      
      setTimeout(() => setSavedMessage(''), 3000)
      setEditingId(null)
      setIsCreating(false)
      loadCategories()
    } catch (err) {
      console.error('Error saving category:', err)
      const msg = err.response?.data?.error || err.message || 'Unknown error'
      alert(`Error saving category: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
    setEditData({})
    setNewImage(null)
  }

  const moveCategory = (index, direction) => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === categories.length - 1) return
    
    const newCats = [...categories]
    const temp = newCats[index]
    newCats[index] = newCats[index + (direction === 'up' ? -1 : 1)]
    newCats[index + (direction === 'up' ? -1 : 1)] = temp
    setCategories(newCats)
  }

  const saveOrder = async () => {
    try {
      setSaving(true)
      const newOrderMap = {
        ...orderMap,
        [activeTab]: categories.map(c => c.slug)
      }
      await adminUpdateSection('categories_order', newOrderMap)
      setOrderMap(newOrderMap)
      setSavedMessage('Order saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (err) {
      alert('Error saving order: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Manage Categories</h1>
        <button 
          onClick={handleCreateNew}
          className="btn-gold text-[10px]"
        >
          + ADD CATEGORY
        </button>
      </div>
      
      {savedMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 font-sans text-sm border border-green-100 italic">
          {savedMessage}
        </div>
      )}

      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('dress')}
          className={`px-6 py-3 text-sm font-sans transition-colors border-b-2 -mb-px ${
            activeTab === 'dress' ? 'border-gold text-gold' : 'border-transparent text-body-gray hover:text-charcoal'
          }`}
        >
          Dresses
        </button>
        <button
          onClick={() => setActiveTab('accessory')}
          className={`px-6 py-3 text-sm font-sans transition-colors border-b-2 -mb-px ${
            activeTab === 'accessory' ? 'border-gold text-gold' : 'border-transparent text-body-gray hover:text-charcoal'
          }`}
        >
          Accessories
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-sans text-sm text-charcoal">Use the arrows to reorder categories, then click Save Order.</h2>
        <button onClick={saveOrder} disabled={saving || categories.length === 0} className="btn-gold disabled:opacity-50 text-[10px]">
          SAVE ORDER
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center font-sans">Loading categories...</div>
      ) : (
        <div className="space-y-6">
          {(isCreating || editingId) && (
            <div className="bg-white border text-charcoal border-gold p-6 shadow-sm mb-6">
              <h2 className="text-lg font-heading mb-4">{isCreating ? 'Create New Category' : 'Edit Category'}</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-wider uppercase mb-2">Category Name</label>
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-wider uppercase mb-2">Slug</label>
                    <input
                      type="text"
                      value={editData.slug || ''}
                      onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                      placeholder="Leave blank to auto-generate"
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-semibold tracking-wider uppercase mb-2">Type</label>
                    <select
                      value={editData.type || 'dress'}
                      onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
                    >
                      <option value="dress">Dresses</option>
                      <option value="accessory">Accessories</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold tracking-wider uppercase mb-2">Category Image</label>
                  {(editData.image_url || newImage) && (
                    <div className="mb-4 w-40 h-40 bg-cream overflow-hidden border border-gray-100">
                      <img 
                        src={newImage ? URL.createObjectURL(newImage) : editData.image_url} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <ImageUploader onUpload={files => setNewImage(files[0])} label={editData.image_url || newImage ? 'Change Image' : 'Upload Image'} />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSave}
                    disabled={saving || !editData.name}
                    className="btn-gold-filled disabled:opacity-50"
                  >
                    {saving ? 'SAVING...' : 'SAVE CATEGORY'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-gold"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}

          {categories.map((category, index) => (
            <div key={category.id} className="bg-white border border-gray-100 p-6 shadow-sm flex items-center justify-between gap-6">
              <div className="flex flex-col gap-1 pr-4 border-r border-gray-100">
                <button onClick={() => moveCategory(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-gold disabled:opacity-30">▲</button>
                <button onClick={() => moveCategory(index, 'down')} disabled={index === categories.length - 1} className="text-gray-400 hover:text-gold disabled:opacity-30">▼</button>
              </div>
              <div className="flex items-center gap-6 flex-1">
                <div className="w-24 h-24 bg-cream flex-shrink-0 overflow-hidden border border-gray-100">
                  {category.image_url ? (
                    <img src={category.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-body-gray italic font-sans px-2 text-center">No image</div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-heading text-charcoal mb-1">{category.name}</h2>
                  <p className="text-xs text-body-gray font-sans tracking-wide">SLUG: {category.slug}</p>
                  <p className="text-xs text-gold font-sans tracking-wide mt-1">TYPE: {category.type === 'accessory' ? 'ACCESSORIES' : 'DRESSES'}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-l border-gray-100 pl-6">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-[10px] font-sans font-semibold tracking-wider text-charcoal hover:text-gold uppercase text-right"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-[10px] font-sans font-semibold tracking-wider text-red-500 hover:text-red-700 uppercase text-right"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && !isCreating && !editingId && (
            <div className="p-8 text-center border border-dashed border-gray-300">
              <p className="text-sm font-sans text-body-gray">No categories found in this section.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
