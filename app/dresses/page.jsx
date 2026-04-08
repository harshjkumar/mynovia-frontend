'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { fetchDresses, fetchCategories, getPageHero } from '@/lib/api'

export default function DressesPage() {
  const [dresses, setDresses] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedStyle, setSelectedStyle] = useState(null)
  const [availableStyles, setAvailableStyles] = useState([])
  const [heroData, setHeroData] = useState({ image_url: null, title: 'Our Dresses', description: 'Discover our exclusive bridal collection' })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Default descriptions for categories
  const categoryDescriptions = {
    'bride': 'Find the dress of your dreams. Classic, modern, and romantic designs.',
    'party': 'Elegance and sophistication for unforgettable nights.',
    'godmother': 'Distinguished designs for an essential role. Classic cuts and styling.',
    'cocktail': 'Chic, vibrant, and perfectly tailored for the modern celebration.'
  }
  
  useEffect(() => {
    // Load hero data
    getPageHero('dresses').then(data => {
      if (data?.image_url) setHeroData(data)
    }).catch(() => {})

    fetchDresses().then(data => {
      setDresses(data || [])
      // Extract unique styles from dresses
      if (data && Array.isArray(data)) {
        const stylesMap = new Map()
        data.forEach(dress => {
          // Get variants with styles
          if (Array.isArray(dress.variants)) {
            dress.variants.forEach(variant => {
              if (variant.dress_styles) {
                stylesMap.set(variant.dress_styles.id, variant.dress_styles)
              }
            })
          }
        })
        setAvailableStyles(Array.from(stylesMap.values()))
      }
    }).catch(() => setDresses([]))
    
    fetchCategories('dress').then(data => {
      if (data && Array.isArray(data)) {
        const enrichedCategories = data
          .map(cat => ({
            ...cat,
            title: cat.name,
            description: categoryDescriptions[cat.slug] || cat.description || `Discover our exclusive ${cat.name} collection.`
          }))
        setCategories(enrichedCategories)
      }
    }).catch(() => setCategories([]))
  }, [])

  // Use fetched categories, fallback to empty array
  const categoriesData = categories.length > 0 ? categories : []

  // Filter dresses based on selected style
  const filteredDresses = selectedStyle 
    ? dresses.filter(dress => {
        if (Array.isArray(dress.variants)) {
          return dress.variants.some(variant => variant.dress_styles?.id === selectedStyle)
        }
        return false
      })
    : dresses

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="bg-[#FAF9F6] min-h-screen overflow-hidden">
      {/* Redesigned Hero Section */}
      <section ref={heroRef} className="relative w-full h-screen min-h-[700px] overflow-hidden bg-charcoal">
        <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.85 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            src={heroData.image_url || "/images/dresses_hero.png"}
            alt={heroData.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay with gold accent */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          {/* Gold accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
        </motion.div>

        <motion.div 
          style={{ opacity: opacityText }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6 w-full max-w-5xl mx-auto"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.6em' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-[11px] font-sans tracking-[6px] uppercase block mb-6 font-semibold text-gold drop-shadow-lg"
          >
            COLLECTION
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-heading text-6xl md:text-7xl lg:text-8xl font-light mb-8 tracking-wide drop-shadow-lg"
            style={{ textShadow: '0 8px 30px rgba(0,0,0,0.9)' }}
          >
            {heroData.title || 'Our Dresses'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/90 font-body text-base md:text-lg max-w-2xl mb-10 drop-shadow-lg"
          >
            {heroData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link href="#collections" className="group inline-flex items-center gap-4 text-[11px] font-sans tracking-[3px] uppercase hover:text-gold transition-colors font-semibold" style={{ textShadow: '0 3px 10px rgba(0,0,0,0.8)' }}>
              <span>Explore Collections</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <div id="collections" className="bg-[#FAF9F6] relative z-20">
        
        {/* Categories Grid Header */}
        <section className="pt-24 pb-12 px-6 md:px-12 max-w-[1800px] mx-auto text-center border-b border-[#E5E5E5]">
          <h2 className="font-heading text-4xl lg:text-5xl text-[#333] mb-4 font-light">Shop by Category</h2>
          <p className="font-body text-[#7a7a7a] text-sm max-w-xl mx-auto mb-16">
            Explore our curated collections designed to make you shine on your unforgettable day.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesData.map(cat => (
              <Link key={cat.slug} href={`/dresses/${cat.slug}`} className="group block text-left">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] mb-4 group-hover:shadow-lg transition-shadow duration-500">
                  <img
                    src={cat.image_url || cat.image || '/images/cat_bride.png'}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <h3 className="font-heading text-2xl text-[#333] font-light mb-1 group-hover:text-gold transition-colors">{cat.title}</h3>
                <span className="text-[10px] uppercase tracking-[2px] font-sans text-[#a09e9e] border-b border-transparent group-hover:border-gold group-hover:text-gold transition-colors pb-1">Shop Collection</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Category Specific Sections */}

        {categoriesData.map((cat, index) => {
          const catDresses = dresses.filter(d => d.categories?.slug === cat.slug || false)
          const isEven = index % 2 === 0
          
          return (
            <section key={cat.slug} className={`py-20 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto border-b border-[#E5E5E5] last:border-0 ${!isEven ? 'bg-white' : ''}`}>
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch gap-12 lg:gap-24`}>
                
                {/* Category Cover */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="w-full lg:w-5/12 flex-shrink-0"
                >
                  <div className="sticky top-32">
                    <Link href={`/dresses/${cat.slug}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] group-hover:shadow-xl transition-shadow duration-700">
                        <img 
                          src={cat.image_url || cat.image || '/images/cat_bride.png'} 
                          alt={cat.title} 
                          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-black/30">
                          <span className="border border-white px-8 py-3 text-[11px] font-sans tracking-[3px] uppercase">
                            View Category
                          </span>
                        </div>
                      </div>
                    </Link>
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 0.8, delay: 0.3 }}
                       className="mt-8 text-center lg:text-left"
                    >
                      <h2 className="font-heading text-4xl lg:text-5xl text-[#333] mb-4 font-light">{cat.title}</h2>
                      <p className="font-body text-[#7a7a7a] text-sm leading-relaxed max-w-md mx-auto lg:mx-0 pr-6">
                        {cat.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Horizontal Dress Slider */}
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="w-full lg:w-7/12 overflow-hidden flex flex-col justify-center"
                >
                  {catDresses.length > 0 ? (
                    <motion.div 
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.15 } }
                      }}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-10%" }}
                      className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {catDresses.slice(0, 6).map((dress, i) => {
                        const imgUrl = dress.dress_images?.sort((a,b)=>a.display_order-b.display_order)?.[0]?.image_url || 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&q=80';
                        return (
                          <motion.div 
                            variants={{ hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
                            key={dress.id} 
                            className="w-[85%] md:w-[320px] lg:w-[350px] flex-shrink-0 snap-center group block"
                          >
                            <Link href={`/dresses/${dress.slug}`}>
                              <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] mb-5 group-hover:shadow-md transition-shadow">
                                <img src={imgUrl} alt={dress.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              </div>
                              <h3 className="font-heading text-2xl text-[#333] group-hover:text-[#f05f42] transition-colors font-light mb-1 truncate">{dress.name}</h3>
                              <p className="font-sans text-[12px] text-[#b3b3b3] uppercase tracking-wider">{cat.title} Dress</p>
                            </Link>
                          </motion.div>
                      )})}
                      {catDresses.length > 6 && (
                        <div className="w-[85%] md:w-[320px] lg:w-[350px] flex-shrink-0 snap-center flex items-center justify-center bg-transparent border border-[#E5E5E5] group">
                          <Link href={`/dresses/${cat.slug}`} className="flex flex-col items-center gap-3 text-[#333] group-hover:text-[#f05f42] transition-colors p-12">
                            <span className="font-heading text-xl font-light">See all {catDresses.length}</span>
                            <span className="text-[10px] font-sans tracking-[2px] uppercase border-b border-currentColor pb-1">View Category</span>
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[400px] flex items-center justify-center border border-[#E5E5E5] bg-white">
                      <div className="text-center p-8">
                        <p className="font-heading text-2xl text-[#333] mb-2">Coming Soon</p>
                        <p className="font-body text-[#7a7a7a] text-sm">We are currently updating our {cat.title} collection.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
                
              </div>
            </section>
          )
        })}

        {/* All Dresses Section */}
        <section className="py-24 px-6 md:px-12 max-w-[1800px] mx-auto bg-[#FAF9F6] relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-16"
          >
            <h2 className="font-heading text-5xl lg:text-6xl text-[#333] mb-4 font-light text-center">All Our Dresses</h2>
            <p className="font-body text-[#7a7a7a] text-sm leading-relaxed text-center max-w-2xl mx-auto">
              Explore our complete collection of wedding dresses, party wear, and special occasion gowns
            </p>
          </motion.div>

          {/* Style Filter Button */}
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
                      View ({filteredDresses.length})
                    </button>
                  </div>

                  {/* Spacer for footer */}
                  <div className="h-24" />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {filteredDresses.length > 0 ? (
            <motion.div 
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-10%" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredDresses.map((dress) => {
                const imgUrl = dress.dress_images?.sort((a,b)=>a.display_order-b.display_order)?.[0]?.image_url || 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&q=80';
                const categoryName = dress.categories?.name || 'Dress';
                return (
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                    key={dress.id}
                    className="group"
                  >
                    <Link href={`/dresses/${dress.slug}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe8e3] mb-5 group-hover:shadow-lg transition-shadow duration-500">
                        <img 
                          src={imgUrl} 
                          alt={dress.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
                      </div>
                      <h3 className="font-heading text-lg text-[#333] group-hover:text-[#f05f42] transition-colors font-light mb-2 line-clamp-2">{dress.name}</h3>
                      <p className="font-sans text-[11px] text-[#b3b3b3] uppercase tracking-wider">{categoryName}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-[#E5E5E5] bg-white rounded-lg">
              <div className="text-center">
                <p className="font-heading text-2xl text-[#333] mb-2">No Dresses Found</p>
                <p className="font-body text-[#7a7a7a] text-sm">No dresses match the selected style. Try a different filter.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
