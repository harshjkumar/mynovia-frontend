'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminGetAccessories, adminDeleteAccessory, adminUpdateAccessory, fetchCategories } from '@/lib/api'
import HeroUploader from '@/components/admin/HeroUploader'

export default function AdminAccessoriesPage() {
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [savingOrder, setSavingOrder] = useState(null)

  useEffect(() => {
    fetchCategories('accessory').then(setCategories).catch(() => {})
    loadAccessories()
  }, [])

  useEffect(() => { loadAccessories() }, [categoryFilter])

  async function loadAccessories() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminGetAccessories()
      setAccessories(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load accessories')
    }
    setLoading(false)
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await adminDeleteAccessory(id)
      setAccessories(prev => prev.filter(a => a.id !== id))
    } catch (err) { alert('Error') }
  }

  async function handleOrderChange(acc, newOrder) {
    const parsedOrder = parseInt(newOrder) || null
    if (parsedOrder === acc.display_order) return
    setSavingOrder(acc.id)
    try {
      if (parsedOrder !== null) {
        const conflict = accessories.find(a => a.id !== acc.id && a.display_order === parsedOrder)
        if (conflict) {
          const oldOrder = acc.display_order || null
          await adminUpdateAccessory(conflict.id, { display_order: oldOrder })
          await adminUpdateAccessory(acc.id, { display_order: parsedOrder })
          setAccessories(prev =>
            prev.map(a => {
              if (a.id === acc.id) return { ...a, display_order: parsedOrder }
              if (a.id === conflict.id) return { ...a, display_order: oldOrder }
              return a
            }).sort(sortByOrder)
          )
        } else {
          await adminUpdateAccessory(acc.id, { display_order: parsedOrder })
          setAccessories(prev =>
            prev.map(a => a.id === acc.id ? { ...a, display_order: parsedOrder } : a).sort(sortByOrder)
          )
        }
      } else {
        await adminUpdateAccessory(acc.id, { display_order: null })
        setAccessories(prev =>
          prev.map(a => a.id === acc.id ? { ...a, display_order: null } : a).sort(sortByOrder)
        )
      }
    } catch (err) { alert('Error saving order') }
    setSavingOrder(null)
  }

  function sortByOrder(a, b) {
    if (a.display_order == null && b.display_order == null) return 0
    if (a.display_order == null) return 1
    if (b.display_order == null) return -1
    return a.display_order - b.display_order
  }

  const filtered = accessories.filter(a => {
    const matchName = a.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoryFilter || a.categories?.slug === categoryFilter
    return matchName && matchCat
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Accessories</h1>
        <Link href="/admin/accesorios/nueva" className="btn-gold-filled text-[10px]">+ New Accessory</Link>
      </div>

      {/* Filters row */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search accessories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Order</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Image</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Name</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase hidden lg:table-cell">Status</th>
              <th className="text-left px-4 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-body-gray">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-red-500">
                {error} — <button onClick={loadAccessories} className="underline text-gold">Retry</button>
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-body-gray">No accessories found</td></tr>
            ) : filtered.map(acc => (
              <tr key={acc.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    defaultValue={acc.display_order || ''}
                    placeholder="—"
                    onBlur={e => {
                      const val = e.target.value
                      if (val !== String(acc.display_order || '')) {
                        handleOrderChange(acc, val)
                      }
                    }}
                    className="w-14 px-2 py-1 border border-gray-200 text-xs font-sans text-center focus:outline-none focus:border-gold bg-white"
                    title="Set display order (lower = shown first)"
                  />
                  {savingOrder === acc.id && <span className="text-[10px] text-gold ml-1">saving…</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="w-12 h-12 bg-cream overflow-hidden">
                    {acc.accessory_images?.[0] && (
                      <img src={acc.accessory_images[0].image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-charcoal">{acc.name}</td>
                <td className="px-4 py-3 text-body-gray hidden md:table-cell">{acc.categories?.name || '—'}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex gap-2">
                    {acc.is_published && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded font-sans">Published</span>}
                    {!acc.is_published && <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-sans">Draft</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/accesorios/${acc.id}`} className="text-xs font-sans text-gold hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(acc.id, acc.name)} className="text-xs font-sans text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-body-gray font-sans mt-3">
        💡 Set the <strong>Order</strong> number to control the sequence (1 = first). Click outside the box to save. Leave blank to sort by newest. Numbers auto-swap if duplicated.
      </p>
    </div>
  )
}
