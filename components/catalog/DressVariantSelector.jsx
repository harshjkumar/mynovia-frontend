'use client'
import { useState, useMemo, useEffect } from 'react'

export default function DressVariantSelector({ dress, variants }) {
  // If no variants, just display basic info
  if (!variants || variants.length === 0) {
    return (
      <div className="space-y-4 mb-10 p-6 bg-cream/50 border border-bar-tan/30">
        <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
          <span className="text-sm font-sans text-body-gray">Price</span>
          <span className="text-lg font-sans font-medium text-charcoal">
            {dress.price ? `€${dress.price}` : 'Price on request'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
          <span className="text-sm font-sans text-body-gray">Availability</span>
          <span className={`text-sm font-sans font-medium ${dress.is_available && dress.inventory_count > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {dress.is_available && dress.inventory_count > 0 ? 'In stock' : 'Not in stock / Contact for stock'}
          </span>
        </div>
        {dress.delivery_time_days && (
          <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
            <span className="text-sm font-sans text-body-gray">Delivery time</span>
            <span className="text-sm font-sans text-charcoal">{dress.delivery_time_days} days</span>
          </div>
        )}
      </div>
    )
  }

  // Extract unique styles, sizes, colors from variants
  const availableStyles = useMemo(() => {
    const st = new Map()
    variants.forEach(v => {
      if (v.dress_styles) st.set(v.dress_styles.id, v.dress_styles)
    })
    return Array.from(st.values())
  }, [variants])

  const availableSizes = useMemo(() => {
    const sz = new Map()
    variants.forEach(v => {
      if (v.dress_sizes) sz.set(v.dress_sizes.id, v.dress_sizes)
    })
    // Sort sizes by display_order if needed
    return Array.from(sz.values()).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }, [variants])

  const availableColors = useMemo(() => {
    const co = new Map()
    variants.forEach(v => {
      if (v.dress_colors) co.set(v.dress_colors.id, v.dress_colors)
    })
    return Array.from(co.values())
  }, [variants])

  // State for selections
  const [selectedStyle, setSelectedStyle] = useState(availableStyles[0]?.id || null)
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.id || null)
  const [selectedColor, setSelectedColor] = useState(availableColors[0]?.id || null)

  // Find exact matching variant
  const currentVariant = useMemo(() => {
    return variants.find(v => 
      (v.dress_styles?.id === selectedStyle || (!v.dress_styles && !selectedStyle)) &&
      (v.dress_sizes?.id === selectedSize || (!v.dress_sizes && !selectedSize)) &&
      (v.dress_colors?.id === selectedColor || (!v.dress_colors && !selectedColor))
    )
  }, [selectedStyle, selectedSize, selectedColor, variants])


  // Ensure valid selections on mount or data change
  useEffect(() => {
    if (!currentVariant && variants.length > 0) {
      // If current combo is invalid, just pick the first variant
      const first = variants[0]
      if (first.dress_styles?.id) setSelectedStyle(first.dress_styles.id)
      if (first.dress_sizes?.id) setSelectedSize(first.dress_sizes.id)
      if (first.dress_colors?.id) setSelectedColor(first.dress_colors.id)
    }
  }, [currentVariant, variants])


  return (
    <div className="mb-10">
      <div className="space-y-6 mb-8">
        {/* Styles */}
        {availableStyles.length > 0 && (
          <div>
            <h3 className="text-sm font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Style</h3>
            <div className="flex flex-wrap gap-2">
              {availableStyles.map(st => (
                <button 
                  key={st.id} 
                  onClick={() => setSelectedStyle(st.id)}
                  className={`text-sm font-sans px-4 py-2 border transition-colors ${selectedStyle === st.id ? 'border-gold bg-gold text-white' : 'border-gray-300 text-body-gray hover:border-gold hover:text-charcoal'}`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {availableSizes.length > 0 && (
          <div>
            <h3 className="text-sm font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(sz => (
                <button 
                  key={sz.id} 
                  onClick={() => setSelectedSize(sz.id)}
                  className={`text-sm font-sans w-12 h-12 flex items-center justify-center border transition-colors ${selectedSize === sz.id ? 'border-gold bg-gold text-white' : 'border-gray-300 text-body-gray hover:border-gold hover:text-charcoal'}`}
                >
                  {sz.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {availableColors.length > 0 && (
          <div>
            <h3 className="text-sm font-sans font-semibold tracking-wider text-charcoal uppercase mb-3">Color</h3>
            <div className="flex flex-wrap gap-3">
              {availableColors.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setSelectedColor(c.id)}
                  title={c.name}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === c.id ? 'border-gold p-1' : 'border-transparent'}`}
                >
                  <span className="w-full h-full rounded-full border border-gray-200 block" style={{ backgroundColor: c.hex_code }}></span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 p-6 bg-cream/50 border border-bar-tan/30">
        <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
          <span className="text-sm font-sans text-body-gray">Price</span>
          <span className="text-xl font-sans font-medium text-charcoal">
            {currentVariant?.price > 0 ? `€${currentVariant.price}` : (dress.price ? `€${dress.price}` : 'Price on request')}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
          <span className="text-sm font-sans text-body-gray">Availability</span>
          <span className={`text-sm font-sans font-medium ${
            currentVariant
              ? (currentVariant.stock > 0 ? 'text-green-700' : 'text-red-600')
              : (dress.is_available && dress.inventory_count > 0 ? 'text-green-700' : 'text-red-600')
          }`}>
            {currentVariant
              ? (currentVariant.stock > 0 ? 'In stock' : 'Not in stock / Contact for stock')
              : (dress.is_available && dress.inventory_count > 0 ? 'In stock' : 'Not in stock / Contact for stock')
            }
          </span>
        </div>
        {currentVariant?.sku && (
          <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
            <span className="text-sm font-sans text-body-gray">SKU</span>
            <span className="text-sm font-sans text-body-gray">{currentVariant.sku}</span>
          </div>
        )}
        {dress.delivery_time_days && (
          <div className="flex justify-between items-center py-2 border-b border-bar-tan/20">
            <span className="text-sm font-sans text-body-gray">Delivery time</span>
            <span className="text-sm font-sans text-charcoal">{dress.delivery_time_days} days</span>
          </div>
        )}
      </div>
    </div>
  )
}
