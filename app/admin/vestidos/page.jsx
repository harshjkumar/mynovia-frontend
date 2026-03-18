'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminGetDresses, adminDeleteDress } from '@/lib/api'

export default function AdminDressesPage() {
  const [dresses, setDresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadDresses() }, [])

  async function loadDresses() {
    try {
      const data = await adminGetDresses()
      setDresses(data)
    } catch (err) {}
    setLoading(false)
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await adminDeleteDress(id)
      setDresses(prev => prev.filter(d => d.id !== id))
    } catch (err) { alert('Error deleting') }
  }

  const filtered = dresses.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Dresses</h1>
        <Link href="/admin/vestidos/nueva" className="btn-gold-filled text-[10px]">+ New Dress</Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search dresses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 border border-gray-200 bg-white font-sans text-sm focus:outline-none focus:border-gold"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Image</th>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Name</th>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase hidden lg:table-cell">Status</th>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-body-gray">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-body-gray">No dresses found</td></tr>
            ) : filtered.map(dress => (
              <tr key={dress.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="w-12 h-16 bg-cream overflow-hidden">
                    {dress.dress_images?.[0] && (
                      <img src={dress.dress_images[0].image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-charcoal">{dress.name}</td>
                <td className="px-6 py-3 text-body-gray hidden md:table-cell">{dress.categories?.name || '—'}</td>
                <td className="px-6 py-3 hidden lg:table-cell">
                  <div className="flex gap-2">
                    {dress.is_published && <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded font-sans">Published</span>}
                    {dress.featured && <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-sans">Featured</span>}
                    {!dress.is_published && <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-sans">Draft</span>}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/vestidos/${dress.id}`} className="text-xs font-sans text-gold hover:underline">Edit</Link>
                    <button onClick={() => handleDelete(dress.id, dress.name)} className="text-xs font-sans text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
