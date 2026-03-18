'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminGetAccessories, adminDeleteAccessory } from '@/lib/api'

export default function AdminAccessoriesPage() {
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetAccessories()
      .then(data => setAccessories(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await adminDeleteAccessory(id)
      setAccessories(prev => prev.filter(a => a.id !== id))
    } catch (err) { alert('Error') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading text-charcoal">Accessories</h1>
        <Link href="/admin/accesorios/nueva" className="btn-gold-filled text-[10px]">+ New Accessory</Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Image</th>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Name</th>
              <th className="text-left px-6 py-3 font-sans font-semibold text-xs tracking-wider text-body-gray uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-body-gray">Loading...</td></tr>
            ) : accessories.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-body-gray">No accessories</td></tr>
            ) : accessories.map(acc => (
              <tr key={acc.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="w-12 h-12 bg-cream overflow-hidden">
                    {acc.accessory_images?.[0] && (
                      <img src={acc.accessory_images[0].image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-charcoal">{acc.name}</td>
                <td className="px-6 py-3">
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
    </div>
  )
}
