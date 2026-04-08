'use client'
import { useState, useEffect, useMemo } from 'react'
import { fetchAccessories, fetchStyles } from '@/lib/api'
import AccessoryCard from '@/components/catalog/AccessoryCard'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function AccessoryCategoryCollection({ categorySlug, categoryName }) {
  const [accessories, setAccessories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [allStyles, setAllStyles] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setSelectedStyle(null)
    Promise.all([
      fetchAccessories({ category: categorySlug }),
      fetchStyles()
    ])
      .then(([accessoryData, stylesData]) => {
        setAccessories(accessoryData || [])
        setAllStyles(stylesData || [])
      })
      .catch(() => {
        setAccessories([])
        setAllStyles([])
      })
      .finally(() => setLoading(false))
  }, [categorySlug])

  // Extract unique styles from accessories first, fall back to all available styles
  const availableStyles = useMemo(() => {
    const stylesMap = new Map()
    
    // First try to get styles from accessories' variants
    accessories.forEach(accessory => {
      const variants = accessory.accessory_variants || accessory.variants || []
      if (Array.isArray(variants)) {
        variants.forEach(variant => {
          if (variant?.dress_styles) {
            const style = variant.dress_styles
            stylesMap.set(style.id, style)
          }
        })
      }
    })
    
    // If no styles found in variants, use all available styles
    if (stylesMap.size === 0 && Array.isArray(allStyles)) {
      allStyles.forEach(style => {
        stylesMap.set(style.id, style)
      })
    }
    
    return Array.from(stylesMap.values())
  }, [accessories, allStyles])

  // Filter accessories based on selected style
  const filteredAccessories = useMemo(() => {
    if (!selectedStyle) return accessories
    return accessories.filter(accessory => {
      const variants = accessory.accessory_variants || accessory.variants || []
      if (Array.isArray(variants)) {
        return variants.some(variant => variant?.dress_styles?.id === selectedStyle)
      }
      return false
    })
  }, [accessories, selectedStyle])

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-12 pb-24">
      {/* Header and Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center mb-8">
        <div className="flex items-center justify-center text-[11px] font-sans tracking-[1px] text-[#7A7A7A] mb-4">
          <Link href="/" className="hover:text-charcoal transition-colors underline decoration-transparent hover:decoration-currentColor underline-offset-4">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/accessories" className="hover:text-charcoal transition-colors underline decoration-transparent hover:decoration-currentColor underline-offset-4">Accessories</Link>
          <span className="mx-2">/</span>
          <span className="text-[#a09e9e]">{categoryName}</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-[56px] text-[#333333] font-light tracking-wide">
          {categoryName}
        </h1>
      </div>

      {/* Collection Grid */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 mt-8 relative">
        {/* Filter Button */}
        {availableStyles.length > 0 && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-6 py-3 border-2 border-charcoal text-charcoal font-sans font-semibold uppercase tracking-wide hover:bg-charcoal hover:text-white transition-all duration-300 text-sm"
            >
              <span>FILTER</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        )}

        {/* Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && availableStyles.length > 0 && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 bg-black/40 z-40"
              />

              {/* Filter Panel */}
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <h2 className="font-heading text-xl text-charcoal font-light">FILTER</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-charcoal hover:text-gold transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Filter Content */}
                <div className="p-6">
                  {/* Style Filter Section */}
                  <div className="mb-8">
                    <h3 className="font-sans font-semibold text-charcoal uppercase tracking-wide text-sm mb-4">Filter by Style</h3>
                    <button
                      onClick={() => setSelectedStyle(null)}
                      className={`w-full text-left px-4 py-3 border-2 transition-all mb-2 text-sm font-sans ${
                        selectedStyle === null 
                          ? 'border-gold bg-gold text-white' 
                          : 'border-gray-300 text-body-gray hover:border-gold'
                      }`}
                    >
                      All Styles
                    </button>
                    <div className="space-y-2">
                      {availableStyles.map(style => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`w-full text-left px-4 py-3 border-2 transition-all text-sm font-sans ${
                            selectedStyle === style.id 
                              ? 'border-gold bg-gold text-white' 
                              : 'border-gray-300 text-body-gray hover:border-gold'
                          }`}
                        >
                          {style.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="fixed bottom-0 right-0 left-0 max-w-sm bg-white border-t border-gray-200 p-6 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedStyle(null)
                      setIsFilterOpen(false)
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-charcoal font-sans font-semibold uppercase tracking-wide hover:bg-gray-100 transition-all text-sm"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 px-4 py-3 bg-charcoal text-white font-sans font-semibold uppercase tracking-wide hover:bg-opacity-90 transition-all text-sm"
                  >
                    View ({filteredAccessories.length})
                  </button>
                </div>

                {/* Spacer for footer */}
                <div className="h-24" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Spinner /></div>
        ) : accessories.length > 0 ? (
          <>
            {availableStyles.length === 0 && (
              <div className="mb-12 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-700 font-sans">
                  No style filters available. Accessories in this category do not have style variants configured.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAccessories.map((accessory) => (
                <AccessoryCard key={accessory.id} accessory={accessory} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-white shadow-sm border border-[#E5E5E5]">
            <h3 className="font-heading text-2xl text-charcoal mb-4">No accessories found</h3>
            <p className="font-body text-[#7A7A7A]">We're currently updating our {categoryName.toLowerCase()} collection. Please check back later.</p>
          </div>
        )}
      </section>
    </div>
  )
}
