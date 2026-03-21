'use client'
import { useState, useEffect } from 'react'
import { adminGetDresses, adminGetAccessories, adminGetReviews } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ dresses: 0, accessories: 0, pendingReviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      adminGetDresses(),
      adminGetAccessories(),
      adminGetReviews('pending')
    ]).then(([d, a, r]) => {
      setStats({
        dresses: d.status === 'fulfilled' ? d.value.length : 0,
        accessories: a.status === 'fulfilled' ? a.value.length : 0,
        pendingReviews: r.status === 'fulfilled' ? r.value.length : 0
      })
      setLoading(false)
    })
  }, [])

  const cards = [
    { label: 'Total Dresses', value: stats.dresses, icon: '👗', color: 'bg-pink-50 border-pink-200' },
    { label: 'Total Accessories', value: stats.accessories, icon: '💍', color: 'bg-amber-50 border-amber-200' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: '⭐', color: 'bg-yellow-50 border-yellow-200' }
  ]

  return (
    <div>
      <h1 className="text-2xl font-heading text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map(card => (
          <div key={card.label} className={`p-6 rounded-lg border ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-sans font-semibold tracking-wider text-body-gray uppercase">{card.label}</p>
                <p className="text-3xl font-heading text-charcoal mt-2">
                  {loading ? '—' : card.value}
                </p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="font-sans text-sm font-semibold text-charcoal mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/admin/vestidos/nueva" className="p-4 text-center border border-gray-200 hover:border-gold transition-colors rounded">
            <span className="block text-xl mb-1">➕</span>
            <span className="text-xs font-sans text-charcoal">New Dress</span>
          </a>
          <a href="/admin/accesorios/nueva" className="p-4 text-center border border-gray-200 hover:border-gold transition-colors rounded">
            <span className="block text-xl mb-1">➕</span>
            <span className="text-xs font-sans text-charcoal">New Accessory</span>
          </a>
          <a href="/admin/contenido" className="p-4 text-center border border-gray-200 hover:border-gold transition-colors rounded">
            <span className="block text-xl mb-1">📝</span>
            <span className="text-xs font-sans text-charcoal">Edit Content</span>
          </a>
          <a href="/admin/media" className="p-4 text-center border border-gray-200 hover:border-gold transition-colors rounded">
            <span className="block text-xl mb-1">🖼️</span>
            <span className="text-xs font-sans text-charcoal">Gallery</span>
          </a>
        </div>
      </div>
    </div>
  )
}
