'use client'
import { useState, useEffect } from 'react'
import { fetchAccessories, fetchCategories } from '@/lib/api'
import AccessoryCard from '@/components/catalog/AccessoryCard'
import Spinner from '@/components/ui/Spinner'

export default function AccesoriosPage() {
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccessories()
      .then(data => setAccessories(data))
      .catch(() => setAccessories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <span className="section-eyebrow block mb-3">COMPLEMENTS</span>
        <h1 className="section-heading">Exclusive <em>Accessories</em></h1>
      </div>

      {loading ? (
        <Spinner />
      ) : accessories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {accessories.map(acc => (
            <AccessoryCard key={acc.id} accessory={acc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-body text-body-gray">No accessories available at the moment.</p>
        </div>
      )}
    </div>
  )
}
