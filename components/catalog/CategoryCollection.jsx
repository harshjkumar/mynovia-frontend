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
    <div className="bg-[#FAF9F6] min-h-screen pt-24 pb-16">
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

      {/* Filter and Sort Bar */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 mb-12">
        <div className="flex items-center justify-between border-t border-b border-[#E5E5E5] py-4 text-xs font-sans tracking-wide text-[#555555]">
          <button className="flex items-center hover:text-charcoal transition-colors uppercase">
            <span>Filter</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          
          <div className="hidden md:block text-[#999999]">
            {dresses.length} products
          </div>

          <button className="flex items-center hover:text-charcoal transition-colors">
            <span>Sort by: <span className="text-charcoal">Best selling</span></span>
            <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
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
