'use client'
import { useState, useEffect } from 'react'
import { fetchDresses } from '@/lib/api'
import DressGrid from '@/components/catalog/DressGrid'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

export default function CategoryCollection({ categorySlug, categoryName }) {
  const [dresses, setDresses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchDresses({ category: categorySlug })
      .then(data => setDresses(data))
      .catch(() => setDresses([]))
      .finally(() => setLoading(false))
  }, [categorySlug])

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-12 pb-16">
      {/* Header and Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center mb-8">
        <div className="flex items-center justify-center text-[11px] font-sans tracking-[1px] text-[#7A7A7A] mb-4">
          <Link href="/" className="hover:text-charcoal transition-colors underline decoration-transparent hover:decoration-currentColor underline-offset-4">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#a09e9e]">{categoryName} Dresses</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] text-[#333333] font-light tracking-wide">
          {categoryName} Dresses
        </h1>
      </div>

      {/* Collection Grid */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12">
        {loading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : dresses.length > 0 ? (
          <DressGrid dresses={dresses} />
        ) : (
          <div className="text-center py-24 bg-white shadow-sm border border-[#E5E5E5]">
            <h3 className="font-heading text-2xl text-charcoal mb-4">No dresses found</h3>
            <p className="font-body text-[#7A7A7A]">We're currently updating our {categoryName.toLowerCase()} collection. Please check back later.</p>
          </div>
        )}
      </section>
    </div>
  )
}
